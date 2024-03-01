import React, { useMemo, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import styled from "@emotion/styled";
import ViewToggle from '@/components/ViewToggle';
import DeploymentsTable from './components/DeploymentsTable';
import { useGetModelsQuery } from '@/api/integrations.js';
import { useSearchParams } from 'react-router-dom';
import { SearchParams, ViewOptions } from '@/common/constants';
import DeploymentsCardList from './components/DeploymentsCardList';
import AddDeploymentButton from './components/AddDeploymentButton';
import { useProjectId } from '../hooks';
import Container from './components/Container';
import { buildErrorMessage } from '@/common/utils';
import useToast from '@/components/useToast';

const Divider = styled('div')(({ theme }) => {
  return {
    width: '1px',
    height: '90%',
    border: `1px solid ${theme.palette.border.lines}`,
    borderTop: '0',
    borderRight: '0',
    borderBottom: '0',
    marginLeft: '16px',
    marginRight: '8px'
  };
});

const Deployments = () => {
  const [searchParams] = useSearchParams();
  const projectId = useProjectId();
  const view = useMemo(() => searchParams.get(SearchParams.View) || ViewOptions.Table, [searchParams]);
  const { data: deployments = [], isFetching, refetch, isError, error } = useGetModelsQuery(projectId, { skip: !projectId, refetchOnMountOrArgChange: true })
  const { ToastComponent: Toast, toastError } = useToast();

  useEffect(() => {
    if (isError) {
      toastError(error?.status === 403 ? 'The access is not allowed' : buildErrorMessage(error));
    }
  }, [error, isError, toastError])

  return (
    <Container>
      <Box sx={{ padding: '12px', marginBottom: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant='headingSmall'>
          Deployments
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <AddDeploymentButton />
          <Divider />
          <ViewToggle defaultView={ViewOptions.Table} />
        </Box>
      </Box>
      {
        view === ViewOptions.Table ?
          <DeploymentsTable deployments={isError ? [] : deployments} refetch={refetch} isFetching={isFetching} />
          :
          <DeploymentsCardList deployments={isError ? [] : deployments} refetch={refetch} isFetching={isFetching} />

      }
      <Toast />
    </Container>
  );
}

export default Deployments;