import create from 'zustand';
import { City } from '../common/interfaces/city.interface';
import { County } from '../common/interfaces/county.interface';
import { IOrganizationFinancial } from '../pages/organization/interfaces/OrganizationFinancial.interface';
import { IOrganizationGeneral } from '../pages/organization/interfaces/OrganizationGeneral.interface';
import { IOrganizationLegal } from '../pages/organization/interfaces/OrganizationLegal.interface';
import { IOrganizationReport } from '../pages/organization/interfaces/OrganizationReport.interface';
import { nomenclatureSlice } from './nomenclature/nomenclature.slice';
import { organizationFinancialSlice } from './organization/organization-financial.slice';
import { organizationGeneralSlice } from './organization/organization-general.slice';
import { organizationLegalSlice } from './organization/organization-legal.slice';
import { organizationReportsSlice } from './organization/organization-reports.slice';

interface OrganizationState {
  organizationGeneral: IOrganizationGeneral | null;
  organizationFinancial: IOrganizationFinancial[];
  organizationReport: IOrganizationReport | null;
  organizationLegal: IOrganizationLegal | null;
  setOrganizationGeneral: (organizationGeneral: IOrganizationGeneral) => void;
  setOrganizationFinancial: (organizationFinancial: IOrganizationFinancial[]) => void;
  setOrganizationReport: (organizationReport: IOrganizationReport) => void;
  setOrganizationLegal: (organizationLegal: IOrganizationLegal) => void;
}
interface NomenclatureState {
  counties: County[];
  cities: City[];
  setCounties: (counties: County[]) => void;
  setCities: (cities: City[]) => void;
}

const useStore = create<OrganizationState & NomenclatureState>()((set) => ({
  ...organizationGeneralSlice(set),
  ...organizationFinancialSlice(set),
  ...organizationReportsSlice(set),
  ...organizationLegalSlice(set),
  ...nomenclatureSlice(set),
}));

export default useStore;
