'use client';

import React from 'react';
import { Grid } from '@mui/material';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

import { logger } from '@/lib/default-logger';

function Scanner() {
  const [data, setData] = React.useState('Not Found');

  return (
    <Grid container spacing={1} justifyContent="center" alignItems="center" direction={'column'}>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          // Logging the result for debugging purposes

          if (result) {
            logger.debug(result); // Using a public method to access the scanned data
            setData(result?.getText() || ''); // Assuming getText() is a public method to access the scanned data
          } else {
            setData('Not Found');
          }
        }}
      />
      <p>{data}</p>
    </Grid>
  );
}

export default Scanner;
