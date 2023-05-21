/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type InviteDocument = HydratedDocument<Invite>;


@Schema()
export class Invite {
  @Prop({ unique: true })
  inviteCode: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  })
  createBy;

  @Prop()
  expireAt: Date;

  @Prop({
    require: true,
    // default 7 days, unit = milisecond
    default: 7 * 24 * 60 * 60 * 1000,
  })
  expireTime: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  })
  source;

  @Prop({
    default: 0,
  })
  inviteType: number;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
