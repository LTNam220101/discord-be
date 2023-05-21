import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { Server } from 'src/schema/server.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userRepo: Model<User>,
    @InjectModel('Server')
    private serverRepo: Model<Server>,
  ) {}

  async findOneById(id: string) {
    return await this.userRepo.findById(id);
  }

  async findOneByUsername(username: string) {
    return await this.userRepo.findOne({
      username: username,
    });
  }

  async createNewUser(data: any) {
    return await this.userRepo.create(data);
  }

  async updateUser(id: string, data: any) {
    const res = await this.userRepo.findByIdAndUpdate(id, data);
    return res;
  }

  async requestJoinServer(userId, serverId) {
    const server = await this.serverRepo.findById(serverId);
    if (!server) throw new Error(`Can not find server with ID: ${serverId}`);
    if (server.members.includes(userId))
      throw new Error(`User was a member of server: ${serverId}`);
    if (server.requestJoinUsers.includes(userId))
      throw new Error(
        `You already make a requested not long ago to join this server`,
      );
    server.requestJoinUsers.push(userId);
    await server.save();
    return {
      status: 200,
      data: {},
    };
  }
}
