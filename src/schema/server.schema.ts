/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type ServerDocument = HydratedDocument<Server>;

@Schema()
export class Server {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ defaultValue: false })
  isPublic: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  ownerId: User;

  @Prop({ type: mongoose.Schema.Types.Array })
  inviteLinkIds: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members: mongoose.Schema.Types.ObjectId[];

  @Prop()
  requestJoinUsers: mongoose.Schema.Types.ObjectId[];
}

export const ServerSchema = SchemaFactory.createForClass(Server);
