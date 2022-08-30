import {
  Injectable,
  Logger,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { v4 as uuid } from 'uuid';
import {
  FILE_URL_EXPIRATION_TIME,
  MAX_UPLOAD_SIZE,
  VALID_FILE_TYPES,
  VALID_IMAGE_TYPES,
} from '../constants/file.constants';

interface FileUploadParams {
  Body: Buffer;
  Bucket: string;
  Key: string;
}

@Injectable()
export class FileManagerService {
  private readonly logger = new Logger(FileManagerService.name);

  private readonly s3 = new AWS.S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    region: this.configService.get('COGNITO_REGION'),
  });

  constructor(private configService: ConfigService) {}

  public async generatePresignedURL(fileName: string): Promise<string> {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Expires: FILE_URL_EXPIRATION_TIME,
    });
  }

  public async uploadFiles(
    path: string,
    files: Express.Multer.File[],
    fileName?: string,
  ): Promise<string[]> {
    this.logger.log(`Preparing to upload ${files.length} files...`);

    if (
      !files.every(
        (file) =>
          VALID_IMAGE_TYPES.includes(file.mimetype) ||
          VALID_FILE_TYPES.includes(file.mimetype),
      )
    ) {
      throw new UnsupportedMediaTypeException(
        'Only PNG, JPG, JPEG, PDF, DOC, DOCX files allowed',
      );
    }

    if (
      !files.every((file) => Buffer.byteLength(file.buffer) <= MAX_UPLOAD_SIZE)
    ) {
      throw new PayloadTooLargeException(
        `Maximum size is ${MAX_UPLOAD_SIZE / 1024 / 1024} MB`,
      );
    }

    // Create upload params
    const params: FileUploadParams[] = files.map((file) => ({
      Body: file.buffer,
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: `${path}/${uuid()}-${fileName || file.originalname}`,
    }));

    // Prepare upload
    return await Promise.all(
      params.map((param) =>
        this.s3
          .putObject(param)
          .promise()
          .then((data) => {
            return param.Key;
          })
          .catch((err) => {
            this.logger.log(err);
            return err;
          }),
      ),
    );
  }

  public deleteFiles(
    keys: string[],
  ): Promise<PromiseResult<AWS.S3.DeleteObjectOutput, AWS.AWSError>[]> {
    return Promise.all(
      keys.map((key) =>
        this.s3
          .deleteObject({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: key,
          })
          .promise(),
      ),
    );
  }
}