import { Tooltip, tooltipClasses } from "@mui/material";
import { typographyVariants } from "@/MainTheme";
import { filterProps } from "@/common/utils";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
), filterProps('extraStyles'))(({ theme, extraStyles }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.tooltip.default,
    color: theme.palette.text.button.primary,
    ...typographyVariants.labelSmall,
    ...extraStyles,
  },
}));

export default StyledTooltip;