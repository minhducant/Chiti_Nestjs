import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentService } from './payment.service';
import { NoteModule } from '../note/note.module';
import { PaymentController } from './payment.controller';
import { UserModule } from 'src/modules/user/user.module';
import { Note, NoteSchema } from '../note/schemas/note.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    UserModule,
    NoteModule,
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
