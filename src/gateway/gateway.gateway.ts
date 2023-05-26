import {
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';
import { JwtSocketGuard } from './jwt-socket.guard';
import { UseGuards } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Types } from 'src/schema/channel.schema';

@WebSocketGateway(3006, {
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class GatewayGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private channelService: ChannelService,
    @Inject(CACHE_MANAGER) private readonly redisClient: Cache,
  ) {}

  afterInit(server: any) {
    console.log('after init');
  }

  handleConnection(client: Socket, ...args: any[]) {}

  async handleDisconnect(client: any) {
    const channelId = client?.channelId;
    console.log('User disconnect: ', client.userId, channelId);
    client.leave(channelId);

    this.server.to(channelId).emit('userLeftChannel', client.userId);

    if (channelId) {
      const cacheChannel = JSON.parse(
        await this.redisClient.get(`channels/${channelId}`),
        null,
      );
      if (cacheChannel) {
        cacheChannel.listActiveUserId = cacheChannel.listActiveUserId.filter(
          (x) => x !== client.userId,
        );
        await this.redisClient.set(
          `channels/${channelId}`,
          JSON.stringify(cacheChannel),
        );
      }
    }
  }

  //@UseGuards(JwtSocketGuard)
  @SubscribeMessage('joinChannel')
  async joinChannel(client: any, { channelId, userId }) {
    const channel = await this.channelService.getChannelForSocketIO(channelId);
    const user = await this.userService.findOneById(userId);

    if (!channelId || !channel) {
      client.emit('rejectToChannel');
      return;
    }
    // Out cac channel khac
    if (channelId) {
      // socket.to(socket.channelId).emit('userLeftChannel', socket.userId);
      client.leave(channelId);
      const cacheChannel = JSON.parse(
        (await this.redisClient.get(`channels/${channelId}`)) || null,
      );
      if (cacheChannel) {
        cacheChannel.listActiveUserId = cacheChannel.listActiveUserId.filter(
          (x) => x !== userId,
        );
        await this.redisClient.set(
          `channels/${channelId}`,
          JSON.stringify(cacheChannel),
        );
      }
    }

    // Push user vào cache channel
    const cacheChannel = JSON.parse(
      (await this.redisClient.get(`channels/${channel._id}`)) || null,
    );
    await this.redisClient.set(
      `channels/${channelId}`,
      JSON.stringify({
        listActiveUserId: arrayToSetArray([
          ...(cacheChannel?.listActiveUserId || []),
          userId,
        ]),
      }),
    );

    client.join(channelId);
    console.log('User joined: ', userId, channelId);

    // Lấy channel từ cache

    // Return initial channel data
    client.emit('acceptToChannel', channel);
    if (channel.type === Types.VOICE) {
      client.emit('acceptToVoiceChannel', channel);
    }

    // Emit to all user in channel that a new user joined
    client.to(channelId).emit('userJoinedChannel', user);
    if (channel.type === Types.VOICE) {
      client.to(channelId).emit('userJoinedVoiceChannel', user);
    }
  }

  //@UseGuards(JwtSocketGuard)
  @SubscribeMessage('setupPeer')
  async setupPeer(client: any, { isInitiator, from, to, channelId, signal }) {
    console.log('setupPeer', isInitiator, from, '-->', to, `[${channelId}]`);

    // Chuyển signal cho các user khác nhận
    client
      .to(channelId)
      .emit('setupPeer', { isInitiator, from, to, channelId, signal });
  }

  //@UseGuards(JwtSocketGuard)
  @SubscribeMessage('leaveChannel')
  async leaveChannel(client: any, { channelId, userId }) {
    console.log('User leaveChannel: ', userId, channelId);
    client.leave(channelId);

    this.server.to(channelId).emit('userLeftChannel', userId);

    if (channelId) {
      const cacheChannel = JSON.parse(
        await this.redisClient.get(`channels/${channelId}`),
        null,
      );
      if (cacheChannel) {
        cacheChannel.listActiveUserId = cacheChannel.listActiveUserId.filter(
          (x) => x !== userId,
        );
        await this.redisClient.set(
          `channels/${channelId}`,
          JSON.stringify(cacheChannel),
        );
      }
    }
  }

  //@UseGuards(JwtSocketGuard)
  @SubscribeMessage('sendMessage')
  async sendMessage(client: any, { content, channelId, userId }) {
    console.log({ userId: userId, content, channelId });
    const curChannel = await this.channelService.getChannelForSocketIO(
      channelId,
    );

    // if (!channelId || !curChannel || !curChannel.users?.find((x) => x._id.toString() === userId)) {
    //     socket.emit('rejectToChannel');
    //     return;
    // }
    if (!channelId || !curChannel) {
      client.emit('rejectToChannel');
      return;
    }

    const newMessage = await this.messageService.sendMessage(
      content,
      channelId,
      userId,
    );
    console.log(newMessage);
    this.server.to(channelId).emit('newMessage', newMessage);
  }
}

const arrayToSetArray = (arr) => {
  return [...new Set(arr)];
};
