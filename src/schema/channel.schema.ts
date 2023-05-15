/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Server } from './server.schema';
import { User } from './user.schema';

export type ChannelDocument = HydratedDocument<Channel>;

enum Types {
  TEXT,
  VOICE,
}

@Schema()
export class Channel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description;

  @Prop({ defaultValue: true })
  isPrivate: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];

  @Prop({
    type: Array,
    default: [],
  })
  role_group: string[];

  @Prop({ require: true, default: Types.TEXT })
  type: Types;

  @Prop({ type: mongoose.Schema.Types.Array })
  inviteLinkIds: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    require: true,
  })
  serverId: Server;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
