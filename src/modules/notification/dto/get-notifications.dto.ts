import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsMongoId } from 'class-validator';

import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetNotificationDto extends PaginationDto {}
