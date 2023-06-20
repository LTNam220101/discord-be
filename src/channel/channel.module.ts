import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSchema } from 'src/schema/channel.schema';
import { ChannelRoleGroupSchema } from 'src/schema/channelRoleGroup.schema';
import { MessageSchema } from 'src/schema/message.schema';
import { ServerSchema } from 'src/schema/server.schema';
import { ServerRoleGroupSchema } from 'src/schema/serverRoleGroup.schema';
import { UserChannelRoleSchema } from 'src/schema/userChannelRole.schema';
import { UserServerRoleSchema } from 'src/schema/userServerRole.schema';
import { ChannelRoleGroupService } from './channel-role.service';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRoleGroupService],
  exports: [ChannelService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Channel',
        schema: ChannelSchema,
      },
      {
        name: 'Server',
        schema: ServerSchema,
      },
      {
        name: 'ServerRoleGroup',
        schema: ServerRoleGroupSchema,
      },
      {
        name: 'ChannelRoleGroup',
        schema: ChannelRoleGroupSchema,
      },
      {
        name: 'UserServerRole',
        schema: UserServerRoleSchema,
      },
      {
        name: 'UserChannelRole',
        schema: UserChannelRoleSchema,
      },
      {
        name: 'Message',
        schema: MessageSchema,
      },
    ]),
  ],
})
export class ChannelModule {}
