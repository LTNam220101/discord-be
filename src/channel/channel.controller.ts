import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Get,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() dto: CreateChannelDto) {
    return await this.channelService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':channelId')
  async update(
    @Param('channelId') channelId: string,
    @Body() dto: UpdateChannelDto,
  ) {
    return await this.channelService.update(channelId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  async deleteServer(@Body() req: any) {
    return await this.channelService.delete(req.channelId);
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Get('/:channelId')
  //   async getChannelById(@Param('channelId') channelId: string, @Request() req) {
  //     return await this.channelService.getBy(channelId, req.user.id);
  //   }

  @UseGuards(JwtAuthGuard)
  @Get('/getAllChannel/:channelId')
  async getServersPublic(@Param('channelId') channelId: string) {
    return await this.channelService.getAllChannelByServerId(channelId);
  }
}
