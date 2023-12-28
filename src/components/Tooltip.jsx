import { Tooltip, tooltipClasses } from "@mui/material";
import { typographyVariants } from "@/MainTheme";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.tooltip.default,
    color: theme.palette.text.button.primary,
    ...typographyVariants.labelSmall,
  },
}));

export default StyledTooltip;