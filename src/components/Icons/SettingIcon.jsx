import { useTheme } from '@emotion/react';
import { SvgIcon } from "@mui/material";

const SettingIcon = (props) => {
  const theme = useTheme();
  return (
    <SvgIcon viewBox="0 0 16 16" {...props}>
      <path 
      d="M8.00059 5.00057C7.40729 5.00057 6.82731 5.17648 6.334 5.50605C5.84069 5.83563 5.4562 6.30407 5.22915 6.85213C5.00211 7.4002 4.9427 8.00328 5.05845 8.5851C5.17419 9.16692 5.4599 9.70136 5.87942 10.1208C6.29895 10.5403 6.83346 10.826 7.41536 10.9417C7.99726 11.0574 8.60042 10.998 9.14856 10.771C9.6967 10.544 10.1652 10.1596 10.4948 9.66632C10.8244 9.17307 11.0004 8.59317 11.0004 7.99995C10.9995 7.20472 10.6832 6.44229 10.1208 5.87998C9.55846 5.31767 8.79593 5.00139 8.00059 5.00057ZM8.00059 9.99953C7.60506 9.99953 7.21841 9.88226 6.88953 9.66254C6.56066 9.44283 6.30433 9.13053 6.15297 8.76516C6.0016 8.39978 5.962 7.99773 6.03916 7.60985C6.11633 7.22197 6.30679 6.86567 6.58648 6.58603C6.86616 6.30638 7.22251 6.11594 7.61044 6.03878C7.99837 5.96163 8.40048 6.00123 8.7659 6.15257C9.13133 6.30391 9.44366 6.56021 9.66341 6.88904C9.88316 7.21787 10.0004 7.60447 10.0004 7.99995C10.0004 8.53027 9.78975 9.03887 9.4147 9.41387C9.03966 9.78886 8.53099 9.99953 8.00059 9.99953ZM14.8713 6.70084C14.8574 6.63045 14.8285 6.56387 14.7866 6.50565C14.7446 6.44742 14.6906 6.39891 14.6282 6.36341L12.764 5.30113L12.7565 3.20031C12.7563 3.12796 12.7403 3.05652 12.7098 2.99093C12.6793 2.92533 12.6349 2.86715 12.5796 2.82039C11.9034 2.24845 11.1246 1.81014 10.2848 1.52878C10.2187 1.5064 10.1486 1.49812 10.079 1.50447C10.0095 1.51082 9.94207 1.53166 9.88108 1.56565L8.00059 2.61668L6.11823 1.56378C6.0572 1.52959 5.98968 1.50859 5.92003 1.50214C5.85038 1.49568 5.78015 1.5039 5.71388 1.52628C4.87466 1.8097 4.0968 2.24968 3.42155 2.82289C3.36641 2.86958 3.32204 2.92766 3.29151 2.99314C3.26098 3.05862 3.245 3.12994 3.24468 3.20219L3.23531 5.30488L1.37107 6.36716C1.3087 6.40266 1.25471 6.45117 1.21276 6.5094C1.17081 6.56762 1.14189 6.6342 1.12796 6.70459C0.957346 7.56184 0.957346 8.4443 1.12796 9.30155C1.14189 9.37195 1.17081 9.43852 1.21276 9.49675C1.25471 9.55497 1.3087 9.60348 1.37107 9.63898L3.23531 10.7013L3.24281 12.8021C3.24304 12.8744 3.25897 12.9459 3.2895 13.0115C3.32004 13.0771 3.36445 13.1352 3.41967 13.182C4.09592 13.7539 4.87466 14.1923 5.71451 14.4736C5.78064 14.496 5.85074 14.5043 5.92027 14.4979C5.98981 14.4916 6.05724 14.4707 6.11823 14.4367L8.00059 13.3832L9.88296 14.4361C9.95745 14.4776 10.0414 14.4991 10.1267 14.4986C10.1813 14.4986 10.2355 14.4897 10.2873 14.4724C11.1264 14.1893 11.9043 13.7498 12.5796 13.177C12.6348 13.1303 12.6791 13.0722 12.7097 13.0068C12.7402 12.9413 12.7562 12.87 12.7565 12.7977L12.7659 10.695L14.6301 9.63274C14.6925 9.59723 14.7465 9.54872 14.7884 9.4905C14.8304 9.43227 14.8593 9.3657 14.8732 9.29531C15.0429 8.43874 15.0423 7.55716 14.8713 6.70084ZM13.9339 8.88227L12.1484 9.89768C12.0702 9.94216 12.0054 10.0069 11.9609 10.0851C11.9247 10.1476 11.8866 10.2139 11.8478 10.2764C11.7982 10.3552 11.7718 10.4463 11.7716 10.5394L11.7622 12.5546C11.2823 12.9315 10.7476 13.2328 10.1767 13.4482L8.37556 12.4447C8.30079 12.4033 8.21666 12.3818 8.13121 12.3822H8.11933C8.04371 12.3822 7.96747 12.3822 7.89185 12.3822C7.80241 12.3799 7.71398 12.4015 7.63562 12.4447L5.83325 13.4507C5.26111 13.2369 4.72497 12.9371 4.24336 12.5615L4.23649 10.5494C4.23618 10.4561 4.20977 10.3648 4.16024 10.2857C4.1215 10.2232 4.08337 10.1608 4.04775 10.0945C4.00358 10.0151 3.93881 9.94903 3.86026 9.90331L2.07289 8.88539C1.9804 8.30039 1.9804 7.7045 2.07289 7.1195L3.85526 6.10221C3.9335 6.05774 3.99827 5.99297 4.04275 5.91475C4.079 5.85227 4.11712 5.78603 4.15587 5.72354C4.20547 5.64474 4.23189 5.55358 4.23211 5.46047L4.24149 3.44526C4.72141 3.06843 5.25608 2.7671 5.827 2.5517L7.62562 3.55524C7.7039 3.59863 7.79239 3.62021 7.88185 3.61773C7.95747 3.61773 8.03371 3.61773 8.10933 3.61773C8.19877 3.61996 8.2872 3.5984 8.36557 3.55524L10.1679 2.5492C10.7401 2.76295 11.2762 3.0628 11.7578 3.43839L11.7647 5.45047C11.765 5.54376 11.7914 5.63511 11.8409 5.71417C11.8797 5.77666 11.9178 5.83914 11.9534 5.90538C11.9976 5.98481 12.0624 6.05086 12.1409 6.09659L13.9283 7.11451C14.022 7.69995 14.0231 8.29649 13.9314 8.88227H13.9339Z"
      fill={props.fill || theme.palette.icon.fill.secondary}
      />
    </SvgIcon>
  )
}

export default SettingIcon;