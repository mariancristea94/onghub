import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../entities/application.entity';
import {
  APPLICATION_HTTP_ERRORS_MESSAGES,
  APPLICATION_ERROR_CODES,
} from '../constants/application-error.constants';

@Injectable()
export class ApplicationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  public async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const { type, ...createApplicationData } = createApplicationDto;
    return this.applicationRepository.save({
      type,
      ...createApplicationData,
    });
  }

  public async findOne(id: number): Promise<Application> {
    const application = await this.applicationRepository.get({
      where: { id },
      relations: ['type'],
    });

    if (!application) {
      throw new NotFoundException({
        message: APPLICATION_HTTP_ERRORS_MESSAGES.APPLICATION,
        errorCode: APPLICATION_ERROR_CODES.APP001,
      });
    }

    return application;
  }
}
