import { useTheme } from '@emotion/react';
import SvgIcon from "@mui/material/SvgIcon";

export default function CheckedIcon(props) {
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
        <g clipPath="url(#clip0_1319_25257)">
          <path d="M11.8593 2.35396L4.17968 10.3534C4.1351 10.3999 4.08217 10.4367 4.0239 10.4619C3.96563 10.4871 3.90317 10.5 3.8401 10.5C3.77702 10.5 3.71456 10.4871 3.65629 10.4619C3.59802 10.4367 3.54509 10.3999 3.50051 10.3534L0.140661 6.85363C0.0505971 6.75982 0 6.63258 0 6.49991C0 6.36723 0.0505971 6.23999 0.140661 6.14618C0.230724 6.05237 0.352876 5.99966 0.480245 5.99966C0.607615 5.99966 0.729767 6.05237 0.81983 6.14618L3.8401 9.29282L11.1802 1.64652C11.2702 1.5527 11.3924 1.5 11.5198 1.5C11.6471 1.5 11.7693 1.5527 11.8593 1.64652C11.9494 1.74033 12 1.86757 12 2.00024C12 2.13291 11.9494 2.26015 11.8593 2.35396Z"
            fill={props.fill || theme.palette.icon.fill.default} />
        </g>
        <defs>
          <clipPath id="clip0_1319_25257">
            <rect width="12" height="12"
              fill={props.fill || theme.palette.icon.fill.default} />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
