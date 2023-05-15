/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Channel } from './channel.schema';
import { User } from './user.schema';

export type ChannelRoleGroupDocument = HydratedDocument<ChannelRoleGroup>;

@Schema()
export class ChannelRoleGroup {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  rolePolicies: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    require: true,
  })
  channelId: Channel;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
    require: true,
  })
  memberIds: User[];
}

export const ChannelRoleGroupSchema =
  SchemaFactory.createForClass(ChannelRoleGroup);
