import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { InviteModule } from 'src/invite/invite.module';
import { ChannelSchema } from 'src/schema/channel.schema';
import { ChannelRoleGroupSchema } from 'src/schema/channelRoleGroup.schema';
import { ServerSchema } from 'src/schema/server.schema';
import { ServerRoleGroupSchema } from 'src/schema/serverRoleGroup.schema';
import { UserChannelRoleSchema } from 'src/schema/userChannelRole.schema';
import { UserServerRoleSchema } from 'src/schema/userServerRole.schema';
import { UserServerRoleService } from 'src/user/userServerRole.service';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { ServerRoleService } from './sever-role.service';

@Module({
  controllers: [ServerController],
  providers: [ServerService, ServerRoleService, UserServerRoleService],
  exports: [ServerService, ServerRoleService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Server',
        schema: ServerSchema,
      },
      {
        name: 'ServerRoleGroup',
        schema: ServerRoleGroupSchema,
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
        name: 'ChannelRoleGroup',
        schema: ChannelRoleGroupSchema,
      },
      {
        name: 'Channel',
        schema: ChannelSchema,
      },
    ]),
    InviteModule,
  ],
})
export class ServerModule {}
