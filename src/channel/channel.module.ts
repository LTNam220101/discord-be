import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSchema } from 'src/schema/channel.schema';
import { ServerSchema } from 'src/schema/server.schema';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService],
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
    ]),
  ],
})
export class ChannelModule {}
