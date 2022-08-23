import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../entities/application.entity';
import {
  APPLICATION_HTTP_ERRORS_MESSAGES,
  APPLICATION_ERROR_CODES,
  APPLICATION_ERRORS,
} from '../constants/application-error.constants';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { FindManyOptions } from 'typeorm';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';

@Injectable()
export class ApplicationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  public async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    if (
      createApplicationDto.type !== ApplicationTypeEnum.INDEPENDENT &&
      !createApplicationDto.loginLink
    ) {
      throw new BadRequestException({ ...APPLICATION_ERRORS.CREATE.LOGIN });
    }

    return this.applicationRepository.save({
      ...createApplicationDto,
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

  public async findAll(conditions: FindManyOptions<Application>) {
    return this.applicationRepository.getMany(conditions);
  }

  public async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    const application = await this.applicationRepository.get({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException({
        message: APPLICATION_HTTP_ERRORS_MESSAGES.APPLICATION,
        errorCode: APPLICATION_ERROR_CODES.APP002,
      });
    }

    return this.applicationRepository.save({
      id,
      ...updateApplicationDto,
    });
  }
}
