'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import { Popover, IconButton, Typography } from '@mui/material';

export function AllowParticipationInfo() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'allow-participation-popover' : undefined;

  return (
    <div>
      <IconButton size="small" color="default" onClick={handleClick} aria-describedby={id}>
        <Icon icon="mdi:information-outline" fontSize={20} />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Typography variant="body2" sx={{ padding: 2, maxWidth: 360 }}>
          If enabled, viewers can <strong>raise their hand</strong>. When accepted by the host, they
          can share their audio and video. The host can also <strong>invite</strong> viewers to
          share their audio and video.
        </Typography>
      </Popover>
    </div>
  );
}
