import { Body, Controller,Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}


@Post('/save-file-s3')
@UseInterceptors(FileInterceptor('file'))
async saveFileS3(@UploadedFile() file: Express.Multer.File, @Body() body:object): Promise<any> {
  return await this.filesService.saveFileS3(file, body['ext']);
}


  @Post('/get-file-s3')
  async getFileS3(@Body() body:object): Promise<any> {
    return await this.filesService.getFileS3(body);
  }


}
