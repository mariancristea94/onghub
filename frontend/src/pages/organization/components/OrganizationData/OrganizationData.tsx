import React, { useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { PencilIcon, TrashIcon, DownloadIcon, UploadIcon } from '@heroicons/react/outline';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu from '../../../../components/popover-menu/PopoverMenu';
import { useSelectedOrganization } from '../../../../store/selectors';
import { Report } from '../../interfaces/Report.interface';
import { ReportsTableHeaders } from './ReportsTable.headers';
import { PartnerTableHeaders } from './PartnerTable.headers';
import { Investor } from '../../interfaces/Investor.interface';
import { Partner } from '../../interfaces/Partner.interface';
import { InvestorsTableHeaders } from './InvestorTable.headers';
import ReportSummaryModal from './components/ReportSummaryModal';
import CardPanel from '../../../../components/card-panel/CardPanel';
import { getInvestorsTemplate, getPartnersTemplate } from '../../../../services/files/File.service';
import { useOrganizationMutation } from '../../../../services/organization/Organization.queries';
import { useErrorToast } from '../../../../common/hooks/useToast';

const OrganizationData = () => {
  const [isActivitySummartModalOpen, setIsActivitySummaryModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { organizationReport } = useSelectedOrganization();
  const [investorsLink, setInvestorsLink] = useState<string>('');
  const [partnersLink, setPartnersLink] = useState<string>('');
  const { mutate, error, isLoading } = useOrganizationMutation();

  useEffect(() => {
    initTemplateData();
  }, []);

  useEffect(() => {
    if (error) useErrorToast('Could not load open data');
  }, [error]);

  const initTemplateData = async () => {
    setInvestorsLink(await getInvestorsTemplate());
    setPartnersLink(await getPartnersTemplate());
  };

  const buildReportActionColumn = (): TableColumn<Report> => {
    const menuItems = [
      {
        name: 'edit',
        icon: PencilIcon,
        onClick: onEditReport,
      },
      {
        name: 'Elimina date',
        icon: TrashIcon,
        onClick: onDeleteReport,
        isRemove: true,
      },
    ];

    return {
      name: '',
      cell: (row: Report) => <PopoverMenu row={row} menuItems={menuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  const buildPartnersInvestorsActionColumn = (): TableColumn<Investor | Partner> => {
    const menuItems = [
      {
        name: 'Descarca lista',
        icon: DownloadIcon,
        onClick: onDownloadPartner,
      },
      {
        name: 'Incarca lista noua',
        icon: UploadIcon,
        onClick: onUploadPartner,
      },
      {
        name: 'Elimina lista',
        icon: TrashIcon,
        onClick: onDeletePartner,
        isRemove: true,
      },
    ];

    return {
      name: '',
      cell: (row: Investor | Partner) => <PopoverMenu row={row} menuItems={menuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  const onEditReport = (row: Report) => {
    setSelectedReport(row);
    setIsActivitySummaryModalOpen(true);
  };

  const onSaveReport = (data: {
    report: string;
    numberOfContractors: number;
    numberOfVolunteers: number;
  }) => {
    setIsActivitySummaryModalOpen(false);
    mutate({
      id: 2,
      organization: {
        report: {
          reportId: selectedReport?.id as number,
          ...data,
        },
      },
    });
  };

  const onDeleteReport = (row: Report) => {
    mutate({
      id: 2,
      organization: {
        report: {
          reportId: row.id,
        },
      },
    });
  };

  const onDeletePartner = (row: Partner) => {
    console.log('on delete partner', row);
  };

  const onUploadPartner = (row: Partner) => {
    console.log('on upload partner', row);
  };

  const onDownloadPartner = (row: Partner) => {
    console.log('on download partner', row);
  };

  return (
    <div className="flex flex-col gap-y-6">
      <CardPanel title="Sumar">
        <>
          <div className="pt-1 pb-6">
            <p className="text-base font-normal text-gray-900">
              Te rugam sa actualizezi datele din aceasta sectiune la un interval stabilit de timp.
            </p>
          </div>
          <DataTableComponent
            columns={[...ReportsTableHeaders, buildReportActionColumn()]}
            data={organizationReport?.reports || []}
            loading={isLoading}
          />
        </>
      </CardPanel>
      <CardPanel title="Parteneri">
        <>
          <div className="pt-1 pb-6">
            <p className="text-base font-normal text-gray-900 flex">
              Te rugam sa actualizezi datele din aceasta sectiune la un interval stabilit de timp.
              <a
                href={partnersLink}
                className="text-green-500 flex align-middle justify-center ml-2 cursor-pointer"
                download
              >
                <DownloadIcon className="w-5 h-5" />
                Descarca model de tabel parteneri
              </a>
            </p>
          </div>
          <DataTableComponent
            columns={[...PartnerTableHeaders, buildPartnersInvestorsActionColumn()]}
            data={organizationReport?.partners || []}
          />
        </>
      </CardPanel>
      <CardPanel title="Finantatori">
        <>
          <div className="pt-1 pb-6">
            <p className="text-base font-normal text-gray-900 flex">
              Te rugam sa actualizezi datele din aceasta sectiune la un interval stabilit de timp.
              <a
                href={investorsLink}
                className="text-green-500 flex align-middle justify-center ml-2 cursor-pointer"
                download
              >
                <DownloadIcon className="w-5 h-5" />
                Descarca model de tabel finantatori
              </a>
            </p>
          </div>
          <DataTableComponent
            columns={[...InvestorsTableHeaders, buildPartnersInvestorsActionColumn()]}
            data={organizationReport?.investors || []}
          />
        </>
      </CardPanel>
      {isActivitySummartModalOpen && selectedReport && (
        <ReportSummaryModal
          onClose={setIsActivitySummaryModalOpen.bind(null, false)}
          defaultValue={selectedReport}
          onSave={onSaveReport}
          year={selectedReport.year}
        />
      )}
    </div>
  );
};

export default OrganizationData;
