import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InviteModule } from 'src/invite/invite.module';
import { ServerSchema } from 'src/schema/server.schema';
import { ServerRoleGroupSchema } from 'src/schema/serverRoleGroup.schema';
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
    ]),
    InviteModule,
  ],
})
export class ServerModule {}
