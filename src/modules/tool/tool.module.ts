import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';

@Module({
  providers: [ToolService],
  controllers: [ToolController]
})
export class ToolModule {}
