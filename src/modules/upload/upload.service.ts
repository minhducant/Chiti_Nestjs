import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { InjectConnection } from '@nestjs/mongoose';
import { GridFSBucketReadStream, ObjectId } from 'mongodb';

import { FileInfoVm } from './dto/file-info-vm.dto';
import { ResUploadDto } from './dto/res-upload.dto';

const url = process.env.MONGO_URI;

@Injectable()
export class UploadService {
  private fileModel: MongoGridFS;
  constructor(@InjectConnection() private readonly connection: Connection) {
    const db = this.connection.getClient().db();
    // this.fileModel = new MongoGridFS(db, 'fs');
  }

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this.fileModel.readFileStream(id);
  }

  async findInfo(id: string): Promise<FileInfoVm> {
    // const result = await this.fileModel.findById(id);
    const result = await this.fileModel
      .findById(id)
      .catch((err) => {
        console.log(err)
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      })
      .then((result) => result);
    console.log(result);
    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      contentType: result.contentType,
    };
  }

  async deleteFile(id: string): Promise<boolean> {
    return await this.fileModel.delete(id);
  }
}
