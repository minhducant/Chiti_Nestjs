import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const WALLET_MODEL = 'wallet';

export enum WalletType {
  BANK_CARD = 'BANK_CARD',
  PAYPAL = 'PAYPAL',
  VISA = 'VISA',
  MASTER_CARD = 'MASTER_CARD',
  LINE_PAY = 'LINE_PAY',
  MOMO = 'MOMO',
}

@Schema({ timestamps: true, collection: WALLET_MODEL })
export class Wallet extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: USER_MODEL, index: true })
  user_id: string;

  @Prop({ type: String, default: '', required: true })
  name: string;

  @Prop({ type: String, enum: WalletType, required: true })
  type: WalletType;

  @Prop({ type: String, default: '', required: false })
  bank_bin: string;

  @Prop({ type: String, default: '', required: false })
  bank_name: string;

  @Prop({ type: String, default: '', required: false })
  bank_logo: string;

  @Prop({ type: String, default: '', required: false })
  account_no: string;

  @Prop({ type: String, default: '', required: false })
  paypal_email: string;
}

export type WalletDocument = Wallet & Document;

export const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.index({ user_id: 1, type: 1 });

WalletSchema.pre('save', function (next) {
  const wallet = this as WalletDocument;
  if (wallet.type === WalletType.BANK_CARD) {
    wallet.paypal_email = '';
  } else if (wallet.type === WalletType.PAYPAL) {
    wallet.bank_bin = '';
    wallet.bank_name = '';
    wallet.bank_logo = '';
    wallet.account_no = '';
  }
  next();
});
