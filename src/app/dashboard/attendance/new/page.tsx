import * as React from 'react';
import type { Metadata } from 'next';
// import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { ListProjects } from '@/components/dashboard/attendance/projects';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="column" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Projects Attendance</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="h6">Select the project to make attendance</Typography>
          </Stack>
        </Stack>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <ListProjects />
        </Stack>
      </Stack>
    </Stack>
  );
}
