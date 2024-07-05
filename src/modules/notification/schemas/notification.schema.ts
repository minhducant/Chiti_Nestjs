import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const NOTIFICATION_MODEL = 'notification';
@Schema({ timestamps: true, collection: NOTIFICATION_MODEL })
export class Notification extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: USER_MODEL })
  user_id: string;

  @Prop({ type: [String], default: [], required: false })
  notification_token: string[];

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  data: Record<string, any>;

  @Prop({ type: String, default: '', required: true })
  title: string;

  @Prop({ type: String, default: '', required: false, nullable: true })
  body: string;

  @Prop({ type: Boolean })
  is_read: Boolean;
}

export type NotificationDocument = Notification & Document;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
