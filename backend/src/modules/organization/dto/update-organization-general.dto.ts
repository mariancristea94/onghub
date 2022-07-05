import { PartialType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateContactDto } from 'src/modules/organization/dto/update-contact.dto';
import { CreateOrganizationGeneralDto } from './create-organization-general.dto';

export class UpdateOrganizationGeneralDto extends PartialType(
  OmitType(CreateOrganizationGeneralDto, ['contact']),
) {
  /* Organization contact person */
  @IsOptional()
  @Type(() => UpdateContactDto)
  @ValidateNested()
  contact?: UpdateContactDto;
}