import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Partner } from '../entities';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  get(conditions: FindOneOptions<Partner>) {
    return this.partnerRepository.findOne(conditions);
  }

  getMany(conditions: FindManyOptions<Partner>) {
    return this.partnerRepository.find(conditions);
  }

  update(id: number, data: Partial<Partner>) {
    return this.partnerRepository.save({
      id,
      ...data,
    });
  }

  delete(id: number) {
    return this.partnerRepository.save({
      id,
      numberOfPartners: null,
      status: CompletionStatus.NOT_COMPLETED,
    });
  }
}