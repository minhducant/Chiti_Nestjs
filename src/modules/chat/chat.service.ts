import axios from 'axios';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}
}
