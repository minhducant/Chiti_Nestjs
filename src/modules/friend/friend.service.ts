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
import { GetFriendDto } from './dto/get-friend.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { NotificationService } from '../notification/notification.service';
import { Friend, FriendDocument, FriendStatus } from './schemas/friend.schema';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Friend.name) private friendModel: Model<FriendDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly notificationService: NotificationService,
  ) {}

  async findByUserId(
    payload: GetFriendDto,
    user_id: string,
  ): Promise<ResPagingDto<Friend[]>> {
    const { sort, page, limit, name } = payload;
    const query: any = {
      user_id: new mongoose.Types.ObjectId(user_id),
      status: FriendStatus.ACCEPTED,
    };
    if (name) {
      const users = await this.userModel
        .find({ name: new RegExp(name, 'i') })
        .select('_id');
      const userIds = users.map((user) => user._id);
      if (userIds.length > 0) {
        query.friend_id = { $in: userIds };
      } else {
        return {
          result: [],
          total: 0,
          lastPage: 0,
        };
      }
    }
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'user',
          localField: 'friend_id',
          foreignField: '_id',
          as: 'friend',
        },
      },
      {
        $sort: { createdAt: sort },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];
    const [result, total] = await Promise.all([
      this.friendModel.aggregate(pipeline).exec(),
      this.friendModel.countDocuments(query),
    ]);
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findBlockedFriends(user_id: string): Promise<Friend[]> {
    const query = {
      user_id: new mongoose.Types.ObjectId(user_id),
      status: FriendStatus.BLOCKED,
    };
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'users', // Collection name of userModel
          localField: 'friend_id',
          foreignField: '_id',
          as: 'friend',
        },
      },
      {
        $addFields: {
          friend: { $arrayElemAt: ['$friend', 0] },
        },
      },
    ];
    return this.friendModel.aggregate(pipeline).exec();
  }

  async findSentFriendRequest(user_id: string): Promise<Friend[]> {
    const query = {
      user_id: new mongoose.Types.ObjectId(user_id),
      status: FriendStatus.SENT,
    };
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'friend_id',
          foreignField: '_id',
          as: 'friend',
        },
      },
      {
        $addFields: {
          friend: { $arrayElemAt: ['$friend', 0] },
        },
      },
    ];
    return this.friendModel.aggregate(pipeline).exec();
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
    await this.notificationService.sendNotification({
      user_id: payload._id,
      title: 'Friend Request',
      body: `You have received a friend request from ${user.name}.`,
      data: {
        type: 'friend_request',
        user_name: user?.name,
        user_id: user_id,
        friend_id: payload._id,
      },
    });
    await this.friendModel.create({
      user_id: user_id,
      friend_id: new mongoose.Types.ObjectId(payload._id),
      status: FriendStatus.SENT,
    });
    await this.friendModel.create({
      user_id: new mongoose.Types.ObjectId(payload._id),
      friend_id: user_id,
      status: FriendStatus.PENDING,
    });
  }

  async deleteFriend(payload: AddFriendDto, user_id: string): Promise<void> {
    const { _id } = payload;
    const query = {
      $or: [
        {
          user_id: new mongoose.Types.ObjectId(user_id),
          friend_id: new mongoose.Types.ObjectId(_id),
        },
        {
          user_id: new mongoose.Types.ObjectId(_id),
          friend_id: new mongoose.Types.ObjectId(user_id),
        },
      ],
    };
    const result = await this.friendModel.deleteMany(query);
    if (result.deletedCount === 0) {
      throw new BadRequestException(
        'Không tìm thấy mối quan hệ bạn bè để xoá.',
      );
    }
  }

  async blockFriend(payload: AddFriendDto, user_id: string): Promise<void> {
    const { _id } = payload;
    const user = await this.userModel.findById(user_id);
    const friend = await this.userModel.findById(_id);
    if (!user || !friend) {
      throw new BadRequestException('Người dùng hoặc bạn bè không tồn tại.');
    }
    await this.friendModel.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(user_id),
        friend_id: new mongoose.Types.ObjectId(_id),
      },
      { status: FriendStatus.BLOCKED },
      { new: true },
    );
    await this.friendModel.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(_id),
        friend_id: new mongoose.Types.ObjectId(user_id),
      },
      { status: FriendStatus.BLOCKED },
      { new: true },
    );
  }

  async acceptFriend(payload: AddFriendDto, user_id: string): Promise<void> {
    const { _id } = payload;
    await this.friendModel.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(user_id),
        friend_id: new mongoose.Types.ObjectId(_id),
        status: FriendStatus.PENDING,
      },
      { status: FriendStatus.ACCEPTED },
      { new: true },
    );
    await this.friendModel.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(_id),
        friend_id: new mongoose.Types.ObjectId(user_id),
        status: FriendStatus.SENT,
      },
      { status: FriendStatus.ACCEPTED },
      { new: true },
    );
  }

  async cancelRequest(payload: AddFriendDto, user_id: string): Promise<void> {
    const { _id } = payload;
    const query = {
      $or: [
        {
          user_id: new mongoose.Types.ObjectId(user_id),
          friend_id: new mongoose.Types.ObjectId(_id),
        },
        {
          user_id: new mongoose.Types.ObjectId(_id),
          friend_id: new mongoose.Types.ObjectId(user_id),
        },
      ],
    };
    const result = await this.friendModel.deleteMany(query);
    if (result.deletedCount === 0) {
      throw new BadRequestException(
        'Không tìm thấy mối quan hệ bạn bè để xoá.',
      );
    }
  }
}
