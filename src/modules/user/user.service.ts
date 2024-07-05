import mongoose, { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import { caching } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { GetUserDto } from './dto/get-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { User, UserDocument } from './schemas/user.schema';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserRole, UserStatus } from 'src/shares/enums/user.enum';
import { UserGoogleInfoDto } from '../auth/dto/user-google-info.dto';
import { UserFacebookInfoDto } from '../auth/dto/user-facebook-info.dto';
import {
  Friend,
  FriendStatus,
  FriendDocument,
} from '../friend/schemas/friend.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Friend.name) private friendModel: Model<FriendDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findById(_id: string): Promise<User> {
    return this.userModel.findById(_id).select('-password');
  }

  generateUserId(): string {
    const uuid = uuidv4();
    const userId = uuid.substr(0, 8).toUpperCase();
    return userId;
  }

  async addFirebaseTokenPush(notification_token: string, _id: string) {
    await this.userModel.findOneAndUpdate(
      { _id },
      { notification_token: notification_token },
    );
  }

  async findOne(condition: GetUserDto, selectPassword = false): Promise<User> {
    if (selectPassword) {
      return this.userModel.findOne(condition).select('+password');
    }
    return this.userModel.findOne(condition);
  }

  async findAll(
    getUsersDto: GetUsersDto,
    userId: string,
  ): Promise<ResPagingDto<User[]>> {
    const { sort, page, limit, name } = getUsersDto;
    const friends = await this.friendModel
      .find({
        user_id: userId,
        status: FriendStatus.ACCEPTED,
      })
      .select('friend_id');
    const friendUserIds = friends.map((friend) => friend.friend_id);
    const query: any = {};
    if (name) {
      if (name.length > 5) {
        query.$or = [
          {
            $and: [
              { name: { $regex: name, $options: 'i' } },
              { _id: { $in: friendUserIds } },
            ],
          },
          { user_id: { $regex: name, $options: 'i' } },
        ];
      } else {
        query.$and = [
          { name: { $regex: name, $options: 'i' } },
          { _id: { $in: friendUserIds } },
        ];
      }
    } else {
      query._id = { $in: friendUserIds };
    }
    const pipeline = [
      { $match: query },
      { $addFields: { selected: false } },
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
      this.userModel.aggregate(pipeline).exec(),
      this.userModel.countDocuments(query),
    ]);
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findAllAdmin(
    getUsersDto: GetUsersDto,
    userId: string,
  ): Promise<ResPagingDto<User[]>> {
    const { sort, page, limit, id, name, user_id } = getUsersDto;
    const query: any = {};
    if (id) {
      query._id = id;
    }
    if (name) {
      query.$or = [{ name: { $regex: name, $options: 'i' } }];
    }
    if (user_id) {
      query.user_id = { $regex: user_id, $options: 'i' };
    }
    const pipeline = [
      { $match: query },
      { $addFields: { selected: false } },
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
      this.userModel.aggregate(pipeline).exec(),
      this.userModel.countDocuments(query),
    ]);
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOrCreateFacebookUser(profile: UserFacebookInfoDto): Promise<User> {
    const user_id = this.generateUserId();
    const user = await this.userModel.findOne({
      facebook_id: profile.id,
    });
    if (user) {
      return this.userModel.findByIdAndUpdate(
        user._id,
        {
          lastLoginAt: new Date(),
        },
        { new: true },
      );
    }
    return this.userModel.create({
      facebook_id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`,
      user_id: user_id,
      image_url: profile.picture.data.url,
      role: UserRole.user,
      last_login_at: new Date(),
      status: UserStatus.ACTIVE,
      is_verify: true,
    });
  }

  async findOrCreateGoogleUser(profile: UserGoogleInfoDto): Promise<User> {
    const { sub, picture, given_name, family_name, email } = profile.data;
    const user_id = this.generateUserId();
    const user = await this.userModel.findOne({
      google_id: sub,
    });
    if (user) {
      return this.userModel.findByIdAndUpdate(
        user._id,
        {
          last_login_at: new Date(),
          email,
        },
        { new: true },
      );
    }
    return this.userModel.create({
      google_id: sub,
      name: `${given_name} ${family_name}`,
      user_id: user_id,
      image_url: picture,
      role: UserRole.user,
      last_login_at: new Date(),
      email,
      status: UserStatus.ACTIVE,
      is_verify: true,
    });
  }
}
