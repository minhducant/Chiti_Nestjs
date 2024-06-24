import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const NOTIFICATION_TOKEN_MODEL = 'notification_token';

@Schema({ timestamps: true, collection: NOTIFICATION_TOKEN_MODEL })
export class NotificationToken extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: USER_MODEL,
  })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, default: '', required: true })
  notification_token: string;

  @Prop({ type: String, required: false })
  device_type?: string;

  @Prop({ type: String, required: false, default: 'ACTIVE' })
  status?: string;
}

export type NotificationTokenDocument = NotificationToken & Document;

export const NotificationTokenSchema = SchemaFactory.createForClass(
  NotificationToken,
);
