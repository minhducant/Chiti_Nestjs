import mongoose, { Model, Types } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import {
  Response,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { httpErrors } from 'src/shares/exceptions';
import { AddFriendDto } from './dto/add-friend.dto';
import { Friend } from '../user/schemas/user.schema';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async findByUserId(user_id: string): Promise<Friend[] | []> {
    const data = await this.userModel.findOne({ _id: user_id });
    if (!data || !data.friends) {
      return [];
    }
    return data.friends;
  }

  async addFriend(payload: AddFriendDto, user_id: string): Promise<void> {
    if (!payload._id) {
      throw new BadRequestException('ID của bạn bè không hợp lệ.');
    }
    const user = await this.userModel.findOne({ _id: user_id });
    const friend = await this.userModel.findOne({ _id: payload._id });
    if (!user || !friend) {
      throw new BadRequestException('Người dùng hoặc bạn bè không tồn tại.');
    }
    const isFriendExist = user.friends.some((friend) =>
      new Types.ObjectId(friend._id).equals(new Types.ObjectId(payload._id)),
    );
    if (isFriendExist) {
      throw new BadRequestException('Bạn bè đã tồn tại.');
    }
    // friend.friends.push(user);
    user.friends.push(payload);
    await user.save();
    await friend.save();
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  async deleteFriend(payload: AddFriendDto, user_id: string): Promise<void> {
    const user = await this.userModel.findOne({ _id: user_id });
    const friend = await this.userModel.findOne({ _id: payload._id });
    if (user && friend) {
      const userIndex = friend.friends.findIndex((friend) =>
        new Types.ObjectId(friend._id).equals(new Types.ObjectId(user_id)),
      );
      if (userIndex === -1) {
        throw new NotFoundException('Không tìm thấy bạn bè để xoá.');
      }
      user.friends = user.friends.filter((friend) =>
        !new Types.ObjectId(friend._id).equals(new Types.ObjectId(payload._id)),
      );
      friend.friends.splice(userIndex, 1);
      await user.save();
      await friend.save();
    } else {
      throw new NotFoundException('Người dùng hoặc bạn bè không tồn tại.');
    }
  }
}
