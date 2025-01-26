'use client';

import React from 'react';

import { Box, Button, Tooltip } from '@mui/material';
import { useChat, useDataChannel } from '@livekit/components-react';
import { DataPacket_Kind } from 'livekit-client';

export function ReactionBar() {
  const [encoder] = React.useState(() => new TextEncoder());
  const { send } = useDataChannel('reactions');
  const { send: sendChat } = useChat();

  const onSend = (emoji) => {
    send(encoder.encode(emoji), { kind: DataPacket_Kind.LOSSY });
    if (sendChat) {
      sendChat(emoji);
    }
  };

  return (
    <Box
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default',
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {[
        { emoji: '🔥', title: 'Fire' },
        { emoji: '👏', title: 'Applause' },
        { emoji: '🤣', title: 'LOL' },
        { emoji: '❤️', title: 'Love' },
        { emoji: '🎉', title: 'Confetti' },
      ].map(({ emoji, title }) => (
        <Tooltip key={emoji} title={title}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => onSend(emoji)}
            sx={{ fontSize: '2rem' }}
          >
            {emoji}
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
}
