import {
  Get,
  Res,
  Post,
  Param,
  HttpStatus,
  Controller,
  UploadedFiles,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiConsumes,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { UploadService } from './upload.service';

@Controller('file')
@ApiTags('File - Xử lý file')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '[File] Upload file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('file'))
  upload(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        id: file.id,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
      console.log();
      response.push(fileReponse);
    });
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: '[File] Get file' })
  async getFile(@Param('id') id: string, @Res() res) {
    const file = await this.uploadService.findInfo(id);
    const filestream = await this.uploadService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res);
  }

  @Get('info/:id')
  @ApiOperation({ summary: '[File] Get file info' })
  async getFileInfo(@Param('id') id: string): Promise<any> {
    const file = await this.uploadService.findInfo(id);
    const filestream = await this.uploadService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file info',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been detected',
      file: file,
    };
  }

  @Get('delete/:id')
  @ApiOperation({ summary: '[File] Delete file' })
  async deleteFile(@Param('id') id: string): Promise<any> {
    const file = await this.uploadService.findInfo(id);
    const filestream = await this.uploadService.deleteFile(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred during file deletion',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been deleted',
      file: file,
    };
  }

  @Get('download/:id')
  @ApiOperation({ summary: '[File] Download file' })
  async downloadFile(@Param('id') id: string, @Res() res) {
    const file = await this.uploadService.findInfo(id);
    const filestream = await this.uploadService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res);
  }
}
