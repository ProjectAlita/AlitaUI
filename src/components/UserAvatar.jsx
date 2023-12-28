import { Avatar, useTheme } from "@mui/material";

import { getInitials, stringToColor } from '@/common/utils';

export default function UserAvatar({ name, avatar, shiftPixels = 0, size = 20, onClick }) {
  const theme = useTheme();
  const commonStyle = {
    padding: '0',
    width: size + 'px',
    height: size + 'px',
    transform: `translateX(-${shiftPixels}px)`,
    backgroundColor: theme.palette.background.icon.default,
  };

  if (avatar) {
    return <Avatar onClick={onClick} style={commonStyle} src={avatar} alt={name} />;
  }

  const stringAvatarStyle = {
    ...commonStyle,
    backgroundColor: stringToColor(name || ''),
    color: 'white',
    fontSize: Math.ceil(size / 2) + 'px',
  };
  return (
    <Avatar onClick={onClick} style={stringAvatarStyle} alt={name}>
      {name ? getInitials(name) : null}
    </Avatar>

  );
}