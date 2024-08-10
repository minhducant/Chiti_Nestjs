import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Get,
  Put,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Controller,
} from '@nestjs/common';

import {
  ChangeStatus,
  UpdateNoteDto,
  ChangeMemberDto,
} from './dto/update-note.dto';
import { Note } from './schemas/note.schema';
import { NoteService } from './note.service';
import { GetNoteDto } from './dto/get-note.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { AddExpenseDto } from './dto/add-expense.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('Note - Ghi chú')
@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: '[Note] Get notes', description: 'Display notes' })
  async find(
    @UserID() userId: string,
    @Query() query: GetNoteDto,
  ): Promise<ResPagingDto<Note[]>> {
    return this.noteService.find(query, userId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Note] Get note',
  })
  async findOne(@Param() { id }: IdDto): Promise<Note> {
    return this.noteService.findById(id);
  }

  @Put('/sync')
  @ApiOperation({ summary: '[Note] Update note' })
  @ApiBearerAuth()
  async updateNote(@Body() updateNoteDto: UpdateNoteDto): Promise<void> {
    await this.noteService.updateNote(updateNoteDto);
  }

  @Post('/create')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Note] Create note',
  })
  async createNote(
    @Body() body: CreateNoteDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.noteService.createNote(body, userId);
  }

  @Post('/create/many')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Note] Create 5 million notes',
  })
  async createBulkNotes(
    @Body() body: CreateNoteDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.noteService.createBulkNotes(body, userId);
  }

  @Get('split/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Note] Split expenses',
  })
  async splitExpenses(@Param() { id }: IdDto) {
    return this.noteService.splitExpenses(id);
  }

  @Patch('/add-expense')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Note] Add Expense',
  })
  async addExpense(@Body() body: AddExpenseDto): Promise<void> {
    await this.noteService.addExpense(body);
  }

  @Patch('/edit-expense')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Note] Edit Expense',
  })
  async editExpense(@Body() body: AddExpenseDto): Promise<void> {
    await this.noteService.editExpense(body);
  }

  @Patch('/change-member')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Note] Change member',
  })
  async changeMember(@Body() body: ChangeMemberDto): Promise<void> {
    await this.noteService.changeMember(body);
  }

  @Patch('/change-status')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Note] Change status note',
  })
  async changeStatusById(@Body() body: ChangeStatus): Promise<void> {
    await this.noteService.changeStatusById(body);
  }
}
