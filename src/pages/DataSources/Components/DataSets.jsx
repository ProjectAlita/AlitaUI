/* eslint-disable */
import BasicAccordion from "@/components/BasicAccordion";
// import PlusIcon from "@/components/Icons/PlusIcon";
import {actions as dataSourceActions} from '@/slices/datasources';
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {CreateDataset, EditDataset, ViewDataset} from "./DataSet";
import AddIcon from '@mui/icons-material/Add';

// const PlusIconButton = styled(IconButton)(({ theme }) => ({
//   display: 'flex',
//   width: '28px',
//   padding: '6px',
//   alignItems: 'center',
//   borderRadius: '28px',
//   background: theme.palette.background.button.primary.default,
//   ':hover': {
//     background: theme.palette.background.button.primary.default,
//   }
// }));


const DataSets = ({datasetItems}) => {
  const [showAdd, setShowAdd] = useState(true)


  return (
    <BasicAccordion
      items={[
        {
          title: 'DataSets',
          content: (
            <Box display={"flex"} flexDirection={"column"} alignItems={"baseline"} gap={'16px'}>
              {
                !showAdd && datasetItems.length < 1 &&
                <Typography variant='bodySmall'>
                  Still no datasets. Let’s create a first one
                </Typography>
              }
              {
                datasetItems.map((item, index) =>
                  <ViewDataset key={index} data={item}/>
                )
              }
              {!showAdd && <CreateDataset handleCancel={() => setShowAdd(true)}/>}
              {showAdd && <IconButton
                onClick={() => setShowAdd(prevState => !prevState)}
                color={"primary"}
              >
                <AddIcon/>
              </IconButton>}
            </Box>
          )
        }

      ]}
    />
  )
}

export default DataSets