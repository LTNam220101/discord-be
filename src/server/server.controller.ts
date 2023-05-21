import {
  Controller,
  Post,
  UseGuards,
  Body,
  Delete,
  Param,
  Query,
  Get,
  Put,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { InviteService } from 'src/invite/invite.service';
import { UserServerRoleService } from 'src/user/userServerRole.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServerService } from './server.service';
import { ServerRoleService } from './sever-role.service';

@Controller('server')
export class ServerController {
  constructor(
    private serverService: ServerService,
    private serverRoleService: ServerRoleService,
    private userServerRoleService: UserServerRoleService,
    private inviteService: InviteService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createServer(@Body() dto: CreateServerDto) {
    return await this.serverService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update')
  async updateServer(@Body() dto: UpdateServerDto) {
    const { serverId, ...data } = dto;
    return await this.serverService.update(serverId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  async deleteServer(@Body() req: any) {
    return await this.serverService.delete(req.serverId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-servers-by-user')
  async getAllServersJoinedByUser(@Request() req) {
    return await this.serverService.getAllServerJoinedByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-servers-public')
  async getServersPublic(@Query() query: any) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const keyword = query.keyword ? query.keyword : '';
    return await this.serverService.getServerPublic(page, limit, keyword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:serverId')
  async getServerById(@Param('serverId') serverId: string, @Request() req) {
    return await this.serverService.getById(serverId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/response-requests')
  async responseUserRequestJoin(@Body() body) {
    const { userIdRequest, acceptJoin, serverId } = body;
    if (acceptJoin)
      return await this.serverService.joinServer(userIdRequest, serverId);
    else
      return await this.serverService.denyUserRequestJoin(
        userIdRequest,
        serverId,
      );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create-invite/:serverId')
  async createInviteServer(@Param('serverId') serverId: string, @Body() body) {
    return await this.inviteService.createInvite(
      body.userId,
      body.expireTime,
      serverId,
      0,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/kick-user')
  async kickUser(@Body() body) {
    const { userId, serverId } = body;
    return await this.serverService.kickUser(userId, serverId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:serverId/roles')
  async createRoleGroup(@Param('serverId') serverId: string, @Body() body) {
    const { name, rolePolicies } = body;
    return await this.serverRoleService.create(name, serverId, rolePolicies);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:serverId/roles')
  async getAllRoleGroup(
    @Param('serverId') serverId: string,
    @Query('page') page: number,
    @Query('perpage') perpage: number,
  ) {
    return await this.serverRoleService.getAll(serverId, page, perpage);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:serverId/roles/:roleId')
  async deleteRoleGroup(
    @Param('roleId') roleId: string,
    @Param('serverId') serverId: string,
  ) {
    return await this.serverRoleService.delete(roleId, serverId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:serverId/roles/:roleId')
  async getRoleGroup(
    @Param('roleId') roleId: string,
    @Param('serverId') serverId: string,
  ) {
    return await this.serverRoleService.get(roleId, serverId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:serverId/roles/:roleId')
  async updateRoleGroup(
    @Body() body,
    @Param('roleId') roleId: string,
    @Param('serverId') serverId: string,
  ) {
    return await this.serverRoleService.update(serverId, roleId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:serverId/user-role/:roleId')
  async addUserToRoleGroup(
    @Body() body,
    @Param('roleId') roleId: string,
    @Param('serverId') serverId: string,
  ) {
    const { userId } = body;
    return await this.userServerRoleService.update(serverId, roleId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:serverId/user-role/:userId')
  async getDetailRolesUserOnServer(
    @Param('serverId') serverId: string,
    @Param('userId') userId: string,
  ) {
    return await this.userServerRoleService.get(serverId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:serverId/user-role/get-all-members/:roleId')
  async getAllUsersBelongRoleGroup(
    @Param('serverId') serverId: string,
    @Param('roleId') roleId: string,
    @Query('page') page: number,
    @Query('perpage') perpage: number,
  ) {
    return await this.userServerRoleService.getAllUsersBelongRoleGroup(
      serverId,
      roleId,
      page,
      perpage,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:serverId/user-role/users-not-belong/:roleId')
  async getUsersNotBelongRoleGroup(
    @Param('roleId') roleId: string,
    @Param('serverId') serverId: string,
  ) {
    return await this.userServerRoleService.getUsersNotBelongRoleGroup(
      roleId,
      serverId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:serverId/user-role/:roleId/:userId')
  async removeUserFromRoleGroup(
    @Param('roleId') roleId: string,
    @Param('serverId') serverId: string,
    @Param('userId') userId: string,
  ) {
    return await this.userServerRoleService.delete(serverId, roleId, userId);
  }
}
