import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { StatusEnum } from '../enum/debt.enum';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import { NOTE_MODEL } from 'src/modules/note/schemas/note.schema';

export const DEBT_MODEL = 'debt';

@Schema({ timestamps: true, collection: DEBT_MODEL })
export class Debt extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: USER_MODEL,
  })
  lender_id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: USER_MODEL,
  })
  borrower_id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: NOTE_MODEL,
  })
  note_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: Number })
  cost: number;

  @Prop({ required: false, type: Number, default: 0 })
  interest: number;

  @Prop({ required: false, type: String })
  note: string;

  @Prop({
    required: true,
    type: Number,
    enum: StatusEnum,
    default: StatusEnum.draft,
  })
  status?: StatusEnum;

  @Prop({ type: Date })
  createdAt: Date;
}

export type DebtDocument = Debt & Document;

export const DebtSchema = SchemaFactory.createForClass(Debt);
