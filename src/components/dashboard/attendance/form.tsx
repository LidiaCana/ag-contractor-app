'use client';

import * as React from 'react';
import AttendanceService from '@/api/services/attendance';
import EmployeeService from '@/api/services/employee';
import ProjectService from '@/api/services/project';
import subcontractorService from '@/api/services/subcontractor';
import { Autocomplete, FormLabel, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import SignaturePad from 'react-signature-pad-wrapper';

import { type AttendeeFields, type ProjectFields, type Record, type SubcontractorFields } from '@/types/api';
import { logger } from '@/lib/default-logger';

export function AttendanceForm(): React.JSX.Element {
  const signaturePadRef = React.useRef<SignaturePad>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [projects, setProjects] = React.useState<Record<ProjectFields>[] | null>(null);
  const [employees, setEmployees] = React.useState<{ id: string; label: string }[] | []>([]);
  const [subcontractors, setSubcontractors] = React.useState<Record<SubcontractorFields>[] | []>([]);
  const [isEmployee, setIsEmployee] = React.useState(false);
  const date = dayjs();
  const { control, handleSubmit, setError } = useForm<AttendeeFields>();

  const getEmployees = async (): Promise<void> => {
    try {
      const data = await EmployeeService.getEmployees();
      const newArray = data.map((item) => {
        return { id: item.id, label: item.fields.name || '' };
      });
      setEmployees(newArray);
    } catch (e) {
      logger.error('error');
    }
  };
  const getProjects = async (): Promise<void> => {
    try {
      const data = await ProjectService.getProjects();
      setProjects(data);
    } catch (error) {
      logger.error(error);
    }
  };
  const getSubcontractors = async (): Promise<void> => {
    try {
      const data = await subcontractorService.getSubcontractor();
      setSubcontractors(data);
    } catch (error) {
      logger.error(error);
    }
  };
  const handleOnClear = (): void => {
    signaturePadRef.current?.clear();
  };
  const getSignature = (): string => {
    if (signaturePadRef.current) {
      const dataURL = signaturePadRef.current.toDataURL();
      return dataURL;
    }
    return '';
  };
  const onSave = React.useCallback(
    async (values: AttendeeFields) => {
      setIsLoaded(true);
      const data = {
        name: values.name,
        project: values.project,
        date: values.date,
        subcontractor: values.subcontractor || '',
        is_employee: isEmployee,
        signature: getSignature(),
        hours_worked: 8,
      };
      try {
        const response = await AttendanceService.createAttendance(data);
        logger.debug(response);
      } catch (error) {
        setError('name', { message: 'Error' });
      }
    },
    [setError]
  );
  React.useEffect(() => {
    void getProjects();
    void getEmployees();
    void getSubcontractors();
  }, []);
  return (
    <Card>
      <CardHeader subheader="The information can be edited" title="New Attendance" />
      <Divider />
      <form onSubmit={handleSubmit(onSave)}>
        <Grid md={6} xs={12}>
          <FormControl fullWidth required>
            <FormLabel>AG Employee</FormLabel>
            <Switch
              onChange={() => {
                setIsEmployee(!isEmployee);
              }}
            />
          </FormControl>
        </Grid>
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12} key="name">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <FormControl fullWidth>
                    {!isEmployee && (
                      <>
                        <InputLabel>Name</InputLabel>
                        <OutlinedInput {...field} label="Name" name="name" type="text" />
                      </>
                    )}
                    {isEmployee ? (
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={employees ?? []}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...field} {...params} label="Name" />}
                      />
                    ) : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12} key="project">
              <Controller
                control={control}
                name="project"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Project</InputLabel>
                    <Select {...field} label="Project" name="project" variant="outlined">
                      {projects?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.fields.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12} key="date">
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <DatePicker {...field} disabled defaultValue={date} />
                  </FormControl>
                )}
              />
            </Grid>
            {!isEmployee ? (
              <Grid md={6} xs={12} key="subcontractor">
                <Controller
                  control={control}
                  name="subcontractor"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Sub-contractor</InputLabel>
                      <Select {...field} label="Sub-contractor" name="subcontractor" variant="outlined">
                        {subcontractors?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.fields.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            ) : null}

            <Grid md={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Signature</InputLabel>
                <SignaturePad ref={signaturePadRef} />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleOnClear} disabled={isLoaded}>
            Clear Signature
          </Button>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
