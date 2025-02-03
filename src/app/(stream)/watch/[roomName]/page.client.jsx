'use client';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { LiveKitRoom } from '@livekit/components-react';

import {
  Box,
  Card,
  Stack,
  Button,
  Avatar,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  CircularProgress,
} from '@mui/material';

import axiosInstance from 'src/lib/axios';

import { Chat } from 'src/components/chat';
import { TokenContext } from 'src/components/token-context';
import { StreamPlayer } from 'src/components/stream-player';

export default function WatchPage({ roomName, serverUrl }) {
  const [name, setName] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [roomToken, setRoomToken] = useState('');
  const [loading, setLoading] = useState(false);

  const onJoin = async () => {
    setLoading(true); // Start loading

    try {
      const res = await axiosInstance('/rooms/join-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
          roomId: roomName,
          // identity: name,
        }),
      });
      // Check if the response is successful
      if (res.status === 200) {
        const token = res.data.data.connection_details.token;
        const auth_token = res.data.data.auth_token;
        // const {
        //   auth_token,
        //   connection_details: { token },
        // } = res.data; // Use res.data instead of await res.json()
        setAuthToken(auth_token);
        setRoomToken(token);
      } else {
        console.error('Error joining room:', res.statusText);
        // Handle non-200 responses appropriately
      }
    } catch (error) {
      alert(error?.message);
      console.error('Error during join-room request:', error);
      // Optionally, set an error state or show a message to the user
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  // useEffect(() => {
  //   onJoin();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  if (!authToken || !roomToken) {
    return (
      <Stack justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
        <Card sx={{ width: 380, p: 2 }}>
          <CardHeader
            title={`Entering ${decodeURI(roomName)}`}
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Your name
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Roger Dunn"
              InputProps={{
                startAdornment: (
                  <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                    {name ? name[0] : <Icon icon="mdi:person" />}
                  </Avatar>
                ),
              }}
            />
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                disabled={!name || loading}
                onClick={onJoin}
                endIcon={loading ? <CircularProgress size={20} /> : <Icon icon="mdi:arrow-right" />}
              >
                {loading ? 'Joining...' : 'Join as viewer'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  return (
    <TokenContext.Provider value={authToken}>
      <LiveKitRoom serverUrl={serverUrl} token={roomToken}>
        <Stack direction="row" sx={{ width: '100%', height: '100vh' }}>
          <Stack direction="column" sx={{ flex: 1 }}>
            <Box
              sx={{
                flex: 1,
                backgroundColor: 'background.default',
              }}
            >
              <StreamPlayer />
            </Box>
            {/* <ReactionBar /> */}
          </Stack>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              minWidth: 280,
              borderLeft: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Chat />
          </Box>
        </Stack>
      </LiveKitRoom>
    </TokenContext.Provider>
  );
}
