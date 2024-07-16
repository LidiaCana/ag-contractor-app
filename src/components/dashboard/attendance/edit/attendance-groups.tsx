import * as React from 'react';
import TimerIcon from '@mui/icons-material/Timer';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';

import type { AttendeeResponseFields, Record } from '@/types/api';

const statusMap = {
  open: { label: 'Open', color: 'success' },
} as const;

export interface AttendanceGroup {
  attendance: Record<AttendeeResponseFields>[];
  subcontractor: string;
  project: string;
  status: 'open';
  date: Date;
  'name (from project)': string;
  'name (from subcontractor)': string;
}

export interface AttendanceGroupProps {
  groupsAttendance?: AttendanceGroup[];
  onOpenModal: (index: number) => void;
}

export function AttendanceGroups({ groupsAttendance = [], onOpenModal }: AttendanceGroupProps): React.JSX.Element {
  return (
    <Card sx={{ overflowY: 'auto' }}>
      <CardHeader title="Opened Attendance" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Subcontractor</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submit Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupsAttendance.map((group, index) => {
              const { label, color } = statusMap[group.status] ?? { label: 'open', color: 'success' };

              return (
                <TableRow key={`group-${index}`}>
                  <TableCell>{dayjs(group.date).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{group['name (from subcontractor)']}</TableCell>
                  <TableCell>{group['name (from project)']}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        onOpenModal(index);
                      }}
                    >
                      <TimerIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
