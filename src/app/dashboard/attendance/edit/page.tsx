'use client';

import * as React from 'react';
import AttendanceService from '@/api/services/attendance';
import { Button, CircularProgress, css, styled } from '@mui/material';
import Modal from '@mui/material/Modal';
// import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';

import type { Record, UpdateScheduleAttendeeFields } from '@/types/api';
import { AttendanceGroups } from '@/components/dashboard/attendance/edit/attendance-groups';

import type { AttendanceGroupInterface } from './type';

// export const metadata = { title: `Reports | Dashboard | ${config.site.name}` } satisfies Metadata;

interface SubmitHoursForm {
  checkIn: string;
  checkOut: string;
}
export default function Page(): React.JSX.Element {
  const [groupsAttendance, setGroupsAttendance] = React.useState<AttendanceGroupInterface[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [groupSelected, setGroupSelected] = React.useState<number>(0);

  const { control, handleSubmit } = useForm<SubmitHoursForm>();

  const groupData = (data: Record<AttendanceGroupInterface>[]): never[] => {
    const grouped: { [key: string]: Record<AttendanceGroupInterface>[] } = {};

    data.forEach((item) => {
      // Assuming each record has exactly one project and subcontractor for simplicity
      const project = item.fields.project[0];
      const subcontractor = item.fields.subcontractor[0];
      const date = item.fields.date;
      const key = `${date}_${project}_${subcontractor}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
    const arrayGrouped = Object.keys(grouped).map((key) => {
      return { ...grouped[key][0].fields, attendance: grouped[key] };
    });

    return arrayGrouped as never[];
  };
  const getData = async () => {
    setIsLoading(true);
    const data = await AttendanceService.getAttendance<AttendanceGroupInterface>(
      'filterByFormula=AND({status}="open")&fields%5B%5D=name&fields%5B%5D=project&fields%5B%5D=date&fields%5B%5D=subcontractor&fields%5B%5D=name (from project)&fields%5B%5D=name (from subcontractor)'
    );
    const items = groupData(data);

    setGroupsAttendance(items);
    setIsLoading(false);
  };
  React.useEffect(() => {
    void getData();
  }, []);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const onSubmit = React.useCallback(
    async (values: SubmitHoursForm) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- safe to assume groupSelected is a number
      const attendance = groupsAttendance[groupSelected].attendance;
      if (!attendance) {
        return;
      }
      const data = attendance.map((item) => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe to assume id is a string
          id: item.id as string,
          fields: {
            'check-in': dayjs(values.checkIn).toISOString(),
            'check-out': dayjs(values.checkOut).toISOString(),
            status: 'closed',
          },
        };
      });
      await AttendanceService.updateSchedule(data as unknown as UpdateScheduleAttendeeFields[]);
      setOpenModal(false);
      void getData();
    },
    [groupsAttendance]
  );
  const handleOnOpenModal = (index: number) => {
    setGroupSelected(index);
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Submit Hours</Typography>
          </Stack>
        </Stack>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <AttendanceGroups groupsAttendance={groupsAttendance} onOpenModal={handleOnOpenModal} />
        )}
      </Stack>
      <BaseModal keepMounted open={openModal} onClose={handleClose}>
        <ModalContent sx={{ width: 400 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Controller
                control={control}
                name="checkIn"
                render={({ field }) => <TimePicker {...field} label="Check In" minutesStep={5} />}
              />
              <Controller
                control={control}
                name="checkOut"
                render={({ field }) => <TimePicker {...field} label="Check Out" minutesStep={5} />}
              />
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Stack>
          </form>
        </ModalContent>
      </BaseModal>
    </>
  );
}

const ModalContent = styled('div')(
  () => css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
  `
);
const BaseModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
