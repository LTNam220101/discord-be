import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelModule } from 'src/channel/channel.module';
import { MessageModule } from 'src/message/message.module';
import { ChannelSchema } from 'src/schema/channel.schema';
import { MessageSchema } from 'src/schema/message.schema';
import { UserSchema } from 'src/schema/user.schema';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from './cache.module';
import { GatewayGateway } from './gateway.gateway';

@Module({
  imports: [
    UserModule,
    MessageModule,
    ChannelModule,
    CacheModule,
    MongooseModule.forFeature([
      {
        name: 'Message',
        schema: MessageSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Channel',
        schema: ChannelSchema,
      },
    ]),
    JwtModule.register({
      // secret: JWT_SECRET,
      // signOptions: { expiresIn: JWT_EXPIRESIN },
    }),
  ],
  providers: [GatewayGateway],
})
export class GatewayModule {}
