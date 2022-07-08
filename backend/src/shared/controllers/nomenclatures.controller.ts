import {
  CacheInterceptor,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CitySearchDto } from '../dto/city-search.dto';
import { NomenclaturesService } from '../services';

@UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
@Controller('nomenclatures')
export class NomenclaturesController {
  constructor(private nomenclaturesService: NomenclaturesService) {}

  @Get('cities')
  getCities(@Query('countyId') countyId: number) {
    return this.nomenclaturesService.getCities({
      where: { countyId },
    });
  }

  @Get('cities/filtered')
  getCitiesFiltered(@Query() citySearchDto: CitySearchDto) {
    return this.nomenclaturesService.getCitiesFiltered(citySearchDto);
  }

  @Get('counties')
  getCounties() {
    return this.nomenclaturesService.getCounties({});
  }

  @Get('domains')
  getDomains() {
    return this.nomenclaturesService.getDomains({});
  }
}
