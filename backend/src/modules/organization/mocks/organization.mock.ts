import { OrganizationType } from '../enums/organization-type.enum';

export const OrganizationGeneralMock = {
  name: 'OrganizationTest12',
  alias: 'OrgTest',
  type: OrganizationType.ASSOCIATION,
  email: 'organization12@email.com',
  yearCreated: 2022,
  cui: '1234566123',
  rafNumber: 'ABCD12345123',
  shortDescription: 'Lorem Ipsum etc',
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
  logo: 'some link',
  website: 'some website',
  facebook: 'some facebook',
  instagram: 'some instagram',
  twitter: 'twitter',
  linkedin: 'linkedin',
  tiktok: 'tiktok',
  donationWebsite: 'donationWebsite',
  redirectLink: 'redirectLink',
  donationSMS: 'donationSMS',
  donationKeyword: 'donationKeyword',
  contact: {
    fullName: 'Florian12',
    email: 'florian@email12.com',
    phone: '1234567890',
  },
  cityId: 1,
  countyId: 1,
};

export const OrganizationActivityMock = {
  isPartOfFederation: true,
  federations: ['FFS', 'FAAF'],
  isPartOfInternationalOrganization: true,
  internationalOrganizationName: 'International Org',
  isSocialServiceViable: true,
  offersGrants: true,
  isPublicIntrestOrganization: true,
  hasBranches: true,
  branches: [1, 2],
  areaId: 2,
  domains: [1, 2],
  cities: [2, 3],
};

export const OrganizationLegalMock = {
  legalReprezentative: {
    fullName: 'Florian123',
    email: 'florian123@email.com',
    phone: '1234567890',
  },
  directors: [
    {
      fullName: 'Florian1234',
      email: 'floria1234n@email.com',
      phone: '1234567890',
    },
  ],
  others: [{ fullName: 'Test me', role: 'admin' }],
};

export const OrganizationFinancialMock = {
  numberOfEmployees: 0,
  totalIncome: 0,
  totalExpenses: 0,
};

export const OrganizationReportMock = {
  numberOfVolunteers: 0,
  numberOfContractors: 0,
};

export const CityMock = {};

export const CountyMock = {};

export const ContactMock = {};
