import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { GetBattlesDto } from './dto/get-battles.dto';
import { PlayBattlesDto } from './dto/play-battles.dto';
import { CreateBattlesDto } from './dto/create-battles.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Battles, BattlesDocument } from './schemas/battles.schema';
import {
  WaitingRoom,
  WaitingRoomDocument,
} from './schemas/waiting-room.schema';

@Injectable()
export class BattlesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Battles.name) private battlesModel: Model<BattlesDocument>,
    @InjectModel(WaitingRoom.name)
    private waitingRoomModel: Model<WaitingRoomDocument>,
  ) {}

  private generateRoomId(): string {
    const uuid = uuidv4();
    const userId = uuid.substr(0, 8).toUpperCase();
    return userId;
  }

  private generateBoard(): string[] {
    const numbers = Array.from({ length: 25 }, (_, i) => (i + 1).toString());
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  }

  async find(
    getBattlesDto: GetBattlesDto,
    user_id: string,
  ): Promise<ResPagingDto<Battles[]>> {
    const { sort, page, limit, status, room } = getBattlesDto;
    let query: any = { players: new mongoose.Types.ObjectId(user_id) };

    if (room) {
      query.room = room;
    }

    if (status) {
      query.status = status;
    }

    const pipeline = [
      { $match: query },
      { $sort: { createdAt: sort } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'user',
          localField: 'players',
          foreignField: '_id',
          as: 'playerDetails',
        },
      },
      {
        $addFields: {
          players: {
            $map: {
              input: '$playerDetails',
              as: 'user',
              in: {
                _id: '$$user._id',
                name: '$$user.name',
                image_url: '$$user.image_url',
              },
            },
          },
        },
      },
      {
        $project: {
          playerDetails: 0,
        },
      },
    ];

    const [result, total] = await Promise.all([
      this.battlesModel.aggregate(pipeline).exec(),
      this.battlesModel.countDocuments(query),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Battles> {
    const pipeline = [{ $match: { _id: new mongoose.Types.ObjectId(id) } }];
    const noteWithTotalMoney = await this.battlesModel
      .aggregate(pipeline)
      .exec();
    return noteWithTotalMoney[0];
  }

  async create(createBattlesDto: CreateBattlesDto): Promise<Battles> {
    const createdBattle = new this.battlesModel({
      ...createBattlesDto,
      room: this.generateRoomId(),
    });
    return createdBattle.save();
  }

  async play(playBattlesDto: PlayBattlesDto, userId: string): Promise<any> {
    const { type } = playBattlesDto;
    if (type === 1) {
      await this.waitingRoomModel.create({
        player: new mongoose.Types.ObjectId(userId),
      });
      const waitingPlayers = await this.waitingRoomModel.aggregate([
        { $match: { player: { $ne: new mongoose.Types.ObjectId(userId) } } },
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
      ]);
      if (waitingPlayers.length > 1) {
        const opponent = waitingPlayers.find(
          (player) => player.player.toString() !== userId,
        );
        if (opponent) {
          const createBattlesDto: CreateBattlesDto = {
            players: [userId, opponent.player.toString()],
            current_player: userId,
            type: type,
            status: 1,
            timer: 30,
            board: {
              [userId]: this.generateBoard(),
              [opponent.player.toString()]: this.generateBoard(),
            },
            selected_squares: [],
          };
          const newBattle = await this.create(createBattlesDto);
          await this.waitingRoomModel
            .deleteMany({
              player: { $in: [userId, opponent.player.toString()] },
            })
            .exec();

          return newBattle;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 60000));
        const recheckPlayers = await this.waitingRoomModel.aggregate([
          { $match: { player: { $ne: new mongoose.Types.ObjectId(userId) } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ]);
        if (recheckPlayers.length > 1) {
          const opponent = recheckPlayers.find(
            (player) => player.player.toString() !== userId,
          );
          if (opponent) {
            const createBattlesDto: CreateBattlesDto = {
              players: [userId, opponent.player.toString()],
              current_player: userId,
              type: type,
              status: 1,
              timer: 30,
              board: {
                [userId]: this.generateBoard(),
                [opponent.player.toString()]: this.generateBoard(),
              },
              selected_squares: [],
            };
            const newBattle = await this.create(createBattlesDto);
            await this.waitingRoomModel
              .deleteMany({
                player: { $in: [userId, opponent.player.toString()] },
              })
              .exec();
            return newBattle;
          }
        } else {
          await this.waitingRoomModel
            .deleteMany({
              player: { $in: [userId] },
            })
            .exec();
          return {
            message: 'No players found. Do you want to play against a bot?',
          };
        }
      }
    } else if (type === 2) {
      const createBattlesDto: CreateBattlesDto = {
        players: [userId],
        current_player: userId,
        type: type,
        status: 1,
        timer: 30,
        board: {
          [userId]: this.generateBoard(),
        },
        selected_squares: [],
      };

      const newBattle = await this.create(createBattlesDto);
      const gameCode = this.generateRoomId();
      newBattle.room = gameCode;
      await newBattle.save();
      return { newBattle };
    }
    return [];
  }
}
