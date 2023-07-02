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
export class GatewayGateway implements OnGatewayInit, OnGatewayConnection {
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

  handleConnection(client: Socket, ...args: any[]) {
    console.log('user connected', client.id);
    client.on('disconnecting', (reason) => {
      const iter = client.rooms.values();
      console.log(iter.next().value);
      const leaveChannel = iter.next().value;
      console.log(leaveChannel);
      // Out cac channel khac
      if (leaveChannel) {
        this.server
          .to(leaveChannel)
          .emit('userLeftChannel', { userLeft: client.handshake.query.userId });
      }
    });
  }

  //@UseGuards(JwtSocketGuard)
  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, { channelId, userId }) {
    const channel = await this.channelService.getChannelForSocketIO(channelId);
    const user = await this.userService.findOneById(userId);

    if (!channelId || !channel) {
      client.emit('rejectToChannel');
      return;
    }
    const iter = client.rooms.values();
    console.log(iter.next().value);
    const leaveChannel = iter.next().value;
    // Out cac channel khac
    if (leaveChannel) {
      // socket.to(socket.channelId).emit('userLeftChannel', socket.userId);
      const cacheChannel = JSON.parse(
        (await this.redisClient.get(`channels/${leaveChannel}`)) || null,
      );
      if (cacheChannel) {
        cacheChannel.listActiveUserId = cacheChannel.listActiveUserId.filter(
          (x) => x !== userId,
        );
        await this.redisClient.set(
          `channels/${leaveChannel}`,
          JSON.stringify(cacheChannel),
        );
      }
      this.server.to(leaveChannel).emit('userLeftChannel', {
        userLeft: client.handshake.query.userId,
        cacheChannel,
      });
      client.leave(leaveChannel);
    }

    // Push user vào cache channel
    const cacheChannel = JSON.parse(
      (await this.redisClient.get(`channels/${channelId}`)) || null,
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
    this.server.to(channelId).emit('userJoinedChannel', user);
    if (channel.type === Types.VOICE) {
      this.server.to(channelId).emit('userJoinedVoiceChannel', user);
    }
  }

  //@UseGuards(JwtSocketGuard)
  @SubscribeMessage('setupPeer')
  async setupPeer(
    client: Socket,
    { isInitiator, from, to, channelId, signal },
  ) {
    console.log('setupPeer', isInitiator, from, '-->', to, `[${channelId}]`);

    // Chuyển signal cho các user khác nhận
    this.server
      .to(channelId)
      .emit('setupPeer', { isInitiator, from, to, channelId, signal });
  }

  //@UseGuards(JwtSocketGuard)
  @SubscribeMessage('leaveChannel')
  async leaveChannel(client: Socket, { channelId, userId }) {
    this.server.to(channelId).emit('userLeftChannel', userId);
    client.leave(channelId);
    const cacheChannel = JSON.parse(
      (await this.redisClient.get(`channels/${channelId}`)) || null,
    );
    console.log(cacheChannel);
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

  //@UseGuards(JwtSocketGuard)
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, { content, channelId, userId }) {
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
    this.server.to(channelId).emit('newMessage', newMessage);
  }
}

const arrayToSetArray = (arr) => {
  return [...new Set(arr)];
};
