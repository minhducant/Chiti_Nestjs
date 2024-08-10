import { Get, Query, Controller } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';

import { ChatService } from './chat.service';

@ApiTags('Chat - Trò truyện')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
}
