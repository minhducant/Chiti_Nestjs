import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { Note, NoteSchema } from './schemas/note.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
