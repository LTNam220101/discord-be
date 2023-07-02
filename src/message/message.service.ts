import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelRoleGroup } from 'src/schema/channelRoleGroup.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message')
    private messageRepo: Model<ChannelRoleGroup>,
  ) {}

  async sendMessage(content, channelId, authorId) {
    const insertResult = await this.messageRepo.create({
      author: authorId,
      channelId: channelId,
      content: content,
    });
    return await this.messageRepo
      .findById(insertResult._id)
      .populate('author', 'username avatarUrl');
  }

  async getAllMessages(channelId) {
    return await this.messageRepo
      .find({
        channelId: channelId,
      })
      .sort({
        $natural: 1,
      })
      .limit(20)
      .populate('author', 'username avatarUrl');
  }

  async deleteMessage(messageId) {
    return await this.messageRepo.deleteOne({
      id: messageId,
    });
  }
}
