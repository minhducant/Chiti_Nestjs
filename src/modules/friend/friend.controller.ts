import {
  Get,
  Post,
  Body,
  Delete,
  Patch,
  Query,
  Controller,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FriendService } from './friend.service';
import { UserService } from '../user/user.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { GetFriendDto } from './dto/get-friend.dto';
import { Friend } from '../user/schemas/user.schema';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('Friend - Bạn bè')
@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Get()
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Get friends',
  })
  async findByUserId(
    @UserID() userId: string,
    @Query() query: GetFriendDto,
  ): Promise<ResPagingDto<any[]>> {
    return this.friendService.findByUserId(query, userId);
  }

  @Post('/add')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Add new friend',
  })
  async addFriend(
    @Body() body: AddFriendDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.friendService.addFriend(body, userId);
  }

  @Get('/sent')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Get sent friends',
  })
  async findSentFriendRequest(@UserID() userId: string): Promise<any> {
    return this.friendService.findSentFriendRequest(userId);
  }

  @Get('/block')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Get block friends',
  })
  async findBlockedFriends(@UserID() userId: string): Promise<any> {
    return this.friendService.findBlockedFriends(userId);
  }

  @Delete('/delete')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Delete old friend',
  })
  async deleteFriend(
    @Body() body: AddFriendDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.friendService.deleteFriend(body, userId);
  }

  @Patch('/block')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Block best friend',
  })
  async requestFriend(
    @Body() body: AddFriendDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.friendService.blockFriend(body, userId);
  }

  @Patch('/accept')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Accept new friend',
  })
  async acceptFriend(
    @Body() body: AddFriendDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.friendService.acceptFriend(body, userId);
  }

  @Patch('/cancel')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Cancel request friend',
  })
  async cancelFriend(
    @Body() body: AddFriendDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.friendService.cancelRequest(body, userId);
  }
}
