import mongoose, { Model } from 'mongoose';
import * as firebase from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { GetNotificationDto } from './dto/get-notifications.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { SendNotificationDto } from './dto/send-notification.dto';
import { RegisterNotificationDto } from './dto/register-notification.dto';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import {
  NotificationToken,
  NotificationTokenDocument,
} from './schemas/notification_token.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationToken.name)
    private notificationTokenModel: Model<NotificationTokenDocument>,
  ) {}

  async getNotifications(
    GetNotificationsDto: GetNotificationDto,
    user_id: string,
  ): Promise<ResPagingDto<Notification[]>> {
    const { sort, page, limit } = GetNotificationsDto;
    const query: any = { user_id: new mongoose.Types.ObjectId(user_id) };
    const pipeline = [
      { $match: query },
      { $sort: { createdAt: sort } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];
    const [result, total] = await Promise.all([
      this.notificationModel.aggregate(pipeline).exec(),
      this.notificationModel.countDocuments(query),
    ]);
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async registerNotification(
    user_id: string,
    payload: RegisterNotificationDto,
  ) {
    try {
      const { notification_token } = payload;
      let existingNotificationToken =
        await this.notificationTokenModel.findOneAndUpdate(
          { user_id, notification_token },
          { user_id, notification_token, device_type: '', status: 'ACTIVE' },
          { upsert: true, new: true },
        );
      await this.notificationTokenModel.deleteMany({
        _id: { $ne: existingNotificationToken._id },
        notification_token,
        user_id: { $ne: user_id },
      });
      return existingNotificationToken;
    } catch (error) {
      return error;
    }
  }
  async updateNotification(user_id: string, payload: RegisterNotificationDto) {}

  async sendNotification(sendNotificationDto: SendNotificationDto) {
    const { user_id, title, body, data } = sendNotificationDto;
    try {
      await this.notificationModel.create({
        user_id,
        title,
        body,
        data,
        is_read: false,
      });
      const tokens = await this.notificationTokenModel
        .aggregate([
          { $match: { user_id: new mongoose.Types.ObjectId(user_id) } },
          { $project: { notification_token: 1 } },
        ])
        .exec();
      if (tokens || tokens.length !== 0) {
        const registrationTokens = tokens?.map(
          (token) => token.notification_token,
        );
        const message: firebase.messaging.MessagingPayload = {
          notification: {
            title: title,
            body: body,
          },
          data: data,
        };
        // firebase.messaging().sendToDevice(registrationTokens, message);
      }
    } catch (error) {
      return error;
    }
  }

  async readById(id: string): Promise<Notification | null> {
    try {
      await this.notificationModel.findByIdAndUpdate(
        id,
        { $set: { is_read: true } },
        { new: true },
      );
      return;
    } catch (error) {
      console.error('Error occurred while updating notification:', error);
      return null;
    }
  }

  async readAll(user_id: string): Promise<void> {
    try {
      await this.notificationModel.updateMany(
        { user_id },
        { $set: { is_read: true } },
      );
    } catch (error) {
      console.error('Error occurred while updating notifications:', error);
    }
  }

  async deleteNotificationById(notificationId: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(notificationId).exec();
  }
}
