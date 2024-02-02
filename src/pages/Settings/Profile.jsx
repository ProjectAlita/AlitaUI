import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import styled from "@emotion/styled";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { BarChart } from '@mui/x-charts/BarChart';
import Skeleton from '@mui/material/Skeleton';
import UserAvatar from '@/components/UserAvatar';
import { useSelector } from 'react-redux';
import useQueryAuthor from './useQueryAuthor';
import Typography from '@mui/material/Typography';
import { WorkOutlineIcon } from '@mui/icons-material/WorkOutline';
import EmailIcon from '@mui/icons-material/Email';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import { useAuthorDescriptionMutation } from '@/api/social.js';
import { useTheme } from '@emotion/react';
import { useTokenListQuery } from '@/api/auth';
import IconButton from '@/components/IconButton';
import EditIcon from '@/components/Icons/EditIcon';
import { SaveButton } from '@/pages/EditPrompt/Common';
import Button from '@/components/Button';
import { MuiMarkdown, getOverrides } from 'mui-markdown';
import { useNavBlocker, useProjectId } from '../hooks';
import { useGetModelsQuery } from '@/api/integrations.js';
import Container from './components/Container';

const LeftPanelContainer = styled(Box)(() => `
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-right: 56px;
  max-width: calc(50% - 68px);
`);

const RightPanelContainer = styled(Box)(() => `
  display: flex;
  flex: 1;
  flex-direction: column;
`);

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  margin-top: 8px;
  padding: 8px 16px;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  height: 133px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  font-family: Montserrat;
  line-height: 24px;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.text.secondary};
  border: 1px solid ${theme.palette.border.lines};
  background: none;
  // firefox
  &:focus-visible {
    outline: 0;
  }
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
`,
);

const ReadOnlyText = styled(Box)(
  ({ theme }) => `
  margin-top: 8px;
  padding: 0px 16px;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  height: 133px;
  border-radius: 8px;
  color: ${theme.palette.text.secondary};
  border: 1px solid ${theme.palette.border.lines};
  background: none;
  // firefox
  &:focus-visible {
    outline: 0;
  }
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
`,
);

const StatisticsContainer = styled(Box)(() => ({
  display: 'flex',
  marginTop: '16px',
  justifyContent: 'center',
  width: '100%',
}));

const StatisticsBlock = styled(Box)(() => `
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
width: 33.33%;
`);

const LabelBlock = styled(Box)(({ theme }) => ({
  width: '100%',
  borderLeft: 1,
  borderLeftColor: theme.palette.border.lines,
  borderLeftStyle: 'solid',
  display: 'flex',
  justifyContent: 'center',
  marginTop: '4px',
}));

const LabelBlockWithRightBorder = styled(LabelBlock)(({ theme }) => ({
  borderRight: 1,
  borderRightColor: theme.palette.border.lines,
  borderRightStyle: 'solid',
}));

const StyledButton = styled(Button)(({ theme }) => (`
  background: ${theme.palette.background.icon.default};
  color: ${theme.palette.text.secondary};
`));

const Profile = () => {
  const theme = useTheme();
  const { isFetching, refetch } = useQueryAuthor();
  const {
    name,
    avatar,
    title,
    email,
    level,
    exp,
    rewards = 0,
    public_prompts = 0,
    public_collections = 0,
    total_collections = 0,
    total_prompts = 0,
    description
  } = useSelector((state) => state.trendingAuthor.authorDetails);
  const user = useSelector(state => state.user)
  const projectId = useProjectId();
  const [putDescription, { isLoading: isUpdating }] = useAuthorDescriptionMutation()
  const { data: tokens, isFetching: isFetchingTokens } = useTokenListQuery({ skip: !user.personal_project_id })
  const [editable, setEditable] = useState(false);
  const [aboutMe, setAboutMe] = useState(description);
  const { data: deployments = [], isFetching: isFetchingDeployments } = useGetModelsQuery(projectId, { skip: !projectId })

  const onChangeDescription = useCallback(
    (event) => {
      setAboutMe(event.target?.value || '');
    },
    [],
  );

  const onSave = useCallback(
    async () => {
      await putDescription({ description: aboutMe })
      setEditable(false);
      if (refetch) {
        await refetch()
      }
    },
    [aboutMe, putDescription, refetch],
  );

  const onCancel = useCallback(
    () => {
      setAboutMe(description);
      setEditable(false);
    },
    [description],
  );

  const onClickEdit = useCallback(
    () => {
      setEditable(true);
    },
    [],
  );

  useEffect(() => {
    setAboutMe(description);
  }, [description]);

  useNavBlocker({
    blockCondition: editable && description !== aboutMe
  });

  return (
    <Container sx={{flexDirection: 'row !important'}}>
      <LeftPanelContainer>
        {
          !isFetching
            ?
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <UserAvatar avatar={avatar} name={name} size={64} />
              <Box marginLeft={'20px'}>
                <Typography variant={"headingMedium"} color={'text.secondary'}>
                  {name}
                </Typography>
                {title && <Typography variant='bodySmall' sx={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                  <WorkOutlineIcon fontSize='16px' />
                  <Typography variant='bodySmall' marginLeft={'4px'}>{title}</Typography>
                </Typography>}
                {email && <Typography variant='bodySmall' sx={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                  <EmailIcon fontSize='16px' />
                  <Typography variant='bodySmall' marginLeft={'4px'}>{email}</Typography>
                </Typography>}
              </Box>
            </Box>
            :
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton variant="circular" width={53} height={53} />
              <Box marginLeft={'20px'}>
                <Skeleton variant="rectangular" width={160} height={24} />
                <Skeleton variant="rectangular" width={140} height={18} sx={{ marginTop: '10px' }} />
                <Skeleton variant="rectangular" width={140} height={18} sx={{ marginTop: '10px' }} />
              </Box>
            </Box>
        }
        <Box sx={{ marginTop: '24px', width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant={"labelMedium"} color={'text.primary'}>
              About me
            </Typography>
            {!editable && <IconButton
              onClick={onClickEdit}>
              <EditIcon sx={{ fontSize: 16 }} fill={theme.palette.icon.fill.secondary} />
            </IconButton>}
          </Box>
          {
            !isFetching
              ?
              editable ?
                <Textarea
                  maxRows={6}
                  minRows={6}
                  disabled={!editable}
                  aria-label="Introduce yourself"
                  placeholder="Introduce yourself"
                  value={aboutMe}
                  onChange={onChangeDescription}
                />
                : <ReadOnlyText>
                  <Typography variant='bodyMedium'>
                    <MuiMarkdown overrides={{
                      ...getOverrides(),
                      h1: {
                        component: 'h1',
                        props: {
                        },
                      },
                      h2: {
                        component: 'h2',
                        props: {
                        },
                      },
                      h3: {
                        component: 'h3',
                        props: {
                        },
                      },
                      h4: {
                        component: 'h4',
                        props: {
                        },
                      },
                      h5: {
                        component: 'h5',
                        props: {
                        },
                      },
                      h6: {
                        component: 'h6',
                        props: {
                        },
                      },
                      p: {
                        component: 'p',
                      },
                      span: {
                        component: 'span',
                        props: {
                        },
                      },
                      a: {
                        component: 'a',
                        props: {
                        },
                      },
                      li: {
                        component: 'li',
                        props: {
                        },
                      },
                    }}>
                      {aboutMe}
                    </MuiMarkdown>
                  </Typography>
                </ReadOnlyText>
              :
              <Skeleton sx={{ marginTop: '12px' }} variant="rectangular" width={'100%'} height={150} />
          }
          {editable &&
            <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '16px' }}>
              <SaveButton disabled={description === aboutMe || isUpdating} onClick={onSave}>
                Save
                {
                  isUpdating && <StyledCircleProgress size={16} />
                }
              </SaveButton>
              <StyledButton onClick={onCancel}>
                Cancel
              </StyledButton>
            </Box>
          }
        </Box>
        <Box sx={{ marginTop: '24px' }}>
          <Typography variant={"labelMedium"} color={'text.primary'}>
            Activity
          </Typography>
          {
            !isFetching
              ?
              <StatisticsContainer>
                <StatisticsBlock>
                  <Box>
                    <Typography variant='labelMedium' color='text.secondary'>
                      {level || '-'}
                    </Typography>
                  </Box>
                  <LabelBlock>
                    <Typography variant='bodySmall'>
                      Level
                    </Typography>
                  </LabelBlock>
                </StatisticsBlock>
                <StatisticsBlock>
                  <Box>
                    <Typography variant='labelMedium' color='text.secondary'>
                      {exp || '-'}
                    </Typography>
                  </Box>
                  <LabelBlock>
                    <Typography variant='bodySmall'>
                      Experience
                    </Typography>
                  </LabelBlock>
                </StatisticsBlock>
                <StatisticsBlock>
                  <Box>
                    <Typography variant='labelMedium' color='text.secondary'>
                      {rewards}
                    </Typography>
                  </Box>
                  <LabelBlock>
                    <Typography variant='bodySmall'>
                      Rewards
                    </Typography>
                  </LabelBlock>
                </StatisticsBlock>
                <StatisticsBlock>
                  <Box>
                    <Typography variant='labelMedium' color='text.secondary'>
                      {total_collections + total_prompts}
                    </Typography>
                  </Box>
                  <LabelBlock>
                    <Typography variant='bodySmall'>
                      Own items
                    </Typography>
                  </LabelBlock>
                </StatisticsBlock>

                <StatisticsBlock>
                  <Box>
                    <Typography variant='labelMedium' color='text.secondary'>
                      {public_collections + public_prompts}
                    </Typography>
                  </Box>
                  <LabelBlockWithRightBorder>
                    <Typography variant='bodySmall'>
                      Shared Items
                    </Typography>
                  </LabelBlockWithRightBorder>
                </StatisticsBlock>
              </StatisticsContainer>
              :
              <Skeleton variant="rectangular" width={'100%'} height={60} />
          }
        </Box>
      </LeftPanelContainer>
      <RightPanelContainer>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant={"labelMedium"} color={'text.primary'}>
            Usage statistics
          </Typography>
          <Box sx={{ marginTop: '16px', width: '100%', height: '318px', borderRadius: '8px', background: theme.palette.background.secondary }}>
            {
              !isFetchingTokens && !isFetchingDeployments
                ?
                !!tokens?.length && <BarChart
                  series={[
                    { data: [tokens?.length || 0] },
                    { data: [undefined, deployments?.length || 0] },
                  ]}
                  height={290}
                  xAxis={[{ data: ['Tokens', 'Deployments'], scaleType: 'band' }]}
                  margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
                />
                :
                <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
            }

          </Box>
        </Box>
      </RightPanelContainer>
    </Container>
  );
}

export default Profile;