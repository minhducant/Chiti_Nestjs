import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Req,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';

import { InviteService } from './invite.service';
import { IdDto } from 'src/shares/dtos/param.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@Controller('invite')
@ApiTags('Invite - Chia sẻ')
@Controller()
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Post('/add_member/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Invite] Invite member',
  })
  async inviteNote(@Param() { id }: IdDto, @UserID() userId: string) {
    return this.inviteService.addNoteMember(id, userId);
  }

  @Post('/add_friend/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Invite] Invite add friend',
  })
  async addFriend(@Param() { id }: IdDto, @UserID() userId: string) {
    return this.inviteService.addFriend(id, userId);
  }
}
