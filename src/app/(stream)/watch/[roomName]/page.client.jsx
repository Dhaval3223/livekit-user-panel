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
        const {
          auth_token,
          // connection_details: { token },
        } = res.data; // Use res.data instead of await res.json()

        setAuthToken(
          'eyJhbGciOiJIUzI1NiJ9.eyJyb29tX25hbWUiOiJJbmQlMjB2cyUyMHdkIiwiaWRlbnRpdHkiOiJ0ZXN0In0.S4tw4Rx7I_zzUe3c9fe9Y2q6UPDFR8EYV5mBxkDI5fI'
        );
        setRoomToken(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tIjoiSW5kJTIwdnMlMjB3ZCIsInJvb21Kb2luIjp0cnVlLCJjYW5QdWJsaXNoIjpmYWxzZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZX0sImlhdCI6MTczNzg4MjU5MywibmJmIjoxNzM3ODgyNTkzLCJleHAiOjE3Mzc5MDQxOTMsImlzcyI6IkFQSVVrNGdEa3RDa25zeiIsInN1YiI6InRlc3QiLCJqdGkiOiJ0ZXN0In0.7oOix-NqntQ9JJyJlCkog0fQKoYS-IrTOqldPBkrD2U'
        );
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
