import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const BATTLES_MODEL = 'battles';

export enum StatusEnum {
  waiting = 0,
  prepare = 1,
  active = 2,
  finished = 3,
}

export enum TypeEnum {
  bot = 0,
  solo = 1,
  friend = 2,
}

export enum StyleEnum {
  small = 0,
  normal = 1,
  large = 2,
}

@Schema({ timestamps: true, collection: BATTLES_MODEL })
export class Battles extends Document {
  @Prop({
    required: false,
    unique: true,
  })
  room: string;

  @Prop({
    required: true,
    ref: USER_MODEL,
    type: [MongooseSchema.Types.ObjectId],
  })
  players: string[];

  @Prop({
    required: false,
    ref: USER_MODEL,
    type: MongooseSchema.Types.ObjectId,
  })
  current_player: string;

  @Prop({
    required: true,
    type: Number,
    enum: StyleEnum,
    default: StyleEnum.normal,
  })
  style: StyleEnum;

  @Prop({
    required: true,
    type: Number,
    enum: TypeEnum,
    default: TypeEnum.solo,
  })
  type: TypeEnum;

  @Prop({
    required: true,
    type: Number,
    enum: StatusEnum,
  })
  status: StatusEnum;

  @Prop({
    required: false,
    ref: USER_MODEL,
    type: MongooseSchema.Types.ObjectId,
  })
  winner: string;

  @Prop({
    required: false,
    default: 30,
  })
  timer: Number;

  @Prop({
    required: true,
    default: {},
    type: Object,
  })
  board: {
    [playerId: string]: string[];
  };

  @Prop({
    required: false,
    default: [],
    type: [String],
  })
  selected_squares: string[];
}

export type BattlesDocument = Battles & Document;

export const BattlesSchema = SchemaFactory.createForClass(Battles);

BattlesSchema.index({ players: 1 });
BattlesSchema.index({ code: 1 });
BattlesSchema.index({ status: 1 });
