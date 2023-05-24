import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { ServerModule } from './server/server.module';
import { ChannelModule } from './channel/channel.module';
import { InviteModule } from './invite/invite.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get('DATABASE_URL'),
        };
      },
    }),
    UserModule,
    AuthModule,
    ServerModule,
    ChannelModule,
    InviteModule,
    MessageModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
