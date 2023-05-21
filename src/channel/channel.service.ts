import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel } from 'src/schema/channel.schema';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Server } from 'src/schema/server.schema';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel('Channel')
    private channelRepo: Model<Channel>,
    @InjectModel('Server')
    private serverRepo: Model<Server>,
  ) {}

  async create(dto: CreateChannelDto) {
    try {
      const server = await this.serverRepo.findById(dto.serverId);
      if (!server) {
        throw new Error('Invalid server');
      }
      const data = { ...dto, users: [dto.userId] };
      const newChannel = this.channelRepo.create(data);
      if (!newChannel) throw new Error("Can't create channel");

      return newChannel;
    } catch (error) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  async getAllChannelByServerId(id: string) {
    try {
      return await this.channelRepo.find({ serverId: id });
    } catch (error) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  async update(id: string, data: UpdateChannelDto) {
    try {
      return await this.channelRepo.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  async delete(id: string) {
    try {
      await this.channelRepo.findByIdAndRemove(id);
    } catch (error) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  //   async getById(id: string) {
  //     try {
  //       const channel = await this.channelRepo
  //         .findById(id)
  //         .populate('users', 'fullname avatarUrl email');
  //       if (!channel) throw new Error('invalid channel');
  //       const messages = await MessageModel.find({
  //         channelId: channel.id,
  //       }).populate('author', 'fullname avatarUrl');
  //       return {
  //         status: OK,
  //         data: {
  //           ...channel._doc,
  //           messages,
  //         },
  //       };
  //     } catch (error) {
  //       return {
  //         status: ERR,
  //         message: error.message,
  //       };
  //     }
  //   }

  async getChannelForSocketIO(channelId: string) {
    try {
      return await this.channelRepo
        .findById(channelId)
        .populate('users', 'fullname');
    } catch (error) {
      return null;
    }
  }
}
