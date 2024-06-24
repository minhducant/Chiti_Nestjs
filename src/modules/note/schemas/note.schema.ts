import { v4 as uuidv4 } from 'uuid';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  Currency,
  StatusEnum,
  NotePermission,
  expenseCategory,
} from 'src/shares/enums/note.enum';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const NOTE_MODEL = 'note';

@Schema({ _id: false })
export class Member {
  @Prop({ required: false, index: true })
  _id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String })
  image_url: string;

  @Prop({ required: false, type: String })
  user_id: string;

  @Prop({
    required: true,
    type: Number,
    enum: NotePermission,
    default: NotePermission.edit,
  })
  permission: Number;
}

export const memberSchema = SchemaFactory.createForClass(Member);

@Schema({ _id: false })
export class NoteLine {
  @Prop({
    required: false,
    index: true,
    unique: true,
    auto: true,
    type: MongooseSchema.Types.ObjectId,
  })
  _id: string;

  @Prop({
    required: true,
    type: Object,
    index: true,
    ref: USER_MODEL,
  })
  buyer: {
    _id: string;
    name: string;
    image_url: string;
    permission: number;
  };

  @Prop({ required: true, type: String })
  expense: string;

  @Prop({ required: false, type: Date, default: new Date() })
  payment_date: Date;

  @Prop({ required: false, type: Boolean, default: true })
  split_evenly: Boolean;

  @Prop({ required: true, type: Number })
  cost: number;

  @Prop({
    required: false,
    type: Number,
    enum: expenseCategory,
  })
  topic?: expenseCategory;

  @Prop({ required: false, type: [{ type: memberSchema }] })
  sharers: Member[];

  @Prop({ required: false, type: String })
  image_bill?: string;
}

export const noteLineSchema = SchemaFactory.createForClass(NoteLine);

@Schema({ timestamps: true, collection: NOTE_MODEL })
export class Note {
  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: USER_MODEL,
  })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: false, type: String })
  desc: string;

  @Prop({
    required: true,
    type: Number,
    enum: StatusEnum,
    default: StatusEnum.incomplete,
  })
  status?: StatusEnum;

  @Prop({ required: false, type: String })
  color: string;

  @Prop({
    required: true,
    type: Number,
    enum: Currency,
    // default: 0,
  })
  currency?: Currency;

  @Prop({ required: false, type: [{ type: memberSchema }] })
  members: Member[];

  @Prop({ required: false, type: [{ type: noteLineSchema }] })
  note_line: NoteLine[];
}

export type NoteDocument = Note & Document;

export const NoteSchema = SchemaFactory.createForClass(Note);
