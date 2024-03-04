import BasicAccordion from "@/components/BasicAccordion";
import PlusIcon from "@/components/Icons/PlusIcon";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { CreateDataset, ViewEditDataset } from "./DataSet";

const PlusIconButton = styled(IconButton)(({ theme }) => ({
  display: 'flex',
  width: '28px',
  padding: '6px',
  alignItems: 'center',
  borderRadius: '28px',
  background: theme.palette.background.button.primary.default,
  ':hover': {
    background: theme.palette.background.button.primary.default,
  }
}));


const DataSets = ({
  datasetItems,
  datasourceId,
  datasourceVersionId,
  scrollToBottom,
}) => {
  
  const theme = useTheme();
  const [showAdd, setShowAdd] = useState(true);

  const showCreateForm = useCallback(() => {
    setShowAdd(false)
    setTimeout(() => scrollToBottom(), 500);
  }, [scrollToBottom]);

  const handleCancel = useCallback(() => {
    setShowAdd(true);
  }, [setShowAdd]);

  return (
    <BasicAccordion
      items={[
        {
          title: 'DataSets',
          content: (
            <Box display={"flex"} flexDirection={"column"} alignItems={"baseline"} gap={'16px'}>
              {
                showAdd && datasetItems.length < 1 &&
                <Typography variant='bodySmall'>
                  Still no datasets. Let’s create a first one
                </Typography>
              }
              {
                datasetItems.map((item, index) =>
                  <ViewEditDataset key={index} data={item} datasourceVersionId={datasourceVersionId} />
                )
              }
              {!showAdd && <CreateDataset handleCancel={handleCancel} datasourceId={datasourceId} datasourceVersionId={datasourceVersionId}/>}
              {showAdd && <PlusIconButton
                onClick={showCreateForm}
                color={"primary"}
              >
                <PlusIcon fill={theme.palette.icon.fill.send} />
              </PlusIconButton>}
            </Box>
          )
        }

      ]}
    />
  )
}

export default DataSets