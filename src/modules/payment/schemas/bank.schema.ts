import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const NOTIFICATION_MODEL = 'bank';

@Schema({ timestamps: true, collection: NOTIFICATION_MODEL })
export class Notification extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: USER_MODEL })
  user_id: string;

  @Prop({ type: String, default: '', required: true })
  name: string;

  @Prop({ type: String, default: '', required: true })
  bank_bin: string;

  @Prop({ type: String, default: '', required: true })
  bank_name: string;

  @Prop({ type: String, default: '', required: true })
  bank_logo: string;

  @Prop({ type: String, default: '', required: true })
  account_no: String;
}

export type NotificationDocument = Notification & Document;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
