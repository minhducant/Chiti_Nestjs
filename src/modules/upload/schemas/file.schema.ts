import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const FILE_MODEL = 'file';

@Schema({ timestamps: true, collection: FILE_MODEL })
export class File extends Document {
  @Prop({ type: Number, required: false, default: 0 })
  length: Number;

  @Prop({ type: Number, required: false, default: 0 })
  chunkSize: Number;

  @Prop({ type: String, required: false, default: 'ACTIVE' })
  status?: string;

  @Prop({ type: String, required: true })
  filename?: string;

  @Prop({ type: String, required: true })
  contentType?: string;

  @Prop({ type: Date, required: true })
  uploadDate?: Date;
}

export type FileDocument = File & Document;

export const FileSchema = SchemaFactory.createForClass(File);
