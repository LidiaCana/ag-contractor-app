import * as React from 'react';
import type { Metadata } from 'next';
import AttendanceService from '@/api/services/attendance';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { logger } from '@/lib/default-logger';
import Scanner from '@/components/core/scanner';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;
interface Fields {
  'name (from group)': string[];
}

const machineParts = [
  { id: 'PST-001', description: 'Piston', count: 20, cost: '$50', status: 'pending' as const },
  { id: 'SCR-002', description: 'Screw', count: 150, cost: '$0.5', status: 'in stock' as const },
  { id: 'BLT-003', description: 'Bolt', count: 100, cost: '$0.75', status: 'in stock' as const },
  { id: 'BRG-004', description: 'Bearing', count: 50, cost: '$15', status: 'low stock' as const },
  { id: 'GEO-005', description: 'Gear', count: 30, cost: '$25', status: 'in stock' as const },
  { id: 'PIN-006', description: 'Pin', count: 200, cost: '$0.2', status: 'in stock' as const },
  { id: 'CHP-007', description: 'Chip', count: 40, cost: '$10', status: 'pending' as const },
  { id: 'PIP-008', description: 'Pipe', count: 75, cost: '$5', status: 'in stock' as const },
  { id: 'OIL-009', description: 'Lubricating Oil', count: 60, cost: '$30', status: 'low stock' as const },
  { id: 'SPR-010', description: 'Spring', count: 90, cost: '$2', status: 'in stock' as const },
  { id: 'VLV-011', description: 'Valve', count: 45, cost: '$18', status: 'pending' as const },
  { id: 'BLD-012', description: 'Blade', count: 25, cost: '$12', status: 'in stock' as const },
  { id: 'RLR-013', description: 'Roller', count: 35, cost: '$22', status: 'low stock' as const },
  { id: 'CLT-014', description: 'Clutch', count: 15, cost: '$40', status: 'pending' as const },
  { id: 'BRS-015', description: 'Brush', count: 80, cost: '$5', status: 'in stock' as const },
];
export default async function Page(): Promise<React.JSX.Element> {
  const attendanceData = await AttendanceService.getAttendance<Fields>('fields%5B%5D=name (from group)');

  const groupCount = attendanceData.reduce<Record<string, number>>((acc, group) => {
    const name = group.fields['name (from group)'][0];
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  logger.debug(groupCount);
  return (
    <Grid container spacing={3}>
      {/* <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: 'PRD-005',
              name: 'Soja & Co. Eucalyptus',
              image: '/assets/product-5.png',
              updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
            },
            {
              id: 'PRD-004',
              name: 'Necessaire Body Lotion',
              image: '/assets/product-4.png',
              updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-003',
              name: 'Ritual of Sakura',
              image: '/assets/product-3.png',
              updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-002',
              name: 'Lancome Rouge',
              image: '/assets/product-2.png',
              updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
            },
            {
              id: 'PRD-001',
              name: 'Erbology Aloe Vera',
              image: '/assets/product-1.png',
              updatedAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>*/}
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders orders={machineParts} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={12} sm={6} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained">Scan & Add Item</Button>

        <Button variant="contained">Scan & Subtract Item</Button>
      </Grid>
      <Grid lg={12} sm={12} xs={12}>
        <Scanner />
      </Grid>
    </Grid>
  );
}
