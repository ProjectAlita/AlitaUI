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
  canEdit,
  datasetItems,
  datasourceId,
  datasourceVersionId,
  scrollToBottom,
  datasourceVersionUUID,
}) => {

  const theme = useTheme();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const onAdd = useCallback(() => {
    setShowCreateForm(true)
    setTimeout(() => scrollToBottom(), 500);
  }, [scrollToBottom]);

  const handleCancel = useCallback(() => {
    setShowCreateForm(false);
  }, [setShowCreateForm]);

  return (
    <BasicAccordion
      items={[
        {
          title: 'DataSets',
          content: (
            <Box display={"flex"} flexDirection={"column"} alignItems={"baseline"} gap={'16px'}>
              {
                datasetItems.length < 1 && (
                  canEdit ?
                    (!showCreateForm && <Typography variant='bodySmall'>
                      Still no datasets. Let’s create a first one
                    </Typography>) :
                    <Typography variant='bodySmall'>
                      No Content
                    </Typography>
                )
              }
              {
                datasetItems.map((item, index) =>
                  <ViewEditDataset key={index} data={item} datasourceVersionId={datasourceVersionId} datasourceVersionUUID={datasourceVersionUUID} />
                )
              }
              {canEdit && showCreateForm && <CreateDataset handleCancel={handleCancel} datasourceId={datasourceId} datasourceVersionId={datasourceVersionId} />}
              {canEdit && !showCreateForm && <PlusIconButton
                onClick={onAdd}
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