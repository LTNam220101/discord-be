import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel } from 'src/schema/channel.schema';
import { Invite } from 'src/schema/invite.schema';
import { Server } from 'src/schema/server.schema';

@Injectable()
export class InviteService {
  constructor(
    @InjectModel('Server')
    private serverRepo: Model<Server>,
    @InjectModel('Server')
    private channelRepo: Model<Channel>,
    @InjectModel('Invite')
    private inviteRepo: Model<Invite>,
  ) {}

  async createInvite(owner, expire, sourceId, type) {
    const src = !type
      ? await this.serverRepo.findById(sourceId)
      : await this.channelRepo.findById(sourceId);
    if (!src) throw new Error(`SourceId : ${sourceId} is not exist`);
    const expireAt = new Date(Date.now() + expire);
    console.log(expire, new Date(Date.now() + expire));
    const newInvite = await this.inviteRepo.create({
      inviteCode: generateRandomCode(),
      createBy: owner,
      expireTime: expire,
      source: sourceId,
      inviteType: type,
      expireAt: expireAt,
    });
    if (!newInvite) throw new Error(`Cant create invite link`);
    return newInvite;
  }

  async getInviteByCode(code) {
    const invite = await this.inviteRepo.findOne({
      inviteCode: code,
    });
    if (!invite) throw new Error(`Cant get invite by code: ${code}`);
    return invite;
  }
}

const generateRandomCode = () => {
  return Math.floor(Math.random() * Date.now()).toString(16);
};
