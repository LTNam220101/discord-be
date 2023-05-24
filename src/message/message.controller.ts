import {
  Controller,
  UseGuards,
  Get,
  Post,
  Param,
  Delete,
  Request,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:channelId')
  async sendMessage(
    @Param('channelId') channelId: string,
    @Request() req,
    @Body() body,
  ) {
    return await this.messageService.sendMessage(
      body.content,
      channelId,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:channelId')
  async getAllMessages(@Param('channelId') channelId: string) {
    return await this.messageService.getAllMessages(channelId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:channelId/:messageId')
  async deleteMessage(@Param('messageId') messageId: string) {
    return await this.messageService.deleteMessage(messageId);
  }
}
