'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

export function JoinDialog({ children }) {
  const router = useRouter();

  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setRoomName('');
    setLoading(false);
    setOpen(false);
  };

  const handleJoin = () => {
    setLoading(true);
    router.push(`/watch/${roomName}`);
  };

  return (
    <>
      <Box onClick={handleOpen}>{children}</Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Join Existing Stream</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Room Name"
            placeholder="abcd-1234"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleJoin}
            disabled={!roomName || loading}
            variant="contained"
            color="primary"
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ marginRight: 1 }} />
                Joining...
              </>
            ) : (
              'Join'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
