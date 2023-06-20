import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/schema/message.schema';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ServerSchema } from 'src/schema/server.schema';
import { UserServerRoleSchema } from 'src/schema/userServerRole.schema';
import { ChannelSchema } from 'src/schema/channel.schema';
import { UserChannelRoleSchema } from 'src/schema/userChannelRole.schema';
import { ServerRoleGroupSchema } from 'src/schema/serverRoleGroup.schema';
import { ChannelRoleGroupSchema } from 'src/schema/channelRoleGroup.schema';
@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Message',
        schema: MessageSchema,
      },
      {
        name: 'Server',
        schema: ServerSchema,
      },
      {
        name: 'Channel',
        schema: ChannelSchema,
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
        name: 'ServerRoleGroup',
        schema: ServerRoleGroupSchema,
      },
      {
        name: 'ChannelRoleGroup',
        schema: ChannelRoleGroupSchema,
      },
    ]),
  ],
  exports: [MessageService],
})
export class MessageModule {}
