import React from 'react';

import { Stack, Button, Typography } from '@mui/material';

import { JoinDialog } from './join-dialog';
import { IngressDialog } from './ingress-dialog';
import { BroadcastDialog } from './broadcast-dialog';

export function HomeActions() {
  return (
    <Stack direction="column" spacing={4} alignItems="center" justifyContent="center">
      <Stack direction="row" spacing={2}>
        <BroadcastDialog>
          <Button variant="contained" size="large">
            Stream from browser
          </Button>
        </BroadcastDialog>
        <IngressDialog>
          <Button variant="contained" size="large">
            Stream from OBS
          </Button>
        </IngressDialog>
      </Stack>
      <Typography variant="body2">- OR -</Typography>
      <JoinDialog>
        <Button variant="outlined" size="large" fullWidth>
          Join existing stream
        </Button>
      </JoinDialog>
    </Stack>
  );
}
