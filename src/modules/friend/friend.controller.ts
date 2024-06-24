import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FriendService } from './friend.service';
import { UserService } from '../user/user.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { Friend } from '../user/schemas/user.schema';
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
  async findByUserId(@UserID() userId: string): Promise<Friend[] | []> {
    return this.friendService.findByUserId(userId);
  }

  @Post('/add')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Add new friend',
  })
  async createNote(
    @Body() body: AddFriendDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.friendService.addFriend(body, userId);
  }

  @Delete('/delete')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Delete friend',
  })
  async deleteFriend(
    @Body() body: AddFriendDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.friendService.deleteFriend(body, userId);
  }
}
