import BasicAccordion, { AccordionShowMode } from "@/components/BasicAccordion";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import ToolCard from "./ToolCard";
import ToolMenu from "./ToolMenu";
import { ToolInitialValues } from "./consts";

export default function ApplicationTools({ style, setIndexOfEditingTool }) {
  const { setFieldValue, values } = useFormikContext();
  const tools = useMemo(() => (values?.tools || []), [values?.tools])
  const onAddTool = useCallback((toolType) => () => {
    const updatedTools = [
      ...(values.tools || []),
      ToolInitialValues[toolType],
    ]
    setFieldValue('tools', updatedTools)
    setIndexOfEditingTool(updatedTools.length - 1);
  }, [setFieldValue, setIndexOfEditingTool, values.tools])

  const onDelete = useCallback(index => () => {
    setFieldValue('tools',
      values.filter((_, i) => i !== index))
  }, [setFieldValue, values]);

  const goEdit = useCallback(index => () => {
    setIndexOfEditingTool(index)
  }, [setIndexOfEditingTool]);

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
                <ToolCard key={index} data={tool} index={index} goEdit={goEdit} onDelete={onDelete} />
              ))}
              <ToolMenu onAddTool={onAddTool} />
            </Box>
          ),
        },
      ]} />
  )
}