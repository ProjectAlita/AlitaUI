import { useTheme } from '@emotion/react';
import SvgIcon from '@mui/material/SvgIcon';

export default function FolderIcon(props) {
  const theme = useTheme();
  return (
    <SvgIcon {...props}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
      >
        <path d="M13.5 4.07143L8.16687 4.07143L6.43313 2.70952C6.25978 2.57402 6.04941 2.50056 5.83313 2.5L2.5 2.5C2.23478 2.5 1.98043 2.61037 1.79289 2.80684C1.60536 3.00331 1.5 3.26977 1.5 3.54762L1.5 12.4524C1.5 12.7302 1.60536 12.9967 1.79289 13.1932C1.98043 13.3896 2.23478 13.5 2.5 13.5H13.5556C13.806 13.4997 14.046 13.3953 14.223 13.2098C14.4001 13.0244 14.4997 12.7729 14.5 12.5107V5.11905C14.5 4.8412 14.3946 4.57474 14.2071 4.37827C14.0196 4.1818 13.7652 4.07143 13.5 4.07143ZM13.5 12.4524H2.5L2.5 3.54762H5.83313L7.56687 4.90952C7.74022 5.04502 7.95059 5.11849 8.16687 5.11905L13.5 5.11905V12.4524Z"
          fill={props.fill || theme.palette.icon.fill.default}
        />
      </svg>
    </SvgIcon>
  );
}
