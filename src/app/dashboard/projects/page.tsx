'use client';

import React, { useEffect, useState } from 'react';
import ProjectService from '@/api/services/project';
import { Button, CardActions, CardContent, CircularProgress, css, Grid, Modal, styled, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import { Controller, useForm } from 'react-hook-form';

import type { ProjectFields, Record } from '@/types/api';
import { logger } from '@/lib/default-logger';

interface ProjectForm {
  name: string;
  general_contractor: string;
  contractor: string;
  address: string;
  project_manager: string;
  competent_person: string;
  start_date: string;
}
export default function Page(): React.JSX.Element {
  const [projects, setProjects] = useState<Record<ProjectFields>[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { control, handleSubmit, setError } = useForm<ProjectForm>();

  const getProjects = async (): Promise<void> => {
    setIsLoading(true);
    const data = await ProjectService.getProjects();
    setProjects(data);
    setIsLoading(false);
  };
  useEffect(() => {
    void getProjects();
  }, []);
  const handleProjectClick = (projectId: string) => {
    // Set redux project
    // TODO: Open a modal with details project
    logger.debug(projectId);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleOnSubmit = React.useCallback(
    async (data: ProjectForm) => {
      logger.debug(data);
      try {
        const response = await ProjectService.createProject(data);
        if (response) {
          setProjects([...projects, response]);
          setIsOpenModal(false);
        }
      } catch (e) {
        logger.error(e);
      }
    },
    [setError, projects]
  );
  const onOpenModal = () => {
    setIsOpenModal(true);
  };
  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Card>
          <CardHeader title="Projects" />
          <Divider />

          <List>
            {projects.map((project, index) => (
              <ListItem
                button
                divider={index < projects.length - 1}
                key={project.id}
                onClick={() => {
                  handleProjectClick(project.id);
                }}
              >
                <ListItemText
                  primary={project.fields.name}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondary={`Location ${project.fields.address}`}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <IconButton edge="end">
                  <DotsThreeVerticalIcon weight="bold" />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <CardActions>
            <Button variant="contained" onClick={onOpenModal}>
              New Project
            </Button>
          </CardActions>
        </Card>
      )}
      <BaseModal keepMounted open={isOpenModal} onClose={handleCloseModal}>
        <ModalContent sx={{ width: 600, height: '100%' }} style={{ overflowY: 'scroll' }}>
          <CardHeader title="New Project" />
          <CardContent>
            <form onSubmit={handleSubmit(handleOnSubmit)} style={{ display: 'flex' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: 'Name is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Name"
                        fullWidth
                        error={Boolean(error)}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="general_contractor"
                    control={control}
                    rules={{ required: 'General Contractor is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="General Contractor"
                        fullWidth
                        error={Boolean(error)}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="contractor"
                    control={control}
                    rules={{ required: 'Contractor is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Contractor"
                        fullWidth
                        error={Boolean(error)}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: 'Address is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Address"
                        fullWidth
                        error={Boolean(error)}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="project_manager"
                    control={control}
                    rules={{ required: 'Project Manager is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Project Manager"
                        fullWidth
                        error={Boolean(error)}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="competent_person"
                    control={control}
                    rules={{ required: 'Competent Person is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Competent Person"
                        fullWidth
                        error={Boolean(error)}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="start_date"
                    control={control}
                    rules={{ required: 'Start Date is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Start Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={Boolean(error)}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" type="submit" style={{ marginTop: '10px', width: '100%' }}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
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
