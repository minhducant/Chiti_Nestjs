import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';

import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { IdDto } from 'src/shares/dtos/param.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';

@ApiTags('User - Người dùng')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[User] Get all user' })
  async findAll(@Query() query: GetUsersDto): Promise<ResPagingDto<User[]>> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[User] Get user by id',
  })
  async findOne(@Param() { id }: IdDto): Promise<User> {
    return this.userService.findById(id);
  }
}
