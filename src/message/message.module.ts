import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/schema/message.schema';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Message',
        schema: MessageSchema,
      },
    ]),
  ],
})
export class MessageModule {}
