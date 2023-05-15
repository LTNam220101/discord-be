/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Server } from './server.schema';

export type ServerRoleGroupDocument = HydratedDocument<ServerRoleGroup>;

@Schema()
export class ServerRoleGroup {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  rolePolicies: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    require: true,
  })
  serverId: Server;
}

export const ServerRoleGroupSchema =
  SchemaFactory.createForClass(ServerRoleGroup);
