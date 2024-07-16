import * as React from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';
import { paths } from '@/paths';
import { AttendanceForm } from '@/components/dashboard/attendance/form';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page({ params }: { params: { id: string } }): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4">Attendance</Typography>
          <Button
            component={RouterLink}
            href={paths.dashboard.attendance.new}
            startIcon={<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
          >
            Go back
          </Button>
        </Stack>
        {/* Example usage of the id parameter */}
        {params.id && <Typography variant="subtitle1">ID: {params.id}</Typography>}
      </div>
      <Grid container spacing={3}>
        <Grid lg={8} md={6} xs={12}>
          <AttendanceForm idProject={params.id} />
        </Grid>
      </Grid>
    </Stack>
  );
}
