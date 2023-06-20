import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schema/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ServerSchema } from 'src/schema/server.schema';
import { UserServerRoleSchema } from 'src/schema/userServerRole.schema';
import { UserServerRoleService } from './userServerRole.service';
import { InviteModule } from 'src/invite/invite.module';
import { ServerModule } from 'src/server/server.module';
import { InviteSchema } from 'src/schema/invite.schema';
import { ChannelSchema } from 'src/schema/channel.schema';
import { UserChannelRoleSchema } from 'src/schema/userChannelRole.schema';
import { ServerRoleGroupSchema } from 'src/schema/serverRoleGroup.schema';
import { ChannelRoleGroupSchema } from 'src/schema/channelRoleGroup.schema';

@Module({
  providers: [UserService, UserServerRoleService],
  exports: [UserService, UserServerRoleService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
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
    InviteModule,
    ServerModule,
  ],
  controllers: [UserController],
})
export class UserModule {}
