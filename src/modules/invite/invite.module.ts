import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InviteService } from './invite.service';
import { NoteModule } from '../note/note.module';
import { InviteController } from './invite.controller';
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
  providers: [InviteService],
  controllers: [InviteController],
})
export class InviteModule {}
