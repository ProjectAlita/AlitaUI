import { useTheme } from '@emotion/react';

export default function CheckBoxOutlinedIcon(props) {
  const theme = useTheme();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width='20' height='20' viewBox="0 0 20 20"
      fill={theme.palette.icon.fill.primary}
      {...props}
    >
      <path d="M15.8333 4.16667V15.8333H4.16667V4.16667H15.8333ZM15.8333 2.5H4.16667C3.25 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.25 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V4.16667C17.5 3.25 16.75 2.5 15.8333 2.5Z" />
    </svg>
  );
}
