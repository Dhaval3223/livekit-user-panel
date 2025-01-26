import { Icon } from '@iconify/react';
// import SendIcon from '@iconify/icons-mdi/send';
import React, { useMemo, useState } from 'react';

// import PersonIcon from '@mui/icons-material/Person';
import { Box, Grid, Avatar, TextField, Typography, IconButton } from '@mui/material';

function ChatMessage({ message, localParticipant }) {
  return (
    <Grid
      container
      spacing={2}
      alignItems="flex-start"
      style={{ wordBreak: 'break-word', width: '220px' }}
    >
      <Grid item>
        <Avatar>{message.from?.identity?.[0] || <Icon icon="ion:person" />}</Avatar>
      </Grid>
      <Grid item xs>
        <Typography
          variant="subtitle2"
          color={localParticipant.identity === message.from?.identity ? 'primary' : 'textSecondary'}
        >
          {message.from?.identity || 'Unknown'}
        </Typography>
        <Typography variant="body2">{message.message}</Typography>
      </Grid>
    </Grid>
  );
}

export function Chat({ chatMessages, send, localParticipant, metadata }) {
  const [draft, setDraft] = useState('');

  const { enable_chat: chatEnabled } = metadata ? JSON.parse(metadata) : {};

  const messages = useMemo(() => {
    const timestamps = chatMessages?.map((msg) => msg.timestamp);
    return chatMessages?.filter((msg, i) => !timestamps.includes(msg.timestamp, i + 1));
  }, [chatMessages]);

  const onSend = async () => {
    if (draft.trim() && send) {
      setDraft('');
      await send(draft);
    }
  };

  return (
    <Grid container direction="column" style={{ height: '100%' }}>
      <Box textAlign="center" py={2} borderBottom={1} borderColor="divider">
        <Typography variant="h6" color="primary">
          Live Chat
        </Typography>
      </Box>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}
        spacing={2}
      >
        {messages?.map((msg) => (
          <ChatMessage key={msg.timestamp} message={msg} localParticipant={localParticipant} />
        ))}
      </Grid>
      <Box py={2} px={4} mt={2} borderTop={1} borderColor="divider">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!chatEnabled}
              placeholder={chatEnabled ? 'Say something...' : 'Chat is disabled'}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSend();
                }
              }}
            />
          </Grid>
          <Grid item>
            <IconButton onClick={onSend} disabled={!draft.trim()} color="primary">
              <Icon icon="ion:send-sharp" />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}
