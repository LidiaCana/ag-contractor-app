'use client';

import * as React from 'react';
import groupService from '@/api/services/subcontractor';
import { Button, Card, CardActions, CardContent, List, ListItem, ListItemText, TextField } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { Controller, useForm } from 'react-hook-form';

import type { Record, SubcontractorFields } from '@/types/api';
import { logger } from '@/lib/default-logger';
import ModalComponent from '@/components/core/modal';

export default function Page(): React.JSX.Element {
  const [groups, setGroups] = React.useState<Record<SubcontractorFields>[] | []>([]);
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const { control, handleSubmit, setError } = useForm<SubcontractorFields>();
  const fetchGroups = async () => {
    const data = await groupService.getSubcontractor();
    setGroups(data);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const onSubmit = React.useCallback(
    async (data: SubcontractorFields) => {
      try {
        const response = await groupService.createSubcontractor(data);
        if (response.id) {
          setGroups([...groups, response]);
          setIsOpenModal(false);
        }
      } catch (e) {
        logger.error(e);
      }
    },
    [setError, groups]
  );

  React.useEffect(() => {
    void fetchGroups();
  }, []);

  return (
    <>
      <Stack spacing={3}>
        <Card>
          <CardHeader title="Groups" />
          <List>
            {groups.map((group) => (
              <ListItem button key={group.id} divider>
                <ListItemText
                  primary={group.fields.name}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondary={`Phone ${group.fields.phone}`}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
          <CardActions>
            <Button variant="contained" style={{ width: '100%' }} onClick={handleOpenModal}>
              New Group
            </Button>
          </CardActions>
        </Card>
      </Stack>
      <ModalComponent open={isOpenModal} onClose={handleCloseModal} height="80%">
        <CardHeader title="New Group" />

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <CardContent style={{ display: 'grid', gap: '8%' }}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
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
            <Controller
              name="manager"
              control={control}
              defaultValue=""
              rules={{ required: 'Manager is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Manager"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{ required: 'Phone number is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error ? error.message : null}
                />
              )}
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" type="submit" style={{ width: '100%' }}>
              Save
            </Button>
          </CardActions>
        </form>
      </ModalComponent>
    </>
  );
}
