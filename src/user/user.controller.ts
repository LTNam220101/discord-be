import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { InviteService } from 'src/invite/invite.service';
import { ServerService } from 'src/server/server.service';
import { ObjectId } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private inviteService: InviteService,
    private serverService: ServerService,
  ) {}
  // private pagingService: PaginationService,

  //   @Get('/invite/:code')
  //   async signIn(@Param('id', new ParseIntPipe()) code: number, @Req() req) {
  //     return await this.userService.joinWithLink(code);
  //   }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = await this.userService.findOneById(id);
    res.hashRefeshToken = undefined;
    res.password = undefined;
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/invite/:code')
  async joinWithLink(@Param('code') code: string, @Request() req) {
    const invite = await this.inviteService.getInviteByCode(code);
    if (!invite) {
      throw new Error(`Cannot find invite code: ${code}`);
    }
    if (invite.inviteType === 0) {
      return await this.serverService.joinServer(req.user.id, invite.source);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/request-join-server/:serverId')
  async requestJoinServer(@Param('serverId') serverId: string, @Request() req) {
    return await this.userService.requestJoinServer(req.user.id, serverId);
  }
}
