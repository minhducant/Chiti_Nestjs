import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { Note, NoteSchema } from './schemas/note.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
