import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InviteSchema } from 'src/schema/invite.schema';
import { ServerSchema } from 'src/schema/server.schema';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

@Module({
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Server',
        schema: ServerSchema,
      },
      {
        name: 'Invite',
        schema: InviteSchema,
      },
    ]),
  ],
})
export class InviteModule {}
