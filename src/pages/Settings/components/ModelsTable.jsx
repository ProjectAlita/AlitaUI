import React, { useCallback, useState, useMemo } from 'react';
import { Box } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableSortLabel from '@mui/material/TableSortLabel';

import styled from "@emotion/styled";
import Typography from '@mui/material/Typography';
import { accessObjectProperty, stableSort } from '@/common/utils';
import { SortOrderOptions } from '@/common/constants';
import SortUpwardIcon from '@/components/Icons/SortUpwardIcon';
import SortDisabledIcon from '@/components/Icons/SortDisabledIcon';
import { useTheme } from '@emotion/react';
import Checkbox from '@mui/material/Checkbox';
import DeleteModelButton from './DeleteModelButton';

const StyledTableHeadCell = styled(TableCell)(({ theme }) => `
  padding: 6px 4px;
  border-bottom: 1px solid ${theme.palette.secondary.main};  
  height: 30px;
`)

const StyledTableBodyCell = styled(TableCell)(({ theme }) => `
  padding: 6px 12px;
  height: 54px;
  border-bottom: 1px solid ${theme.palette.secondary.main};  
  color: ${theme.palette.text.secondary};
`)

const TokenRow = ({ model, onChangeModel, onDeleteModel, isVertexAI }) => {
  const theme = useTheme();

  const onChange = useCallback(
    (capability) => (_, value) => {
      onChangeModel({
        ...model,
        capabilities: {
          ...model.capabilities,
          [capability]: value,
        }
      });
    },
    [model, onChangeModel],
  );

  const onDelete = useCallback(
    () => {
      onDeleteModel(model.id)
    },
    [model.id, onDeleteModel],
  )
  
  return (
    <TableRow key={model.id}>
      <StyledTableBodyCell align="left">
        <Typography variant='labelMedium' color='text.metrics'>
          {model.name}
        </Typography>
      </StyledTableBodyCell>
      <StyledTableBodyCell sx={{ width: '120px' }} align="left">
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: '28px' }}>
          <Checkbox
            size='small'
            onChange={onChange('completion')}
            sx={{
              color: theme.palette.text.primary,
              '&.Mui-checked': {
                color: theme.palette.text.primary,
              },
            }}
            checked={model.capabilities.completion} />
        </Box>
      </StyledTableBodyCell>
      <StyledTableBodyCell sx={{ width: '120px' }} align="left">
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: '28px' }}>
          <Checkbox
            size='small'
            onChange={onChange('chat_completion')}
            sx={{
              color: theme.palette.text.primary,
              '&.Mui-checked': {
                color: theme.palette.text.primary,
              },
            }}
            checked={model.capabilities.chat_completion} />
        </Box>
      </StyledTableBodyCell>
      <StyledTableBodyCell sx={{ width: '120px' }} align="left">
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Checkbox
            size='small'
            onChange={onChange('embeddings')}
            sx={{
              color: theme.palette.text.primary,
              '&.Mui-checked': {
                color: theme.palette.text.primary,
              },
            }}
            checked={model.capabilities.embeddings} />
        </Box>
      </StyledTableBodyCell>
      <StyledTableBodyCell sx={{ width: '120px' }} align="left">
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant='bodyMedium' color='text.primary'>
            {!isVertexAI ? model.token_limit : model.token_limit.input}
          </Typography>
        </Box>
      </StyledTableBodyCell>
      <StyledTableBodyCell sx={{ width: '64px' }} align="center">
        <DeleteModelButton onDelete={onDelete}/>
      </StyledTableBodyCell>
    </TableRow>
  )
}

const ModelsTable = ({ models, onChangeOneModel, onDeleteOneModel, isVertexAI }) => {

  const [orderBy, setOrderBy] = useState('')
  const [order, setOrder] = useState(SortOrderOptions.ASC);

  const sortedModels = useMemo(() => {
    if (orderBy) {
      return stableSort(models, (first, second) => {
        const propValue = accessObjectProperty(first, orderBy)
        if (typeof propValue === 'string') {
          if (order === SortOrderOptions.ASC) {
            return propValue.toLowerCase().localeCompare(second[orderBy].toLowerCase());
          } else {
            return -1 * propValue.toLowerCase().localeCompare(second[orderBy].toLowerCase());
          }
        } else {
          if (order === SortOrderOptions.ASC) {
            return propValue - second[orderBy];
          } else {
            return -1 * propValue - second[orderBy];
          }
        }
      })
    } else {
      return models;
    }
  }, [order, orderBy, models]);

  const onClickSortLabel = useCallback(
    (fieldName) => () => {
      if (fieldName !== orderBy) {
        setOrderBy(fieldName);
        setOrder(SortOrderOptions.ASC);
      } else {
        if (order === SortOrderOptions.ASC) {
          setOrder(SortOrderOptions.DESC);
        } else {
          setOrder(SortOrderOptions.ASC);
        }
      }
    },
    [order, orderBy],
  );

  const onChangeModel = useCallback(
    (model) => {
      onChangeOneModel(model);
    },
    [onChangeOneModel],
  )

  const onDeleteModel = useCallback(
    (id) => {
      onDeleteOneModel(id);
    },
    [onDeleteOneModel],
  )

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="personal models table">
        <TableHead>
          <TableRow>
            <StyledTableHeadCell align="left">
              <TableSortLabel
                active={true}
                direction={orderBy === 'name' ? order : SortOrderOptions.DESC}
                onClick={onClickSortLabel('name')}
                IconComponent={orderBy === 'name' ? SortUpwardIcon : SortDisabledIcon}
                style={{ flexDirection: 'row-reverse' }}
              >
                <Typography variant='labelSmall'>Model Name</Typography>
              </TableSortLabel>
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '120px' }} align="left">
              <TableSortLabel
                active={true}
                direction={orderBy === 'capabilities.completion' ? order : SortOrderOptions.DESC}
                onClick={onClickSortLabel('capabilities.completion')}
                IconComponent={orderBy === 'capabilities.completion' ? SortUpwardIcon : SortDisabledIcon}
                style={{ flexDirection: 'row-reverse' }}
              >
                <Typography variant='labelSmall'>Text</Typography>
              </TableSortLabel>
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '120px' }} align="left">
              <TableSortLabel
                active={true}
                direction={orderBy === 'capabilities.chat_completion' ? order : SortOrderOptions.DESC}
                onClick={onClickSortLabel('capabilities.chat_completion')}
                IconComponent={orderBy === 'capabilities.chat_completion' ? SortUpwardIcon : SortDisabledIcon}
                style={{ flexDirection: 'row-reverse' }}
              >
                <Typography variant='labelSmall'>Chat</Typography>
              </TableSortLabel>
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '120px' }} align="left">
              <TableSortLabel
                active={true}
                direction={orderBy === 'capabilities.embeddings' ? order : SortOrderOptions.DESC}
                onClick={onClickSortLabel('capabilities.embeddings')}
                IconComponent={orderBy === 'capabilities.embeddings' ? SortUpwardIcon : SortDisabledIcon}
                style={{ flexDirection: 'row-reverse' }}
              >
                <Typography variant='labelSmall'>Embeddings</Typography>
              </TableSortLabel>
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '120px' }} align="left">
              <TableSortLabel
                active={true}
                direction={orderBy === 'token_limit' ? order : SortOrderOptions.DESC}
                onClick={onClickSortLabel('token_limit')}
                IconComponent={orderBy === 'token_limit' ? SortUpwardIcon : SortDisabledIcon}
                style={{ flexDirection: 'row-reverse' }}
              >
                <Typography variant='labelSmall'>Tokens</Typography>
              </TableSortLabel>
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '64px' }} align="left">
              <Typography variant='labelSmall'>
                Actions
              </Typography>
            </StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            sortedModels.map((model) => {
              return (
                <TokenRow key={model.id} model={model} onChangeModel={onChangeModel} onDeleteModel={onDeleteModel} isVertexAI={isVertexAI} />
              );
            })
          }
        </TableBody>
      </Table>

    </TableContainer>)

}

export default ModelsTable;
