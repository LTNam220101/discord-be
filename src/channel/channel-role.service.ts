import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelRoleGroup } from 'src/schema/channelRoleGroup.schema';
import { ServerRoleGroup } from 'src/schema/serverRoleGroup.schema';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelRoleGroupService {
  constructor(
    @InjectModel('ChannelRoleGroup')
    private channelRoleRepo: Model<ChannelRoleGroup>,
    @InjectModel('ServerRoleGroup')
    private serverRoleRepo: Model<ServerRoleGroup>,
  ) {}

  async create(name, serverId, channelId) {
    const roleServer = await this.serverRoleRepo.findOne({
      name: name,
      serverId: serverId,
    });
    if (!roleServer) throw new Error('Invalid role');

    const roleChannel = await this.channelRoleRepo.findOne({
      name: name,
      channelId: channelId,
    });
    if (roleChannel) throw new Error('Duplicate role in this channel');
    const channelRoleGroup = await this.channelRoleRepo.create({
      name: name,
      channelId: channelId,
      rolePolicies: roleServer.rolePolicies,
    });
    if (!channelRoleGroup) throw new Error("Can't create channel role");
    return channelRoleGroup;
  }

  async getById(id: string) {
    const role = await this.channelRoleRepo.findById(id);
    if (!role) throw new Error('invalid role');
    return role;
  }

  async update(id: string, data: UpdateChannelDto) {
    const role = await this.channelRoleRepo.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!role) throw new Error('Invalid role');
    return role;
  }

  async delete(id: string) {
    return await this.channelRoleRepo.findByIdAndRemove(id);
  }
}
