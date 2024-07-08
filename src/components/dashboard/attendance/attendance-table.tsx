'use client';

import * as React from 'react';
import AttendanceService from '@/api/services/attendance';

import { type AttendeeFields } from '@/types/api';
import { logger } from '@/lib/default-logger';
import CustomTable from '@/components/core/table';

const headCells = [
  { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'project', numeric: false, disablePadding: false, label: 'Project' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'hours_worked', numeric: true, disablePadding: false, label: 'Hours Worked' },
  { id: 'subcontractor', numeric: false, disablePadding: false, label: 'Subcontractor' },
];

type AttendanceData = Omit<AttendeeFields, 'signature' | 'is_employee'>;
interface Data extends AttendanceData {
  id: number | string;
}

export default function AttendanceTable(): React.ReactElement {
  const [rows, setRows] = React.useState<Data[]>([]);
  const handleOnChangePage = (e: unknown, newPage: number): void => {
    logger.debug(newPage);
  };
  const handleOnChangeRowsPerPage = (e: unknown): void => {
    logger.debug(e);
  };

  const getData = async (): Promise<void> => {
    try {
      const response = await AttendanceService.getAttendance();
      const data = response.map((record) => {
        return {
          id: record.id,
          name: record.fields.name,
          project: record.fields['name (from project)'],
          date: record.fields.date,
          hours_worked: record.fields.hours_worked,
          subcontractor: record.fields['name (from subcontractor)'],
        };
      });

      setRows(data);
    } catch (error) {
      logger.error(error);
    }
  };
  React.useEffect(() => {
    void getData();
  }, []);
  return (
    <CustomTable
      headCells={headCells}
      rows={rows}
      onChangePage={handleOnChangePage}
      onChangeRowsPerPage={handleOnChangeRowsPerPage}
    />
  );
}
