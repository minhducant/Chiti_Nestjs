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

  async addFriend(friendId, userId) {
    let friend = await this.userModel.findOne({ _id: friendId });
    let user = await this.userModel.findOne({ _id: userId });
    if (!user || !friend) {
      throw new BadRequestException('Người dùng hoặc bạn bè không tồn tại.');
    }
    const isFriendExist = user.friends.some((friend) =>
      new Types.ObjectId(friend._id).equals(new Types.ObjectId(friendId)),
    );
    if (isFriendExist) {
      throw new BadRequestException('Bạn bè đã tồn tại.');
    }
    // friend.friends.push(user);
    // user.friends.push(friend);
    await user.save();
    await friend.save();
    return friend;
  }

  async addNoteMember(noteId, userId) {
    let user: any = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new BadRequestException('Người dùng hoặc bạn bè không tồn tại.');
    }
    const note = await this.noteModel.findById(noteId);
    if (!note) {
      throw new BadRequestException(httpErrors.NOTE_NOT_FOUND);
    }
    note.members.push(user);
    await note.save();
  }
}
