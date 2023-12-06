import { useTheme } from '@emotion/react';

export default function PlusIcon(props) {
  const theme = useTheme();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width='16' height='16' viewBox="0 0 16 16" 
      fill={theme.palette.icon.fill.primary}  
      {...props}
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M8.5 3.86377C8.5 3.58763 8.27614 3.36377 8 3.36377C7.72386 3.36377 7.5 3.58763 7.5 3.86377V7.86377H3.5C3.22386 7.86377 3 8.08763 3 8.36377C3 8.63991 3.22386 8.86377 3.5 8.86377H7.5V12.8638C7.5 13.1399 7.72386 13.3638 8 13.3638C8.27614 13.3638 8.5 13.1399 8.5 12.8638V8.86377H12.5C12.7761 8.86377 13 8.63991 13 8.36377C13 8.08763 12.7761 7.86377 12.5 7.86377H8.5V3.86377Z"
      />
    </svg>
  );
}
