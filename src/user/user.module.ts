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
        name: 'UserServerRole',
        schema: UserServerRoleSchema,
      },
      {
        name: 'Invite',
        schema: InviteSchema,
      },
    ]),
    InviteModule,
    ServerModule,
  ],
  controllers: [UserController],
})
export class UserModule {}
