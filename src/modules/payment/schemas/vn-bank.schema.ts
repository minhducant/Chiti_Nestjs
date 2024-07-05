import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'vn_banks' })
export class VnBank {
  @Prop({ required: false })
  id: number;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  code: string;

  @Prop({ required: false })
  bin: string;

  @Prop({ required: false })
  shortName: string;

  @Prop()
  logo: string;

  @Prop({ required: false })
  transferSupported: number;

  @Prop({ required: false })
  lookupSupported: number;

  @Prop({ required: false })
  short_name: string;

  @Prop({ required: false })
  support: number;

  @Prop({ required: false })
  isTransfer: number;

  @Prop()
  swift_code: string;
}

export type VnBankDocument = VnBank & Document;

export const VnBankSchema = SchemaFactory.createForClass(VnBank);
