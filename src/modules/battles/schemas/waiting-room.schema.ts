import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const WAITING_ROOM_MODEL = 'waiting_room';

@Schema({ timestamps: true, collection: WAITING_ROOM_MODEL })
export class WaitingRoom extends Document {
  @Prop({
    required: true,
    ref: USER_MODEL,
    type: MongooseSchema.Types.ObjectId,
  })
  player: string;
}

export type WaitingRoomDocument = WaitingRoom & Document;

export const WaitingRoomSchema = SchemaFactory.createForClass(WaitingRoom);

WaitingRoomSchema.index({ player: 1 });
