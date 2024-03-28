import DotMenu from "@/components/DotMenu";
import PlusIcon from "@/components/Icons/PlusIcon";
import { useTheme } from "@mui/material";
import { useMemo } from "react";
import { ToolTypes } from "./consts";
import DatabaseIcon from "@/components/Icons/DatabaseIcon";
import FileCodeIcon from '@/components/Icons/FileCodeIcon';
import JsonIcon from '@/components/Icons/JsonIcon';

export default function ToolMenu({
  onAddTool,
}) {
  const theme = useTheme();
  const menuItems = useMemo(() => {
    const items = [
      {
        label: ToolTypes.datasource.label,
        icon: <DatabaseIcon sx={{ fontSize: '1.13rem' }} />,
        onClick: onAddTool(ToolTypes.datasource.value),
      },
      {
        label: ToolTypes.open_api.label,
        icon: <FileCodeIcon sx={{ fontSize: '1.13rem' }} />,
        onClick: onAddTool(ToolTypes.open_api.value),
      },
      {
        label: ToolTypes.custom.label,
        icon: <JsonIcon sx={{ fontSize: '1.13rem' }} />,
        onClick: onAddTool(ToolTypes.custom.value),
      }
    ]
    return items
  }, [onAddTool]);

  return (
    <>
      <DotMenu
        id='application-tools-menu'
        menuIcon={<PlusIcon fill={theme.palette.icon.fill.secondary} />}
        menuIconSX={{ background: theme.palette.background.icon.default }}
      >
        {menuItems}
      </DotMenu>
    </>
  )
}