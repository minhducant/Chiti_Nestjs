import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class CreateBattlesDto {
  @ApiProperty({
    description: 'List of player IDs participating in the battle',
    type: [String],
    example: ['66a15f0339cb341220cd1012', '66aa5ef6dad1051cd7f1c981'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  players: string[];

  @ApiProperty({
    description: 'ID of the current player',
    type: String,
    example: '66a15f0339cb341220cd1012',
  })
  @IsString()
  @IsMongoId()
  current_player: string;

  @ApiProperty({
    description: 'Type of the battle',
    enum: [0, 1, 2],
    example: 1,
  })
  @IsNumber()
  type: number;

  @ApiProperty({
    description: 'Status of the battle',
    enum: [0, 1, 2, 3],
    example: 1,
  })
  @IsNumber()
  status: number;

  @ApiProperty({
    description: 'Timer for the battle',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  timer?: number;

  @ApiProperty({
    description: 'Board state for each player',
    type: Object,
    example: {
      '66a15f0339cb341220cd1012': [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
      ],
      '66aa5ef6dad1051cd7f1c981': [
        '25',
        '24',
        '23',
        '22',
        '21',
        '20',
        '19',
        '18',
        '17',
        '16',
        '15',
        '14',
        '13',
        '12',
        '11',
        '10',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2',
        '1',
      ],
    },
  })
  @IsOptional()
  board?: { [playerId: string]: string[] };

  @ApiProperty({
    description: 'List of selected squares',
    type: [String],
    example: ['1', '6', '11', '16', '21'],
  })
  @IsArray()
  @IsString({ each: true })
  selected_squares: string[];
}
