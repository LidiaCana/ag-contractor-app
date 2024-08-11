'use client';

import * as React from 'react';
import AttendanceService from '@/api/services/attendance';
import ProjectService from '@/api/services/project';
import SubcontractorService from '@/api/services/subcontractor';
import { Autocomplete, Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

import {
  type AttendeeFields,
  type AttendeeResponseFields,
  type ProjectFields,
  type Record,
  type SubcontractorFields,
} from '@/types/api';
import { logger } from '@/lib/default-logger';
import CustomTable from '@/components/core/table';

const headCells = [
  { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'project', numeric: false, disablePadding: false, label: 'Project' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'hours_worked', numeric: true, disablePadding: false, label: 'Hours Worked' },
  { id: 'group', numeric: false, disablePadding: false, label: 'Group' },
  { id: 'check-in', numeric: false, disablePadding: false, label: 'Check-in' },
  { id: 'check-out', numeric: false, disablePadding: false, label: 'Check-out' },
];

type AttendanceData = Omit<AttendeeFields, 'signature' | 'group' | 'project'>;
interface Data extends AttendanceData {
  id: number | string;
  group: string;
  project: string;
}

export default function AttendanceTable(): React.ReactElement {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [filterDate, setFilterDate] = React.useState({ start: dayjs(), end: dayjs() });
  const [filterGroup, setFilterGroup] = React.useState<string>('');
  const [filterProject, setFilterProject] = React.useState<string>('');
  const [groups, setGroups] = React.useState<Record<SubcontractorFields>[] | []>([]);
  const [projects, setProjects] = React.useState<Record<ProjectFields>[] | []>([]);
  const handleOnChangePage = (e: unknown, newPage: number): void => {
    logger.debug(newPage);
  };
  const handleOnChangeRowsPerPage = (e: unknown): void => {
    logger.debug(e);
  };
  const getGroups = async (): Promise<void> => {
    const data = await SubcontractorService.getSubcontractor();
    setGroups(data);
  };
  const getProjects = async (): Promise<void> => {
    const data = await ProjectService.getProjects();
    setProjects(data);
  };

  const getData = async (query?: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await AttendanceService.getAttendance<AttendeeResponseFields>(query);
      const data = response.map((record, index) => {
        return {
          id: index,
          name: record.fields.name,
          project: record.fields['name (from project)'][0],
          date: record.fields.date,
          hours_worked: record.fields.hours_worked,
          group: record.fields['name (from group)'][0],
          'check-in': dayjs(record.fields['check-in']).format('HH:mm'),
          'check-out': dayjs(record.fields['check-out']).format('HH:mm'),
        };
      });
      setRows(data);
      setIsLoading(false);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleApplyFilter = async (): Promise<void> => {
    const query = `filterByFormula=AND({project} = "${filterProject}", {group} = "${filterGroup}", IS_AFTER({Date}, DATETIME_PARSE("${filterDate.start.format('MM-DD-YYYY')}",'MM-DD-YYYY')),IS_BEFORE({Date}, DATETIME_PARSE("${filterDate.end.format('MM-DD-YYYY')}", 'MM-DD-YYYY')))`;
    await getData(query);
  };
  const handleOnDownload = async (): Promise<void> => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'attendance.xlsx');
  };

  React.useEffect(() => {
    void getData();
    void getGroups();
    void getProjects();
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Button
          color="inherit"
          startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
          disabled={rows.length === 0}
          onClick={handleOnDownload}
        >
          Export
        </Button>
      </Stack>
      <Box mb={2}>
        <Stack direction="row" spacing={2}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={groups}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option.fields.name}
            onChange={(event, value) => {
              if (value) setFilterGroup(value.fields.name);
            }}
            renderInput={(params) => <TextField {...params} label="Groups" />}
          />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={projects}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option.fields.name}
            onChange={(event, value) => {
              if (value) setFilterProject(value.fields.name);
            }}
            renderInput={(params) => <TextField {...params} label="Projects" />}
          />

          <DatePicker
            label="Start Date"
            onChange={(date) => {
              if (date) setFilterDate({ ...filterDate, start: date });
            }}
          />
          <DatePicker
            label="End Date"
            onChange={(date) => {
              if (date) setFilterDate({ ...filterDate, end: date });
            }}
          />
          <Button variant="contained" onClick={handleApplyFilter} type="button">
            Apply
          </Button>
        </Stack>
      </Box>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <CustomTable
          headCells={headCells}
          rows={rows}
          onChangePage={handleOnChangePage}
          onChangeRowsPerPage={handleOnChangeRowsPerPage}
        />
      )}
    </LocalizationProvider>
  );
}
