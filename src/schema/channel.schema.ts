/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChannelDocument = HydratedDocument<Channel>;

export enum Types {
  TEXT = 0,
  VOICE = 1,
}

@Schema()
export class Channel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ defaultValue: true })
  isPrivate: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: Array,
    default: [],
  })
  role_group: string[];

  @Prop({ require: true, default: Types.TEXT })
  type: Types;

  @Prop({ type: mongoose.Schema.Types.Array, default: [] })
  inviteLinkIds: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    require: true,
  })
  serverId: mongoose.Schema.Types.ObjectId;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
