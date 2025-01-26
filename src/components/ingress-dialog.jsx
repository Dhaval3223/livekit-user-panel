import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

import {
  Box,
  Radio,
  Button,
  Dialog,
  Switch,
  TextField,
  Typography,
  RadioGroup,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';

import { AllowParticipationInfo } from './allow-participation-info';

export function IngressDialog({ children }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('rtmp');
  const [enableChat, setEnableChat] = useState(true);
  const [allowParticipation, setAllowParticipation] = useState(true);
  const [ingressResponse, setIngressResponse] = useState(null);

  const onCreateIngress = async () => {
    setLoading(true);
    const res = await fetch('/api/create_ingress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_name: roomName,
        ingress_type: type,
        metadata: {
          creator_identity: name,
          enable_chat: enableChat,
          allow_participation: allowParticipation,
        },
      }),
    });

    setIngressResponse(await res.json());
    setLoading(false);
  };

  const handleCancel = () => {
    setRoomName('');
    setName('');
    setType('rtmp');
    setEnableChat(true);
    setAllowParticipation(true);
    setIngressResponse(null);
  };

  return (
    <Dialog open={Boolean(children)} onClose={handleCancel} maxWidth="sm" fullWidth>
      {ingressResponse ? (
        <>
          <DialogTitle>Start Streaming Now</DialogTitle>
          <DialogContent>
            <Typography>
              Copy these values into your OBS settings under <b>Stream</b> → <b>Service</b> →{' '}
              <b>{type === 'whip' ? 'WHIP' : 'Custom'}</b>. When ready, press &quot;Start
              Streaming&quot; to begin.
            </Typography>
            <Box mt={2}>
              <TextField
                label="Server URL"
                value={ingressResponse.ingress.url}
                fullWidth
                InputProps={{ readOnly: true }}
                margin="normal"
              />
              <TextField
                label="Stream Key"
                value={ingressResponse.ingress.streamKey}
                fullWidth
                InputProps={{ readOnly: true }}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                router.push(
                  `/watch?at=${ingressResponse.auth_token}&rt=${ingressResponse.connection_details.token}`
                )
              }
              endIcon={<Icon icon="ion:arrow-forward" />}
            >
              Join as Viewer
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>Setup Ingress Endpoint</DialogTitle>
          <DialogContent>
            <TextField
              label="Room Name"
              placeholder="abcd-1234"
              fullWidth
              margin="normal"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <TextField
              label="Your Name"
              placeholder="Roger Dunn"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Ingress Type
              </Typography>
              <RadioGroup value={type} onChange={(e) => setType(e.target.value)} row>
                <FormControlLabel value="rtmp" control={<Radio />} label="RTMP" />
                <FormControlLabel value="whip" control={<Radio />} label="WHIP" />
              </RadioGroup>
            </Box>
            <Box mt={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography>Enable Chat</Typography>
                <Switch checked={enableChat} onChange={(e) => setEnableChat(e.target.checked)} />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Box display="flex" alignItems="center">
                  <Typography>Viewers Can Participate</Typography>
                  <AllowParticipationInfo />
                </Box>
                <Switch
                  checked={allowParticipation}
                  onChange={(e) => setAllowParticipation(e.target.checked)}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={onCreateIngress}
              color="primary"
              disabled={!(roomName && name && type) || loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
