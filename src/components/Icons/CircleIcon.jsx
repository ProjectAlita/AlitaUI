import { useTheme } from '@emotion/react';
import SvgIcon from "@mui/material/SvgIcon";

export default function CircleIcon(props) {
  const theme = useTheme();
  return (
    <SvgIcon {...props}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill={props.fill || theme.palette.icon.fill.default}/>
      </svg>
    </SvgIcon>
  );
}
