'use client';

import * as React from 'react';
import AttendanceService from '@/api/services/attendance';
import ProjectService from '@/api/services/project';
import groupService from '@/api/services/subcontractor';
import {
  css,
  FormLabel,
  Grid,
  Modal,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import SignaturePad from 'react-signature-pad-wrapper';

import { type AttendeeFields, type Record, type SubcontractorFields } from '@/types/api';
import { logger } from '@/lib/default-logger';

interface AttendanceFormProps extends Omit<AttendeeFields, 'group'> {
  group: { id: string; name: string };
}
// TODO: Add type to the form Schedule checkin and checkout calculate hours from checkin and checkout less hr lunch
export function AttendanceForm({ idProject }: { idProject: string }): React.JSX.Element {
  const signaturePadRef = React.useRef<SignaturePad>(null);
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isDisableSubmit, setIsDisableSubmit] = React.useState(true);
  const [project, setProject] = React.useState<{ id: string; name: string; address: string }>({
    id: '',
    name: '',
    address: '',
  });
  const [employees, setEmployees] = React.useState<AttendanceFormProps[] | []>([]);
  const [groups, setGroups] = React.useState<Record<SubcontractorFields>[] | []>([]);
  const date = dayjs();
  const { control, getValues, setError, reset, watch } = useForm<{
    name: string;
    group: string;
  }>({
    defaultValues: {
      name: '',
      group: '',
    },
  });

  const [schedule, setSchedule] = React.useState<{ checkIn: string; checkOut: string }>({
    checkIn: '',
    checkOut: '',
  });

  const getProject = async (): Promise<void> => {
    try {
      const data = await ProjectService.getProjects();
      const selectedProject = data.find((item) => item.id === idProject);
      if (selectedProject) {
        setProject({
          id: selectedProject?.id,
          name: selectedProject?.fields.name,
          address: selectedProject?.fields.address,
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };
  const getGroups = React.useCallback(async (): Promise<void> => {
    try {
      const data = await groupService.getSubcontractor();
      setGroups(data);
    } catch (error) {
      logger.error(error);
    }
  }, []);
  const handleOnClearSignature = (): void => {
    signaturePadRef.current?.clear();
  };
  const onClearForm = (): void => {
    signaturePadRef.current?.clear();
    reset({
      name: '',
      group: '',
    });
  };
  const getSignature = (): string => {
    if (signaturePadRef.current) {
      const dataURL = signaturePadRef.current.toDataURL();
      return dataURL;
    }
    return '';
  };
  const onSubmit = React.useCallback(async () => {
    setIsLoaded(true);
    const request = {
      records: employees.map((employee) => ({
        fields: {
          ...employee,
          group: [employee.group.id],
          project: [project.id],
          'check-in': schedule.checkIn,
          'check-out': schedule.checkOut,
          date: date.format('YYYY-MM-DD'),
        },
      })),
    };
    try {
      await AttendanceService.createAttendance(request);
      setIsLoaded(false);
      onClearForm();
    } catch (error) {
      setError('name', { message: 'Error' });
    }
  }, [setError, employees]);

  React.useEffect(() => {
    void getGroups();
    void getProject();
  }, []);

  const handleOpenSignature = (): void => {
    setIsOpenModal(true);
  };
  const handleAddAttendee = (): void => {
    const values = getValues();

    setEmployees([
      ...employees,
      {
        name: values.name,
        project: [idProject],
        date: date.format('YYYY-MM-DD'),
        group: {
          id: values.group || 'recXKYVX6NajxxM4r',
          name: groups.find((group) => group.id === values.group)?.fields.name || '',
        },
        signature: getSignature(),
        'check-in': schedule.checkIn,
        'check-out': schedule.checkOut,
      },
    ]);
    onClearForm();
    setIsOpenModal(false);
  };
  const handleCloseModal = (): void => {
    setIsOpenModal(!isOpenModal);
  };

  React.useEffect(() => {
    setIsDisableSubmit(employees.length === 0 || schedule.checkIn === '' || schedule.checkOut === '' || isLoaded);
  }, [employees, schedule, isLoaded]);
  const renderRow = (name: string, group: string, signature: string): React.JSX.Element => {
    return (
      <TableRow key={name}>
        <TableCell>{name}</TableCell>
        <TableCell>{group}</TableCell>
        <TableCell>
          <img src={signature} alt="signature" width={50} height={50} />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <Card>
        <CardHeader subheader={project.address} title={project.name} />
        <Divider />
        <Grid padding={4}>
          <Grid>
            <Typography variant="h6" gutterBottom>
              Schedule <span style={{ color: 'red' }}>* Required</span>
            </Typography>
          </Grid>
          <Grid container style={{ gap: '10px' }}>
            <TimePicker
              label="Check In"
              minutesStep={5}
              onChange={(e) => {
                setSchedule({ ...schedule, checkIn: e?.toISOString() || '' });
              }}
            />
            <TimePicker
              label="Check Out"
              minutesStep={5}
              onChange={(e) => {
                setSchedule({ ...schedule, checkOut: e?.toISOString() || '' });
              }}
            />
          </Grid>
        </Grid>
        <Divider />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormLabel>Name</FormLabel>
              </TableCell>
              <TableCell>
                <FormLabel>Group</FormLabel>
              </TableCell>
              <TableCell>
                <FormLabel>Signature</FormLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => renderRow(employee.name, employee.group.name, employee.signature))}
            <TableRow key="new-employee">
              <TableCell>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <>
                        <InputLabel>Name</InputLabel>
                        <OutlinedInput {...field} label="Name" name="name" type="text" />
                      </>
                    </FormControl>
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name="group"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Group</InputLabel>
                      <Select {...field} label="Group" name="group" variant="outlined">
                        {groups?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.fields.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={handleOpenSignature}
                  variant="contained"
                  disabled={watch('name') === '' || watch('group') === ''}
                >
                  Signature
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit" disabled={isDisableSubmit} onClick={onSubmit}>
            Submit
          </Button>
        </CardActions>
      </Card>
      <BaseModal keepMounted open={isOpenModal} onClose={handleCloseModal}>
        <ModalContent sx={{ width: 400 }}>
          <SignaturePad ref={signaturePadRef} />
          <CardActions>
            <Button variant="outlined" onClick={handleOnClearSignature}>
              Clear Signature
            </Button>
            <Button variant="contained" onClick={handleAddAttendee}>
              Save
            </Button>
          </CardActions>
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
    flex-direction: column;
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
