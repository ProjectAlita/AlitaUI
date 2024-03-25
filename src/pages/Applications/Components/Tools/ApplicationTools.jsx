import BasicAccordion, { AccordionShowMode } from "@/components/BasicAccordion";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import ToolCard from "./ToolCard";
import ToolMenu from "./ToolMenu";
import { ToolInitialValues } from "./consts";

export default function ApplicationTools({ style, setEditToolDetail }) {
  const { setFieldValue, values } = useFormikContext();
  const tools = useMemo(() => (values?.tools || []), [values?.tools])
  const onAddTool = useCallback((toolType) => () => {
    setEditToolDetail({
      ...ToolInitialValues[toolType],
      index: tools.length
    });
  }, [setEditToolDetail, tools.length])

  const onDelete = useCallback(index => () => {
    setFieldValue('tools',
      tools.filter((_, i) => i !== index))
  }, [setFieldValue, tools]);

  const onEditTool = useCallback(index => () => {
    setEditToolDetail({
      ...tools[index],
      index
    })
  }, [setEditToolDetail, tools]);

  return (
    <BasicAccordion
      style={style}
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'Tools',
          content: (
            <Box display='flex' flexDirection='column' gap={2}>
              {tools.map((tool, index) => (
                <ToolCard key={index} tool={tool} index={index} onEdit={onEditTool} onDelete={onDelete} />
              ))}
              <ToolMenu onAddTool={onAddTool} />
            </Box>
          ),
        },
      ]} />
  )
}