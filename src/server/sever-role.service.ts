import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ServerRoleGroup } from 'src/schema/serverRoleGroup.schema';
import { UserServerRole } from 'src/schema/userServerRole.schema';

@Injectable()
export class ServerRoleService {
  constructor(
    @InjectModel('ServerRoleGroup')
    private serverRoleRepo: Model<ServerRoleGroup>,
    @InjectModel('UserServerRole')
    private userServerRoleRepo: Model<UserServerRole>,
  ) {}

  async create(name, serverId, rolePolicies) {
    return await this.serverRoleRepo.create({
      name: name,
      rolePolicies: rolePolicies,
      serverId: serverId,
    });
  }

  async getAll(serverId, page, perpage) {
    return await this.serverRoleRepo.find(
      {
        serverId: serverId,
      },
      {},
      {
        skip: perpage * (page - 1),
        limit: perpage,
      },
    );
  }

  async delete(roleId, serverId) {
    const role = await this.serverRoleRepo.findByIdAndRemove(roleId);
    if (!role || role.serverId.toString() !== serverId)
      throw new Error(`Cant find role group with roleId: ${roleId}`);
    //update all user has server role group which was remove
    await this.userServerRoleRepo.updateMany(
      {
        serverId: role.serverId,
      },
      {
        $pull: {
          serverRoleGroupId: roleId,
        },
      },
    );
  }

  async get(roleId, serverId) {
    const role = await this.serverRoleRepo.findById(roleId);
    if (!role || role.serverId.toString() !== serverId)
      throw new Error(`Cant find role group with roleId: ${roleId}`);
    return role;
  }

  async update(serverId, roleId, data) {
    const role = await this.serverRoleRepo.findOneAndUpdate(
      { _id: roleId, serverId: serverId },
      data,
      {
        new: true,
      },
    );
    if (!role) throw new Error(`Cant find role group with roleId: ${roleId}`);
    return role;
  }
}
