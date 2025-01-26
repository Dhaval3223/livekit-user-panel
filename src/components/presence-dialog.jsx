'use client';

import React from 'react';
import { Icon } from '@iconify/react';
// import closeIcon from '@iconify/icons-mdi/close';
// import personIcon from '@iconify/icons-mdi/account';
import { useRoomContext, useParticipants, useLocalParticipant } from '@livekit/components-react';

import {
  Box,
  Stack,
  Avatar,
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { useAuthToken } from './token-context';

function ParticipantListItem({ participant, isCurrentUser, isHost = false }) {
  const [authToken] = useAuthToken();
  const participantMetadata = participant.metadata ? JSON.parse(participant.metadata) : {};
  const room = useRoomContext();
  const roomMetadata = room.metadata ? JSON.parse(room.metadata) : {};

  const onInvite = async () => {
    await fetch('/api/invite_to_stage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${authToken}`,
      },
      body: JSON.stringify({
        identity: participant.identity,
      }),
    });
  };

  const onRaiseHand = async () => {
    await fetch('/api/raise_hand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${authToken}`,
      },
    });
  };

  const onCancel = async () => {
    await fetch('/api/remove_from_stage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${authToken}`,
      },
      body: JSON.stringify({
        identity: participant.identity,
      }),
    });
  };

  const HostActions = () => {
    if (isCurrentUser) return null;

    if (participantMetadata.invited_to_stage && participantMetadata.hand_raised) {
      return (
        <Button size="small" variant="outlined" onClick={onCancel}>
          Remove
        </Button>
      );
    }

    if (participantMetadata.hand_raised) {
      return (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={onInvite}>
            Accept
          </Button>
          <Button size="small" variant="outlined" onClick={onCancel}>
            Reject
          </Button>
        </Stack>
      );
    }

    if (participantMetadata.invited_to_stage) {
      return (
        <Button size="small" variant="outlined" disabled>
          Pending
        </Button>
      );
    }

    return (
      <Button size="small" onClick={onInvite}>
        Invite to stage
      </Button>
    );
  };

  const ViewerActions = () => {
    if (!isCurrentUser) return null;

    if (participantMetadata.invited_to_stage && participantMetadata.hand_raised) {
      return (
        <Button size="small" onClick={onCancel}>
          Leave stage
        </Button>
      );
    }

    if (participantMetadata.invited_to_stage && !participantMetadata.hand_raised) {
      return (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={onRaiseHand}>
            Accept
          </Button>
          <Button size="small" variant="outlined" onClick={onCancel}>
            Reject
          </Button>
        </Stack>
      );
    }

    if (!participantMetadata.invited_to_stage && participantMetadata.hand_raised) {
      return (
        <Button size="small" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      );
    }

    return (
      <Button size="small" onClick={onRaiseHand}>
        Raise hand
      </Button>
    );
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar sx={{ width: 32, height: 32 }} src={participant.identity[0]}>
          <Icon icon="line-md:person" />
        </Avatar>
        <Typography color={isCurrentUser ? 'primary' : 'inherit'} variant="body2">
          {participant.identity}
          {isCurrentUser && ' (you)'}
        </Typography>
      </Stack>
      {isHost && roomMetadata.allow_participation ? <HostActions /> : <ViewerActions />}
    </Box>
  );
}

export function PresenceDialog({ children, isHost = false }) {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const hosts = participants.filter((participant) => participant.permissions?.canPublish ?? false);
  const viewers = participants.filter(
    (participant) => participant.permissions?.canPublish === false
  );

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={false} // Replace with your state management
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Who&apos;s here
          <IconButton
            onClick={() => {
              /* Handle close */
            }}
          >
            <Icon icon="line-md:close" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {hosts.length > 0 && (
            <Stack spacing={1}>
              <Typography variant="overline" color="textSecondary">
                {hosts.length > 1 ? 'Co-Hosts' : 'Host'}
              </Typography>
              {hosts.map((participant) => (
                <ParticipantListItem
                  key={participant.identity}
                  participant={participant}
                  isCurrentUser={participant.identity === localParticipant.identity}
                  isHost={isHost}
                />
              ))}
            </Stack>
          )}
          {viewers.length > 0 && (
            <Stack spacing={1}>
              <Typography variant="overline" color="textSecondary">
                Viewers
              </Typography>
              {viewers.map((participant) => (
                <ParticipantListItem
                  key={participant.identity}
                  participant={participant}
                  isCurrentUser={participant.identity === localParticipant.identity}
                  isHost={isHost}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
