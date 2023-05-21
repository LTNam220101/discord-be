import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Server } from 'src/schema/server.schema';
import { ServerRoleGroup } from 'src/schema/serverRoleGroup.schema';
import { UserServerRole } from 'src/schema/userServerRole.schema';
import { CreateServerDto } from './dto/create-server.dto';

@Injectable()
export class ServerService {
  constructor(
    @InjectModel('Server')
    private serverRepo: Model<Server>,
    @InjectModel('ServerRoleGroup')
    private serverRoleGroupRepo: Model<ServerRoleGroup>,
    @InjectModel('UserServerRole')
    private userServerRoleRepo: Model<UserServerRole>,
  ) {}

  async create(dto: CreateServerDto) {
    const create = await this.serverRepo.create(dto);
    if (create) {
      await this.update(create._id.toString(), { members: dto.ownerId });
    }
    // create role @everyone default
    const everyone = await this.serverRoleGroupRepo.create({
      serverId: create._id.toString(),
      name: 'everyone',
      rolePolicies: [3, 5],
    });
    // create user_role_server
    await this.userServerRoleRepo.create({
      userId: dto.ownerId,
      serverId: create._id.toString(),
      serverRoleGroupId: [everyone.id],
    });
    return create;
  }

  async update(id: string, data: any) {
    //console.log(data);
    return await this.serverRepo.findByIdAndUpdate(id, data);
  }

  async delete(id: string) {
    const accessToken = await this.serverRepo.findByIdAndDelete(id);
    if (accessToken) {
      return {
        status: 200,
        data: id,
      };
    } else {
      return {
        status: 200,
      };
    }
  }

  async getOwnerServerById(id: string) {
    return (await this.serverRepo.findById(id)).ownerId;
  }

  async getById(id: string, userId: string) {
    try {
      const server = await this.serverRepo.findById(id);
      if (!server) throw new Error(`Cant find Server with id: ${id}`);
      if (!server.members.find((x) => x.toString() === userId))
        throw new Error(`You are not a member of server: ${id}`);
      return server;
    } catch (err) {
      return {
        status: 400,
        data: err.message,
      };
    }
  }

  // get-server-public
  async getServerPublic(page: number, limit: number, keyword: string) {
    try {
      const servers = await this.serverRepo.find(
        {
          isPublic: true,
          name: {
            $regex: keyword,
          },
        },
        {
          name: 1,
          description: 1,
          ownerId: 1,
        },
        {
          skip: (page - 1) * limit,
          limit: limit,
        },
      );
      return {
        status: 200,
        data: servers,
      };
    } catch (err) {
      return {
        status: 400,
        data: err.message,
      };
    }
  }

  async getAllServerJoinedByUser(userId: string) {
    try {
      const serverIds = await this.serverRepo.find(
        {
          members: {
            $in: userId,
          },
        },
        {
          name: 1,
        },
      );
      return {
        status: 200,
        data: serverIds,
      };
    } catch (err) {
      return {
        status: 400,
        data: err.message,
      };
    }
  }

  async joinServer(userId: ObjectId, serverId: string) {
    try {
      const server = await this.serverRepo.findById(serverId);
      if (server.members.includes(userId))
        throw new Error(
          `Cant joined server: User: ${userId} was a member of server`,
        );
      server.members.push(userId);
      server.requestJoinUsers = server.requestJoinUsers.filter(
        (item) => item.toString() !== userId.toString(),
      );

      await Promise.all([
        server.save(),
        //  , ...channels.map(channel => channel.save())
      ]);
      return {
        status: 200,
        data: `UserId: ${userId} join server: ${serverId} success`,
      };
    } catch (err) {
      return {
        status: 400,
        data: err.message,
      };
    }
  }

  async kickUser(userId: ObjectId, serverId: string) {
    try {
      const server = await this.serverRepo.findById(serverId);
      if (!server.members.includes(userId))
        throw new Error(`User: ${userId} not be member of this server`);
      server.members = server.members.filter(
        (item) => item.toString() !== userId.toString(),
      );
      return await server.save();
    } catch (err) {
      return {
        status: 400,
        data: err.message,
      };
    }
  }

  async denyUserRequestJoin(userId: ObjectId, serverId: string) {
    try {
      const server = await this.serverRepo.findById(serverId);
      if (!server) throw new Error(`Cant find server with id: ${serverId}`);
      if (!server.requestJoinUsers.includes(userId))
        throw new Error(
          `User: ${userId} is not request to join server: ${serverId}`,
        );
      server.requestJoinUsers = server.members.filter(
        (item) => item.toString() !== userId.toString(),
      );
      return await server.save();
    } catch (err) {
      return {
        status: 400,
        data: err.message,
      };
    }
  }
}
