/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Server } from './server.schema';
import { User } from './user.schema';

export type UserServerRoleDocument = HydratedDocument<UserServerRole>;

@Schema()
export class UserServerRole {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true })
  serverId: Server;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServerRoleGroup' }],
    require: true,
  })
  serverRoleGroupId: mongoose.Schema.Types.ObjectId[];
}

export const UserServerRoleSchema =
  SchemaFactory.createForClass(UserServerRole);
