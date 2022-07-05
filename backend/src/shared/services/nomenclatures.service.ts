import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City, County, Domain } from 'src/shared/entities';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ApplicationType } from '../entities/application-type.entity';

@Injectable()
export class NomenclaturesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
    @InjectRepository(County)
    private readonly countiesRepository: Repository<County>,
    @InjectRepository(Domain)
    private readonly domainsRepository: Repository<Domain>,
    @InjectRepository(ApplicationType)
    private readonly applicationTypeRepository: Repository<ApplicationType>,
  ) {}

  public getCities(conditions: FindManyOptions<City>) {
    return this.citiesRepository.find(conditions);
  }

  public getCounties(conditions: FindManyOptions<County>) {
    return this.countiesRepository.find(conditions);
  }

  public getDomains(conditions: FindManyOptions<Domain>) {
    return this.domainsRepository.find(conditions);
  }

  public getAppType(conditions: FindOneOptions<ApplicationType>) {
    return this.applicationTypeRepository.findOne(conditions);
  }
}