import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export enum FriendStatus {
  SENT = 'sent',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked',
}

export const FRIEND_MODEL = 'friend';

export type FriendDocument = Friend & Document;

@Schema({ timestamps: true, collection: FRIEND_MODEL })
export class Friend {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: USER_MODEL,
  })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: USER_MODEL,
  })
  friend_id: string;

  @Prop({ enum: FriendStatus, default: FriendStatus.ACCEPTED })
  status: FriendStatus;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
