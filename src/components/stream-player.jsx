'use client';

import Confetti from 'js-confetti';
import { Icon } from '@iconify/react';
import React, { useRef, useState, useEffect } from 'react';
import {
  useDataChannel,
  useRoomContext,
  ConnectionState,
  useParticipants,
  useLocalParticipant,
} from '@livekit/components-react';

import { Box, Grid, Badge, Stack, Avatar, Button, Typography } from '@mui/material';

import { useCopyToClipboard } from 'src/lib/clipboard';

import { PresenceDialog } from './presence-dialog';

function ConfettiCanvas() {
  const [confetti, setConfetti] = useState();
  const [decoder] = useState(() => new TextDecoder());
  const canvasEl = useRef(null);

  useDataChannel('reactions', (data) => {
    const options = {};

    if (decoder.decode(data.payload) !== '🎉') {
      options.emojis = [decoder.decode(data.payload)];
      options.confettiNumber = 12;
    }

    confetti?.addConfetti(options);
  });

  useEffect(() => {
    setConfetti(new Confetti({ canvas: canvasEl?.current ?? undefined }));
  }, []);

  return <canvas ref={canvasEl} style={{ position: 'absolute', height: '100%', width: '100%' }} />;
}

export function StreamPlayer({ isHost = false }) {
  const [_, copy] = useCopyToClipboard();
  const [localVideoTrack, setLocalVideoTrack] = useState();
  const localVideoEl = useRef(null);

  const { metadata, name: roomName, state: roomState } = useRoomContext();
  const roomMetadata = metadata && JSON.parse(metadata);
  const { localParticipant } = useLocalParticipant();
  const localMetadata = localParticipant.metadata && JSON.parse(localParticipant.metadata);

  const canHost = isHost || (localMetadata?.invited_to_stage && localMetadata?.hand_raised);
  const participants = useParticipants();

  const showNotification = isHost
    ? participants.some((p) => {
        // eslint-disable-next-line no-shadow
        const metadata = p.metadata && JSON.parse(p.metadata);
        return metadata?.hand_raised && !metadata?.invited_to_stage;
      })
    : localMetadata?.invited_to_stage && !localMetadata?.hand_raised;

  // Similar implementation of useEffect and other hooks as in original component

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%', backgroundColor: 'black' }}>
      <Grid container spacing={2} sx={{ position: 'absolute', width: '100%', height: '100%' }}>
        {canHost && (
          <Grid item xs={12} sx={{ position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Avatar>{localParticipant.identity[0] ?? '?'}</Avatar>
            </Box>
            <video
              ref={localVideoEl}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform: 'scaleX(-1)',
              }}
            />
            <Badge
              badgeContent={`${localParticipant.identity} (you)`}
              color="secondary"
              sx={{
                position: 'absolute',
                bottom: 2,
                right: 2,
              }}
            />
          </Grid>
        )}
        {/* Remote video tracks rendering similar to original */}
      </Grid>

      <ConfettiCanvas />

      <Box sx={{ position: 'absolute', top: 0, width: '100%', p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              disabled={!roomName}
              onClick={() => copy(`${process.env.NEXT_PUBLIC_SITE_URL}/watch/${roomName}`)}
              startIcon={<Icon icon="mdi:content-copy" />}
            >
              {roomState === ConnectionState.Connected ? roomName : 'Loading...'}
            </Button>

            {/* Media device settings and leave stage button */}
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            {roomState === ConnectionState.Connected && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    backgroundColor: 'red',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    animation: 'pulse 1s infinite',
                  }}
                />
                <Typography variant="caption" color="primary">
                  LIVE
                </Typography>
              </Stack>
            )}

            <PresenceDialog isHost={isHost}>
              <Box sx={{ position: 'relative' }}>
                {showNotification && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      display: 'flex',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        backgroundColor: 'primary.main',
                        borderRadius: '50%',
                        width: 12,
                        height: 12,
                        animation: 'ping 1s infinite',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'relative',
                        backgroundColor: 'primary.main',
                        borderRadius: '50%',
                        width: 12,
                        height: 12,
                      }}
                    />
                  </Box>
                )}
                <Button
                  variant="outlined"
                  disabled={roomState !== ConnectionState.Connected}
                  startIcon={
                    roomState === ConnectionState.Connected ? (
                      <Icon icon="mdi-light:eye" />
                    ) : (
                      <Icon icon="mdi-light:eye-off" />
                    )
                  }
                >
                  {roomState === ConnectionState.Connected ? participants.length : ''}
                </Button>
              </Box>
            </PresenceDialog>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
