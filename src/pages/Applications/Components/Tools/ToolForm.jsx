import { Box } from "@mui/material";
import { useCallback, useMemo } from "react";
import ToolDatasource from "./ToolDatasource";
import { ToolTypes } from "./consts";
import { useFormikContext } from "formik";
import ToolOpenAPI from './ToolOpenAPI';
import ToolCustom from './ToolCustom';

export default function ToolForm({
  editToolDetail,
  setEditToolDetail,
}) {
  const toolType = useMemo(() => editToolDetail?.type, [editToolDetail])
  const { setFieldValue } = useFormikContext();
  const handleGoBack = useCallback((option = {}) => {
    const { saveChanges = true } = option;
    const { index, ...toolDetail } = editToolDetail;
    if (saveChanges) {
      setFieldValue(`tools[${index}]`, toolDetail)
    }
    setEditToolDetail(null);
  }, [editToolDetail, setEditToolDetail, setFieldValue]);
  return (
    <Box sx={{ padding: '12px 12px 12px 24px' }}>
      {toolType === ToolTypes.datasource.value &&
        <ToolDatasource
          editToolDetail={editToolDetail}
          setEditToolDetail={setEditToolDetail}
          handleGoBack={handleGoBack} />}
      {toolType === ToolTypes.open_api.value &&
        <ToolOpenAPI
          editToolDetail={editToolDetail}
          setEditToolDetail={setEditToolDetail}
          handleGoBack={handleGoBack} />}
      {toolType === ToolTypes.custom.value &&
        <ToolCustom
          editToolDetail={editToolDetail}
          setEditToolDetail={setEditToolDetail}
          handleGoBack={handleGoBack} />}
    </Box>
  )
}