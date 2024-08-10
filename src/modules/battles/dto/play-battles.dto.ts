import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PlayBattlesDto {
  @ApiProperty({
    description: 'Type of the battle',
    enum: [0, 1, 2],
    example: 1,
  })
  @IsNumber()
  type: number;
}
