'use client';

import React from 'react';
import { LiveKitRoom } from '@livekit/components-react';

import { Box, Stack } from '@mui/material';

import { Chat } from 'src/components/chat';
import { TokenContext } from 'src/components/token-context';
import { StreamPlayer } from 'src/components/stream-player';

export default function HostPage({ authToken, roomToken, serverUrl }) {
  return (
    <TokenContext.Provider value={authToken}>
      <LiveKitRoom serverUrl={serverUrl} token={roomToken}>
        <Stack
          direction="row"
          sx={{
            width: '100%',
            height: '100vh',
          }}
        >
          <Stack
            direction="column"
            sx={{
              flex: 1,
            }}
          >
            <Box
              sx={{
                flex: 1,
                backgroundColor: 'background.default',
              }}
            >
              <StreamPlayer isHost />
            </Box>
            {/* <ReactionBar /> */}
          </Stack>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              minWidth: 280,
              borderLeft: '1px solid',
              borderColor: 'divider',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Chat />
          </Box>
        </Stack>
      </LiveKitRoom>
    </TokenContext.Provider>
  );
}
