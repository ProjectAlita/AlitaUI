import BasicAccordion from "@/components/BasicAccordion";
import PlusIcon from "@/components/Icons/PlusIcon";
import { actions as dataSourceActions } from '@/slices/datasources';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataSet from "./DataSet";

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


export default function DataSets() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { currentDataSource } = useSelector(state => state.datasources)
  const dataSets = useMemo(() => {
    return currentDataSource.dataSets
  }, [currentDataSource.dataSets]);

  const handleChangeDataSet = useCallback(
    (index, key, value) => {
      dispatch(dataSourceActions.updateCurrentDataSets({
        index,
        key,
        value
      }))
    }, [dispatch]);

  return (<BasicAccordion
    items={[
      {
        title: 'DataSets',
        content: <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '16px' }}>
            {
              dataSets.length < 1 &&
              <Typography variant='bodySmall'>
                Still no datasets. Let’s create a first one
              </Typography>
            }
            {
              dataSets.map((item, index) =>
                <DataSet key={index} handleChangeDataSet={handleChangeDataSet} data={item} />
              )
            }
            <PlusIconButton
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => handleChangeDataSet(0, 'selected', false)}
            >
              <PlusIcon fill={theme.palette.icon.fill.send} />
            </PlusIconButton>
          </Box>
        </Box>
      }

    ]}
  />
  )
}