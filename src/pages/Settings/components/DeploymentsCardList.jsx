import DialIcon from '@/components/Icons/DialIcon';
import EmojiIcon from '@/components/Icons/EmojiIcon';
import HuggingFaceIcon from '@/components/Icons/HuggingFaceIcon';
import OpenAIIcon from '@/components/Icons/OpenAIIcon';
import VertexAIIcon from '@/components/Icons/VertexAIIcon';
import { useTheme } from '@emotion/react';
import styled from "@emotion/styled";
import { Box, Typography } from '@mui/material';
import Actions from './DeploymentActions';
import { handleDeploymentName } from '@/common/utils';

const Container = styled(Box)(() => (`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 24px;
`));

const CardContainer = styled(Box)(({ theme }) => (`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
width: 380px;
padding: 18px 24px;
border-radius: 8px;
border: 1px solid ${theme.palette.secondary.main};
background: ${theme.palette.background.secondary};
`));

const DeploymentIcon = ({ name }) => {
  const theme = useTheme();
  switch (name) {
    case 'vertex_ai':
      return <VertexAIIcon width={'24px'} height={'24px'} />
    case 'ai_dial':
      return <DialIcon width={'24px'} height={'24px'} />

    case 'open_ai':
      return <OpenAIIcon width={'24px'} height={'24px'} />

    case 'hugging_face':
      return <HuggingFaceIcon width={'24px'} height={'24px'} />
    default:
      return <EmojiIcon fill={theme.palette.icon.fill.default} />
  }
}

const DeploymentCard = ({ deployment, refetch }) => {
  const theme = useTheme();
  return (
    <CardContainer >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Box sx={{
          width: '44px',
          height: '44px',
          borderRadius: '22px',
          padding: '10px',
          boxSizing: 'border-box',
          background: theme.palette.background.button.default,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '16px'
        }}>
          <DeploymentIcon name={deployment.name} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', maxWidth: '275px' }}>
          <Box>
            <Typography variant='headingSmall'>
              {handleDeploymentName(deployment.name)}
            </Typography>
          </Box>
          <Typography variant='bodyMedium'>
            {deployment.config.name}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        {
          deployment.is_default && <Box
            sx={{
              display: 'flex',
              padding: '4px 12px',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '20px',
              background: theme.palette.icon.fill.is_default,
              backdropFilter: 'blur(6px)',
              marginRight: '16px',
            }}>
            <Typography variant='labelSmall'>
              Default
            </Typography>
          </Box>
        }
        <Actions deployment={deployment} refetch={refetch} />
      </Box>
    </CardContainer >
  )
}


export default function DeploymentsCardList({ deployments, refetch, isFetching }) {
  return (
    <Container>
      {
        !isFetching && deployments.map((deployment) => <DeploymentCard
          deployment={deployment}
          key={deployment.id}
          refetch={refetch}
        />)
      }
    </Container>
  );
}