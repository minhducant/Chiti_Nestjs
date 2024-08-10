import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PaymentService } from './payment.service';
import { NoteModule } from '../note/note.module';
import { PaymentController } from './payment.controller';
import { UserModule } from 'src/modules/user/user.module';
import { ToolModule } from 'src/modules/tool/tool.module';
import { Note, NoteSchema } from '../note/schemas/note.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { VnBank, VnBankSchema } from './schemas/vn-bank.schema';

@Module({
  imports: [
    ToolModule,
    UserModule,
    NoteModule,
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema },
      { name: User.name, schema: UserSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: VnBank.name, schema: VnBankSchema },
    ]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
