/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Server } from './server.schema';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({
    required: true,
    minLength: 7,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    minLength: 7,
  })
  password: string;

  @Prop({ default: '' })
  avatarUrl: string;

  @Prop({ default: 1 })
  status: number;

  @Prop({})
  hashRefeshToken: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
    default: [],
  })
  requestJoinsServer: Server[];
}

export const UserSchema = SchemaFactory.createForClass(User);
