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
import { handleDeploymentName, stableSort } from '@/common/utils';
import Skeleton from '@mui/material/Skeleton';
import { SortOrderOptions } from '@/common/constants';
import SortUpwardIcon from '@/components/Icons/SortUpwardIcon';
import SortDisabledIcon from '@/components/Icons/SortDisabledIcon';
import SucceedIcon from '@/components/Icons/SucceedIcon';
import { useTheme } from '@emotion/react';
import DeploymentActions from './DeploymentActions';

const StyledTableHeadCell = styled(TableCell)(({ theme }) => `
  padding: 6px 16px;
  border-bottom: 1px solid ${theme.palette.secondary.main};  
  height: 30px;
`)

const StyledTableBodyCell = styled(TableCell)(({ theme }) => `
  padding: 6px 16px;
  height: 52px;
  border-bottom: 1px solid ${theme.palette.secondary.main};  
  color: ${theme.palette.text.secondary};
`)

const TokenRow = ({ deployment, refetch }) => {
  const theme = useTheme();
  return (
    <TableRow key={deployment.id}>
      <StyledTableBodyCell align="left">
        <Box>
          <Typography variant='headingSmall'>
            {handleDeploymentName(deployment.name)}
          </Typography>
        </Box>
        <Box>
          <Typography variant='bodySmall'>
            {deployment.config.name}
          </Typography>
        </Box>
      </StyledTableBodyCell>
      <StyledTableBodyCell sx={{ width: '150px' }} align="left">
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {deployment.is_default && <SucceedIcon fill={theme.palette.icon.fill.default} />}
        </Box>
      </StyledTableBodyCell>
      <StyledTableBodyCell sx={{ width: '64px' }} align="center">
        <DeploymentActions deployment={deployment} refetch={refetch} />
      </StyledTableBodyCell>
    </TableRow>
  )
}

const DeploymentsTable = ({ deployments, isFetching, refetch }) => {

  const [orderBy, setOrderBy] = useState('')
  const [order, setOrder] = useState(SortOrderOptions.ASC);

  const sortedDeployments = useMemo(() => {
    if (orderBy) {
      return stableSort(deployments, (first, second) => {
        if (typeof first[orderBy] === 'string') {
          if (order === SortOrderOptions.ASC) {
            return first[orderBy].toLowerCase().localeCompare(second[orderBy].toLowerCase());
          } else {
            return -1 * first[orderBy].toLowerCase().localeCompare(second[orderBy].toLowerCase());
          }
        } else if (typeof first[orderBy] === 'boolean') {
          if (order === SortOrderOptions.ASC) {
            return first[orderBy] && second[orderBy] ? 0 : first[orderBy] ? 1 : -1 ;
          } else {
            return first[orderBy] && second[orderBy] ? 0 : second[orderBy] ? 1 : -1 ;
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
      return deployments;
    }
  }, [order, orderBy, deployments]);

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

  return !isFetching ? (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="personal deployments table">
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
                <Typography variant='labelSmall'>Deployment name</Typography>
              </TableSortLabel>
            </StyledTableHeadCell>
            <StyledTableHeadCell sx={{ width: '150px' }} align="left">
              <TableSortLabel
                active={true}
                direction={orderBy === 'is_default' ? order : SortOrderOptions.DESC}
                onClick={onClickSortLabel('is_default')}
                IconComponent={orderBy === 'is_default' ? SortUpwardIcon : SortDisabledIcon}
                style={{ flexDirection: 'row-reverse' }}
              >
                <Typography variant='labelSmall'>Default status</Typography>
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
            sortedDeployments.map((deployment) => {
              return (
                <TokenRow key={deployment.id} deployment={deployment} refetch={refetch} />
              );
            })
          }
        </TableBody>
      </Table>

    </TableContainer>
  ) :
    (
      <Box marginLeft={'20px'}>
        <Skeleton sx={{ marginBottom: '8px' }} variant="rectangular" width={'100%'} height={40} />
        <Skeleton sx={{ marginBottom: '8px' }} variant="rectangular" width={'100%'} height={40} />
        <Skeleton sx={{ marginBottom: '8px' }} variant="rectangular" width={'100%'} height={40} />
        <Skeleton sx={{ marginBottom: '8px' }} variant="rectangular" width={'100%'} height={40} />
        <Skeleton sx={{ marginBottom: '8px' }} variant="rectangular" width={'100%'} height={40} />
        <Skeleton sx={{ marginBottom: '8px' }} variant="rectangular" width={'100%'} height={40} />
        <Skeleton sx={{ marginBottom: '8px' }} variant="rectangular" width={'100%'} height={40} />
        <Skeleton sx={{ marginBottom: '8px' }} variant="rectangular" width={'100%'} height={40} />
        <Skeleton sx={{ marginBottom: '8px' }} variant="rectangular" width={'100%'} height={40} />
      </Box>
    );
}

export default DeploymentsTable;
