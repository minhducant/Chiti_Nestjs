import mongoose, { Model, Types } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { httpErrors } from 'src/shares/exceptions';
import { Note, NoteDocument } from '../note/schemas/note.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
@Injectable()
export class InviteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async addFriend(friendId, userId) {}

  async addNoteMember(noteId, userId) {}
}
