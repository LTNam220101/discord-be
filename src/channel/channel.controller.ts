import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Get,
  Request,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import PermissionsGuard from 'src/auth/guards/role.guard';
import ChannelPolicy from 'src/constant/ChannelPolicy';
import ServerPolicy from 'src/constant/ServerPolicy';
import { ChannelRoleGroupService } from './channel-role.service';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private channelRoleGroupService: ChannelRoleGroupService,
  ) {}

  @UseGuards(PermissionsGuard(ServerPolicy.CREATE_CHANNEL))
  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() dto: CreateChannelDto) {
    return await this.channelService.create(dto);
  }

  @UseGuards(PermissionsGuard(ServerPolicy.READ_CHANNEL))
  @UseGuards(JwtAuthGuard)
  @Get('/getAll/:serverId')
  async getAllByServer(@Param('serverId') serverId: string) {
    return await this.channelService.getAllChannelByServerId(serverId);
  }

  @UseGuards(PermissionsGuard(ChannelPolicy.MANAGE_CHANNEL))
  @UseGuards(JwtAuthGuard)
  @Put('/:channelId')
  async update(@Param('channelId') channelId: string, @Request() data) {
    return await this.channelService.update(channelId, data);
  }

  @UseGuards(PermissionsGuard(ChannelPolicy.MANAGE_CHANNEL))
  @UseGuards(JwtAuthGuard)
  @Delete('/:channelId')
  async delete(@Param('channelId') channelId: string) {
    return await this.channelService.delete(channelId);
  }

  @UseGuards(PermissionsGuard(ChannelPolicy.VIEW_CHANNEL))
  @UseGuards(JwtAuthGuard)
  @Get('/:channelId')
  async getById(@Param('channelId') channelId: string) {
    return await this.channelService.getById(channelId);
  }

  @UseGuards(PermissionsGuard(ServerPolicy.MANAGE_ROLE))
  @UseGuards(JwtAuthGuard)
  @Post('/:channelId/role')
  async createRoleChannel(@Body() dto, @Param('channelId') channelId: string) {
    const { name, serverId } = dto;
    return await this.channelRoleGroupService.create(name, serverId, channelId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:channelId/role/:roleId')
  async getRoleChannelById(@Param('roleId') roleId: string) {
    return await this.channelRoleGroupService.getById(roleId);
  }

  @UseGuards(PermissionsGuard(ChannelPolicy.MANAGE_ROLE))
  @UseGuards(JwtAuthGuard)
  @Put('/:channelId/role/:roleId')
  async updateRoleChannel(@Body() dto, @Param('channelId') channelId: string) {
    return await this.channelRoleGroupService.update(channelId, dto);
  }

  @UseGuards(PermissionsGuard(ChannelPolicy.MANAGE_ROLE))
  @UseGuards(JwtAuthGuard)
  @Delete('/:channelId/role/:roleId')
  async deleteRoleChannel(@Param('channelId') channelId: string) {
    return await this.channelRoleGroupService.delete(channelId);
  }
}
