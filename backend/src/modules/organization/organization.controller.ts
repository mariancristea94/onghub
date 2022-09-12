import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFiles,
  Delete,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
  ApiTooManyRequestsResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities';
import { OrganizationService } from './services/organization.service';
import {
  INVESTOR_UPLOAD_SCHEMA,
  PARTNER_UPLOAD_SCHEMA,
  ORGANIZATION_UPLOAD_SCHEMA,
} from './constants/open-api.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { OrganizationFilterDto } from './dto/organization-filter.dto';
import { Pagination } from 'src/common/interfaces/pagination';
import { OrganizationView } from './entities/organization.view-entity';
import { ExtractUser } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { ApplicationWithOngStatus } from '../application/interfaces/application-with-ong-status.interface';
import { RestrictApplicationDto } from '../application/dto/restrict-application.dto';
import { ApplicationService } from '../application/services/application.service';
import { OngApplicationService } from '../application/services/ong-application.service';
import { OrganizationRequestService } from './services/organization-request.service';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { OrganizationRequest } from './entities/organization-request.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly applicationService: ApplicationService,
    private readonly ongApplicationService: OngApplicationService,
    private readonly organizationRequestService: OrganizationRequestService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Get('')
  findAll(
    @Query() filters: OrganizationFilterDto,
  ): Promise<Pagination<OrganizationView>> {
    return this.organizationService.findAll({ options: filters });
  }

  /**
   * *****************************
   * ******* ONG REQUEST *****
   * *****************************
   */
  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({ type: () => BaseFilterDto })
  @Get('request')
  async getOrganizationRequests(
    @Query() filters: BaseFilterDto,
  ): Promise<Pagination<OrganizationRequest>> {
    return this.organizationRequestService.findAll(filters);
  }

  @Public()
  @ApiBody({ type: CreateOrganizationRequestDto })
  @Post('request')
  create(
    @Body() createRequestDto: CreateOrganizationRequestDto,
  ): Promise<OrganizationRequest> {
    return this.organizationRequestService.create(createRequestDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Get('request/:id')
  findOneOrganizationRequest(
    @Param('id') id: string,
  ): Promise<OrganizationRequest> {
    return this.organizationRequestService.findOne(+id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch('request/:id/approve')
  approve(@Param('id') id: number): Promise<OrganizationRequest> {
    return this.organizationRequestService.approve(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch('request/:id/reject')
  reject(@Param('id') id: number): Promise<OrganizationRequest> {
    return this.organizationRequestService.reject(id);
  }

  /**
   * *****************************
   * ******* ONG APPLICATION *****
   * *****************************
   */
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @Get('application')
  findOrganizationApplications(
    @ExtractUser() user: User,
  ): Promise<ApplicationWithOngStatus[]> {
    return this.applicationService.findAllForOng(user.organizationId);
  }

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @Get('application/profile')
  findOrganizationApplicationsForUser(
    @ExtractUser() user: User,
  ): Promise<ApplicationWithOngStatus[]> {
    return this.applicationService.findAllForOngUser(user.organizationId);
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: Number })
  @Delete('application/:id')
  deleteOne(@Param('id') id: number, @ExtractUser() user: User): Promise<void> {
    return this.ongApplicationService.delete(id, user.organizationId);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: RestrictApplicationDto })
  @Patch('application/:id/restrict')
  restrict(
    @Param('id') id: number,
    @Body() restrictApplicationDto: RestrictApplicationDto,
  ): Promise<void> {
    return this.applicationService.restrict(
      id,
      restrictApplicationDto.organizationId,
    );
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationService.findWithRelations(+id);
  }

  @ApiBody({ type: UpdateOrganizationDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  /**
   * *******************
   * *******UPLOADS*****
   * ******************
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'organizationStatute', maxCount: 1 },
    ]),
  )
  @ApiBody({
    schema: ORGANIZATION_UPLOAD_SCHEMA,
  })
  @Post(':id/upload')
  upload(
    @Param('id') id: number,
    @UploadedFiles()
    files: {
      logo: Express.Multer.File[];
      organizationStatute: Express.Multer.File[];
    },
  ): Promise<any> {
    return this.organizationService.upload(
      id,
      files.logo,
      files.organizationStatute,
    );
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'partners', maxCount: 1 }]))
  @ApiBody({
    schema: PARTNER_UPLOAD_SCHEMA,
  })
  @Post(':id/partners/:partnerId')
  uploadPartnerList(
    @Param('id') id: string,
    @Param('partnerId') partnerId: string,
    @Body() body: { numberOfPartners: number },
    @UploadedFiles() files: { partners: Express.Multer.File[] },
  ): Promise<any> {
    return this.organizationService.uploadPartners(
      +id,
      +partnerId,
      +body.numberOfPartners,
      files.partners,
    );
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'investors', maxCount: 1 }]))
  @ApiBody({
    schema: INVESTOR_UPLOAD_SCHEMA,
  })
  @Post(':id/investors/:investorId')
  uploadInvestorList(
    @Param('id') id: string,
    @Param('investorId') investorId: string,
    @Body() body: { numberOfInvestors: number },
    @UploadedFiles() files: { investors: Express.Multer.File[] },
  ): Promise<any> {
    return this.organizationService.uploadInvestors(
      +id,
      +investorId,
      +body.numberOfInvestors,
      files.investors,
    );
  }

  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'partnerId', type: String })
  @Delete(':id/partners/:partnerId')
  deletePartner(
    @Param('id') id: string,
    @Param('partnerId') partnerId: string,
  ) {
    return this.organizationService.deletePartner(+id, +partnerId);
  }

  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'investorId', type: String })
  @Delete(':id/investors/:investorId')
  deleteInvestors(
    @Param('id') id: string,
    @Param('investorId') investorId: string,
  ) {
    return this.organizationService.deleteInvestor(+id, +investorId);
  }
}
