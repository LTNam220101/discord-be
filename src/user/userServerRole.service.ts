import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserServerRole } from 'src/schema/userServerRole.schema';

@Injectable()
export class UserServerRoleService {
  constructor(
    @InjectModel('UserServerRole')
    private userServerRoleRepo: Model<UserServerRole>,
  ) {}

  //   async create(name, serverId, rolePolicies, userId) {
  //     const newRole = await this.serverRoleRepo.create({
  //       name: name,
  //       rolePolicies: rolePolicies,
  //       serverId: serverId,
  //     });
  //     const addToRoleEveryonePromise = await this.userServerRoleRepo.create({
  //       serverId: serverId,
  //       userId: userId,
  //       serverRoleGroupId: [newRole.id],
  //     });
  //   }

  async getAllUsersBelongRoleGroup(serverId, serverRoleGroupId, page, perpage) {
    return await this.userServerRoleRepo.find(
      {
        serverId: serverId,
        serverRoleGroupId: {
          $in: [serverRoleGroupId],
        },
      },
      {
        userId: 1,
      },
      {
        skip: perpage * (page - 1),
        limit: perpage,
      },
    );
  }

  async delete(serverId, serverRoleGroupId, userId) {
    const user = await this.userServerRoleRepo.findOne({
      userId: userId,
      serverId: serverId,
    });
    if (!user)
      throw new Error(`Cant find role group with roleId: ${serverRoleGroupId}`);
    if (!user.serverRoleGroupId.includes(serverRoleGroupId))
      throw new Error(
        `User: ${user} is not belong this role group: ${serverRoleGroupId}`,
      );
    user.serverRoleGroupId = user.serverRoleGroupId.filter(
      (item) => item.toString() != serverRoleGroupId,
    );
    return await this.userServerRoleRepo.findOneAndUpdate(
      {
        userId: userId,
        serverId: serverId,
      },
      {
        serverRoleGroupId: user.serverRoleGroupId,
      },
      { new: true },
    );
  }

  async get(serverId, userId) {
    const user = await this.userServerRoleRepo.findOne({
      userId: userId,
      serverId: serverId,
    });
    if (!user) throw new Error(`Cant find role group with roleId: ${serverId}`);
    return user;
  }

  async update(serverId, serverRoleGroupId, userId) {
    const user = await this.userServerRoleRepo.findOne({
      userId: userId,
      serverId: serverId,
    });
    if (!user)
      throw new Error(`Cant find role group with roleId: ${serverRoleGroupId}`);
    if (user.serverRoleGroupId.includes(serverRoleGroupId))
      throw new Error(
        `User: ${userId} already had this role group: ${serverRoleGroupId}`,
      );
    user.serverRoleGroupId.push(serverRoleGroupId);
    return await this.userServerRoleRepo.findOneAndUpdate(
      {
        userId: userId,
        serverId: serverId,
      },
      {
        serverRoleGroupId: user.serverRoleGroupId,
      },
      { new: true },
    );
  }

  async getUsersNotBelongRoleGroup(roleId, serverId) {
    return await this.userServerRoleRepo.find(
      {
        serverId: serverId,
        serverRoleGroupId: {
          $nin: [roleId],
        },
      },
      {
        userId: 1,
      },
    );
  }
}
