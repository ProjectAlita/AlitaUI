import React, { useCallback, useState, useMemo } from 'react';
import { Box, Paper } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableSortLabel from '@mui/material/TableSortLabel';

import styled from "@emotion/styled";
import Typography from '@mui/material/Typography';
import { stableSort } from '@/common/utils';
import { SortOrderOptions } from '@/common/constants';
import SortUpwardIcon from '@/components/Icons/SortUpwardIcon';
import SortDisabledIcon from '@/components/Icons/SortDisabledIcon';

const StyledTableHeadCell = styled(TableCell)(({ theme }) => `
  padding: 6px 16px;
  border-bottom: 1px solid ${theme.palette.border.table};  
  height: 30px;
`)

const StyledTableBodyCell = styled(TableCell)(({ theme }) => `
  padding: 6px 16px;
  height: 52px;
  border-bottom: 1px solid ${theme.palette.border.table};  
  color: ${theme.palette.text.secondary};
`)

const TokenRow = ({ action }) => {
  return (
    <TableRow key={action.id}>
      <StyledTableBodyCell sx={{ width: '150px' }} align="left">
        <Box sx={{ width: '150px' }}>
          <Typography component='div' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} variant='bodySmall'>
            {action.name}
          </Typography>
        </Box>
      </StyledTableBodyCell>
      <StyledTableBodyCell sx={{ width: '150px' }} align="left">
        <Box sx={{ width: '150px' }}>
          <Typography component='div' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} variant='bodySmall'>
            {action.description}
          </Typography>
        </Box>
      </StyledTableBodyCell>
      <StyledTableBodyCell sx={{ width: '64px' }} align="left">
        <Box sx={{ width: '150px' }}>
          <Typography component='div' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} variant='bodySmall'>
            {action.method}
          </Typography>
        </Box>
      </StyledTableBodyCell>
      <StyledTableBodyCell sx={{ width: '150px' }} align="left">
        <Box sx={{ width: '150px' }}>
          <Typography component='div' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} variant='bodySmall'>
            {action.path}
          </Typography>
        </Box>
      </StyledTableBodyCell>
    </TableRow>
  )
}

const OpenAPIActionsTable = ({ actions }) => {

  const [orderBy, setOrderBy] = useState('')
  const [order, setOrder] = useState(SortOrderOptions.ASC);

  const sortedActions = useMemo(() => {
    if (orderBy) {
      return stableSort(actions, (first, second) => {
        if (typeof first[orderBy] === 'string') {
          if (order === SortOrderOptions.ASC) {
            return first[orderBy].toLowerCase().localeCompare(second[orderBy].toLowerCase());
          } else {
            return -1 * first[orderBy].toLowerCase().localeCompare(second[orderBy].toLowerCase());
          }
        } else if (typeof first[orderBy] === 'boolean') {
          if (order === SortOrderOptions.ASC) {
            return first[orderBy] && second[orderBy] ? 0 : first[orderBy] ? 1 : -1;
          } else {
            return first[orderBy] && second[orderBy] ? 0 : second[orderBy] ? 1 : -1;
          }
        } else {
          if (order === SortOrderOptions.ASC) {
            return first[orderBy] - second[orderBy];
          } else {
            return -1 * first[orderBy] - second[orderBy];
          }
        }
      })
    } else {
      return actions;
    }
  }, [order, orderBy, actions]);

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

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="personal actions table">
        <TableHead>
          <TableRow>
            <StyledTableHeadCell sx={{padding: '6px 4px !important'}} align="left">
              <TableSortLabel
                active={true}
                direction={orderBy === 'name' ? order : SortOrderOptions.DESC}
                onClick={onClickSortLabel('name')}
                IconComponent={orderBy === 'name' ? SortUpwardIcon : SortDisabledIcon}
                style={{ flexDirection: 'row-reverse' }}
              >
                <Typography variant='labelSmall'>Name</Typography>
              </TableSortLabel>
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{padding: '6px 4px !important'}} align="left">
              <TableSortLabel
                active={true}
                direction={orderBy === 'description' ? order : SortOrderOptions.DESC}
                onClick={onClickSortLabel('description')}
                IconComponent={orderBy === 'description' ? SortUpwardIcon : SortDisabledIcon}
                style={{ flexDirection: 'row-reverse' }}
              >
                <Typography variant='labelSmall'>Description</Typography>
              </TableSortLabel>
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{padding: '6px 4px !important'}} align="left">
              <TableSortLabel
                active={true}
                direction={orderBy === 'method' ? order : SortOrderOptions.DESC}
                onClick={onClickSortLabel('method')}
                IconComponent={orderBy === 'method' ? SortUpwardIcon : SortDisabledIcon}
                style={{ flexDirection: 'row-reverse' }}
              >
                <Typography variant='labelSmall'>Method</Typography>
              </TableSortLabel>
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{padding: '6px 4px !important'}} align="left">
              <TableSortLabel
                active={true}
                direction={orderBy === 'path' ? order : SortOrderOptions.DESC}
                onClick={onClickSortLabel('path')}
                IconComponent={orderBy === 'path' ? SortUpwardIcon : SortDisabledIcon}
                style={{ flexDirection: 'row-reverse' }}
              >
                <Typography variant='labelSmall'>Path</Typography>
              </TableSortLabel>
            </StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            sortedActions.map((action) => {
              return (
                <TokenRow key={action.name} action={action} />
              );
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default OpenAPIActionsTable;
