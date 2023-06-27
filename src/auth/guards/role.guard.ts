import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server } from 'src/schema/server.schema';
import { Channel } from 'src/schema/channel.schema';
import { ChannelRoleGroup } from 'src/schema/channelRoleGroup.schema';
import { ServerRoleGroup } from 'src/schema/serverRoleGroup.schema';
import { UserServerRole } from 'src/schema/userServerRole.schema';
import { UserChannelRole } from 'src/schema/userChannelRole.schema';
import ServerPolicy from 'src/constant/ServerPolicy';
import ChannelPolicy from 'src/constant/ChannelPolicy';

const PermissionsGuard = (
  policy: ChannelPolicy | ServerPolicy,
): Type<CanActivate> => {
  @Injectable()
  class PermissionsGuardMixin implements CanActivate {
    constructor(
      @InjectModel('Server')
      private serverRepo: Model<Server>,
      @InjectModel('Channel')
      private channelRepo: Model<Channel>,
      @InjectModel('UserServerRole')
      private userServerRoleRepo: Model<UserServerRole>,
      @InjectModel('ServerRoleGroup')
      private ServerRoleGroupRepo: Model<ServerRoleGroup>,
      @InjectModel('ChannelRoleGroup')
      private channelRoleGroupRepo: Model<ChannelRoleGroup>,
      @InjectModel('UserChannelRole')
      private userChannelRoleRepo: Model<UserChannelRole>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      console.log(policy);
      const serverId = req.params.serverId || req.body.serverId;
      const channelId = req.body.channelId || req.params.channelId;
      const server = await this.serverRepo.findOne({ _id: serverId });
      if (!server) throw new BadRequestException('Server is invalid');
      if (server.ownerId.toString() === req.user.id) return true;
      if (channelId) {
        const channel = await this.channelRepo.findById(channelId);
        if (!channel) throw new BadRequestException('Invalid channel');

        const userRole = await this.userChannelRoleRepo.findOne({
          channelId: channel.id,
          userId: req.user.id,
        });
        if (userRole) {
          const policyChannel = await this.channelRoleGroupRepo.findOne({
            _id: userRole.channelRoleGroupId,
          });
          if (policyChannel?.rolePolicies.includes(policy)) return true;
        }

        const policyChannel = await this.channelRoleGroupRepo.findOne({
          channelId: channel.id,
          name: '@everyone',
        });
        if (policyChannel?.rolePolicies.includes(policy)) return true;
      }
      if (serverId) {
        const role = await this.userServerRoleRepo.findOne({
          serverId: server.id,
          userId: req.user.id,
        });
        if (!role) throw new BadRequestException('You are not a server member');

        const policyServer = await this.ServerRoleGroupRepo.findOne({
          _id: role.serverRoleGroupId,
        });

        if (policyServer.rolePolicies.includes(policy)) return true;
      }
      return false;
    }
  }
  return mixin(PermissionsGuardMixin);
};

export default PermissionsGuard;
