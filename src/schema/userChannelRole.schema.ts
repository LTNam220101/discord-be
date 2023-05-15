/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Channel } from './channel.schema';
import { ChannelRoleGroup } from './ChannelRoleGroup.schema';
import { User } from './user.schema';

export type UserChannelRoleDocument = HydratedDocument<UserChannelRole>;

@Schema()
export class UserChannelRole {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  })
  ChannelId: Channel;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChannelRoleGroup' }],
    require: true,
  })
  channelRoleGroupId: ChannelRoleGroup;
}

export const UserChannelRoleSchema =
  SchemaFactory.createForClass(UserChannelRole);
