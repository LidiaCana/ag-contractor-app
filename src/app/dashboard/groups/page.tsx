'use client';

import * as React from 'react';
import groupService from '@/api/services/subcontractor';
import { Button, Card, CardActions, List, ListItem, ListItemText } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';

import type { Record, SubcontractorFields } from '@/types/api';

export default function Page(): React.JSX.Element {
  const [groups, setGroups] = React.useState<Record<SubcontractorFields>[] | []>([]);

  const fetchGroups = async () => {
    const data = await groupService.getSubcontractor();
    setGroups(data);
  };

  React.useEffect(() => {
    void fetchGroups();
  }, []);

  return (
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
          <Button variant="contained" style={{ width: '100%' }}>
            New Group
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
}
