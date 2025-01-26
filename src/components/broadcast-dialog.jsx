'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box,
  Button,
  Dialog,
  Switch,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { AllowParticipationInfo } from './allow-participation-info';

export function BroadcastDialog({ children }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [name, setName] = useState('');
  const [enableChat, setEnableChat] = useState(true);
  const [allowParticipation, setAllowParticipation] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onGoLive = async () => {
    setLoading(true);
    const res = await fetch('/api/create_stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_name: roomName,
        metadata: {
          creator_identity: name,
          enable_chat: enableChat,
          allow_participation: allowParticipation,
        },
      }),
    });
    const {
      auth_token,
      connection_details: { token },
    } = await res.json();
    router.push(`/host?&at=${auth_token}&rt=${token}`);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setRoomName('');
    setName('');
    setEnableChat(true);
    setAllowParticipation(true);
  };

  return (
    <>
      <Box onClick={() => setDialogOpen(true)}>{children}</Box>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Create new stream</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Room name
              </Typography>
              <TextField
                fullWidth
                placeholder="abcd-1234"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Your name
              </Typography>
              <TextField
                fullWidth
                placeholder="Roger Dunn"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  Enable chat
                </Typography>
                <Switch checked={enableChat} onChange={(e) => setEnableChat(e.target.checked)} />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Viewers can participate
                  </Typography>
                  <AllowParticipationInfo />
                </Box>
                <Switch
                  checked={allowParticipation}
                  onChange={(e) => setAllowParticipation(e.target.checked)}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={onGoLive}
            color="primary"
            variant="contained"
            disabled={!(roomName && name) || loading}
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} />
                <Typography>Creating...</Typography>
              </Box>
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
