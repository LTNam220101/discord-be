import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto.service';
import { JwtRefreshStrategy, LocalStrategy } from './strategies';
import { JwtStrategy } from './strategies';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schema/user.schema';
import { ServerSchema } from 'src/schema/server.schema';
import { UserServerRoleSchema } from 'src/schema/userServerRole.schema';
import { ChannelSchema } from 'src/schema/channel.schema';
import { UserChannelRoleSchema } from 'src/schema/userChannelRole.schema';
import { ServerRoleGroupSchema } from 'src/schema/serverRoleGroup.schema';
import { ChannelRoleGroupSchema } from 'src/schema/channelRoleGroup.schema';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
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
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CryptoService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
