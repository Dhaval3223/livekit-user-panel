'use client';

import React, { useState, useEffect } from 'react';

import { Menu, Icon, Stack, Button, MenuItem, IconButton } from '@mui/material';

export function MediaDeviceSettings({ localParticipant, roomState }) {
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  const [micAnchorEl, setMicAnchorEl] = useState(null);
  const [camAnchorEl, setCamAnchorEl] = useState(null);

  const [microphoneDevices, setMicrophoneDevices] = useState([]);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [activeMicrophoneDeviceId, setActiveMicrophoneDeviceId] = useState(null);
  const [activeCameraDeviceId, setActiveCameraDeviceId] = useState(null);

  // Simulate device selection (you'll replace this with actual LiveKit device selection logic)
  useEffect(() => {
    async function fetchDevices() {
      try {
        const mics = await navigator.mediaDevices.enumerateDevices();
        const cameras = await navigator.mediaDevices.enumerateDevices();

        const micInputDevices = mics.filter((device) => device.kind === 'audioinput');
        const cameraInputDevices = cameras.filter((device) => device.kind === 'videoinput');

        setMicrophoneDevices(micInputDevices);
        setCameraDevices(cameraInputDevices);

        // Set first device as active by default
        if (micInputDevices.length > 0) {
          setActiveMicrophoneDeviceId(micInputDevices[0].deviceId);
        }
        if (cameraInputDevices.length > 0) {
          setActiveCameraDeviceId(cameraInputDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error fetching devices', error);
      }
    }

    fetchDevices();
  }, []);

  useEffect(() => {
    if (roomState === 'connected') {
      localParticipant?.setMicrophoneEnabled(micEnabled);
      localParticipant?.setCameraEnabled(camEnabled);
    }
  }, [micEnabled, camEnabled, localParticipant, roomState]);

  const handleMicToggle = () => {
    setMicEnabled(!micEnabled);
  };

  const handleCamToggle = () => {
    setCamEnabled(!camEnabled);
  };

  const handleMicDeviceSelect = (deviceId) => {
    setActiveMicrophoneDeviceId(deviceId);
    setMicAnchorEl(null);
    // Add actual device selection logic here
  };

  const handleCamDeviceSelect = (deviceId) => {
    setActiveCameraDeviceId(deviceId);
    setCamAnchorEl(null);
    // Add actual device selection logic here
  };

  return (
    <Stack spacing={2} direction="column">
      <Stack spacing={1} direction="row" alignItems="center">
        <Button
          variant={micEnabled ? 'contained' : 'outlined'}
          color={micEnabled ? 'primary' : 'error'}
          startIcon={micEnabled ? <Icon icon="ion:mic" /> : <Icon icon="ion:mic-off-sharp" />}
          onClick={handleMicToggle}
          size="small"
        >
          Mic {micEnabled ? 'On' : 'Off'}
        </Button>
        <IconButton
          disabled={!micEnabled}
          onClick={(e) => setMicAnchorEl(e.currentTarget)}
          size="small"
          color="primary"
        >
          <Icon icon="ion:arrow-down" />
        </IconButton>
        <Menu
          anchorEl={micAnchorEl}
          open={Boolean(micAnchorEl)}
          onClose={() => setMicAnchorEl(null)}
        >
          {microphoneDevices.map((device) => (
            <MenuItem
              key={device.deviceId}
              selected={device.deviceId === activeMicrophoneDeviceId}
              onClick={() => handleMicDeviceSelect(device.deviceId)}
            >
              {device.label || `Microphone ${device.deviceId}`}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      <Stack spacing={1} direction="row" alignItems="center">
        <Button
          variant={camEnabled ? 'contained' : 'outlined'}
          color={camEnabled ? 'primary' : 'error'}
          startIcon={camEnabled ? <Icon icon="ion:videocam" /> : <Icon icon="ion:videocam-off" />}
          onClick={handleCamToggle}
          size="small"
        >
          Cam {camEnabled ? 'On' : 'Off'}
        </Button>
        <IconButton
          disabled={!camEnabled}
          onClick={(e) => setCamAnchorEl(e.currentTarget)}
          size="small"
          color="primary"
        >
          <Icon icon="ion:arrow-down" />
        </IconButton>
        <Menu
          anchorEl={camAnchorEl}
          open={Boolean(camAnchorEl)}
          onClose={() => setCamAnchorEl(null)}
        >
          {cameraDevices.map((device) => (
            <MenuItem
              key={device.deviceId}
              selected={device.deviceId === activeCameraDeviceId}
              onClick={() => handleCamDeviceSelect(device.deviceId)}
            >
              {device.label || `Camera ${device.deviceId}`}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Stack>
  );
}
