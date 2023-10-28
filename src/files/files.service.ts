import { Injectable } from '@nestjs/common';

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Readable } from 'node:stream';

import { v4 as uuidv4 } from 'uuid';

import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {

    s3Client: S3Client;
    constructor(private config: ConfigService) {
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }


    async saveFileS3(file) {
        if (!file) {
            throw new Error('File is undefined or null');
        }
    
        const fileName = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
    
        const command = new PutObjectCommand({
            Bucket: this.config.get('AWS_BUCKET_NAME'),
            Key: fileName,
            Body: file.buffer,
        });
    
        const response = await this.s3Client.send(command);
        
        return fileName;
    }
    

    async getFileS3(body: object): Promise<any> {
        const command = new GetObjectCommand({
            Bucket: this.config.get('AWS_BUCKET_NAME'),
            Key: body['file-name'],
        });

        const response = await this.s3Client.send(command);

        const fileByteArray = await response.Body.transformToByteArray();


        fs.writeFile(path.join(__dirname, '..', '..', '..', 'uploads', body['file-name']), fileByteArray);

        

        return {
            'file': response.$metadata,
        };
    }
}
