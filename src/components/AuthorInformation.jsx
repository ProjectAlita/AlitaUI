import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import styled from '@emotion/styled';
import UserAvatar from '@/components/UserAvatar';
import { filterProps } from '@/common/utils';
import LevelIcon from './Icons/LevelIcon';
import ExperienceIcon from './Icons/ExperienceIcon';
import { useViewMode } from '@/pages/hooks';
import { ViewMode } from '@/common/constants';
import Markdown from './Markdown';

const isDefined = (prop) => prop !== undefined && prop !== null && !isNaN(prop);

const MainContainer = styled(Box,)(() => ({
  maxHeight: '50vh',
}));

const Container = styled(Box)(() => `
  display: flex;
  flex-direction: row;
`);

const NameBlock = styled(Box)(() => ({
  height: '24px',
  display: 'flex',
  alignItems: 'center',
}));

const UserInfoBlock = styled(Box)(() => ({
  marginLeft: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}));

const TitleBlock = styled(Box)(() => ({
  marginTop: '4px',
  marginBottom: '4px',
  height: '16px',
  display: 'flex',
  alignItems: 'center'
}));

const ShadowBlock = styled(Box)(({ theme }) => `
  display: flex;
  padding: 2px 10px;
  align-items: center;
  gap: 8px;
  border-radius: 23px;
  background: ${theme.palette.background.button.default};
  margin-right: 8px;
  height: 24px;
`);

const ShadowBlockTypography = styled(Typography)(() => `
  text-align: center;
`);

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

const AboutMeContainer = styled(Box)(() => ({
  display: 'Block',
  marginTop: '16px',
  width: '100%',
}));

const IntroductionContainer = styled(Box, filterProps('expanded'))(() => ({
  display: 'Block',
  marginTop: '4px',
  width: '100%',
  flex: 1,
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '::-webkit-scrollbar': {
    width: '0 !important;',
    height: '0;',
  }
}));

const AuthorInformation = ({ isLoading }) => {
  const {
    name,
    avatar,
    title,
    level,
    exp,
    rewards = 0,
    public_prompts = 0,
    public_collections = 0,
    total_collections = 0,
    total_prompts = 0,
    description
  } = useSelector((state) => state.trendingAuthor.authorDetails);
  const viewMode = useViewMode();
  const refBody = useRef(null);
  const refContainer = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [showReadMore, setShowReadMore] = useState(true);
  const aboutMe = useMemo(() => description
    ?
    description.replaceAll('\x0a', '  \n')
    :
    `${viewMode === ViewMode.Owner
      ?
      'You haven\'t'
      :
      'The author hasn\'t'} added introduction yet.`,
    [description, viewMode]);
  const onClickReadMore = useCallback(() => {
    if (!showReadMore) {
      refBody.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start"
      });
      setTimeout(() => {
        setShowReadMore(!showReadMore);
      }, 100);
    } else {
      setShowReadMore(!showReadMore);
    }

  }, [showReadMore]);

  const updateOverflow = React.useCallback(() => {
    const parentRect = refContainer.current?.getBoundingClientRect();
    const childRect = refBody.current?.getBoundingClientRect();
    if (description && parentRect.height < childRect.height - 10) {
      setIsOverflow(true);
    } else {
      setIsOverflow(false);
    }
  }, [description]);

  const scrollableAreaStyle = useMemo(() => {
    if (showReadMore && isOverflow) {
      return { maxHeight: 'calc(50vh - 220px);', overflowY: 'hidden' };
    } else if (isOverflow) {
      return { overflowY: 'scroll', height: 'calc(50vh - 220px);' };
    }
    return { maxHeight: 'calc(50vh - 220px);', marginBottom: '10px' };
  }, [isOverflow, showReadMore]);

  useEffect(() => {
    updateOverflow();
    window.addEventListener("resize", updateOverflow);
    return () => {
      window.removeEventListener("resize", updateOverflow);
    };
  }, [updateOverflow]);

  return !isLoading ? (
    <MainContainer>
      <Box>
        {!!name && <Container>
          <UserAvatar avatar={avatar} name={name} size={53} />
          <UserInfoBlock>
            <NameBlock>
              <Typography variant='labelMedium' sx={{ color: 'text.secondary' }}>
                {name}
              </Typography>
            </NameBlock>
            {
              isDefined(title) &&
              <TitleBlock>
                <Typography variant='bodySmall'>
                  {title}
                </Typography>
              </TitleBlock>
            }
            <Container sx={{ paddingTop: '2px', paddingBottom: '2px' }}>
              {
                isDefined(level) && <ShadowBlock >
                  <LevelIcon width={16} height={16} />
                  <ShadowBlockTypography variant='labelSmall'>
                    {'lvl.'}
                  </ShadowBlockTypography>
                  <ShadowBlockTypography variant='labelSmall' color='text.metrics'>
                    {level}
                  </ShadowBlockTypography>
                </ShadowBlock>
              }
              {
                isDefined(exp) && <ShadowBlock >
                  <ExperienceIcon width={16} height={16} />
                  <ShadowBlockTypography variant='labelSmall' >
                    {'exp.'}
                  </ShadowBlockTypography>
                  <ShadowBlockTypography variant='labelSmall' color='text.metrics'>
                    {exp}
                  </ShadowBlockTypography>
                </ShadowBlock>
              }
            </Container>
          </UserInfoBlock>
        </Container>}

        <StatisticsContainer>
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

        <AboutMeContainer >
          <Box sx={{ marginTop: '8px' }}>
            <Typography variant='labelMedium' color='text.default'>
              About me
            </Typography>
          </Box>
          <IntroductionContainer ref={refContainer} sx={scrollableAreaStyle}>
            <Typography ref={refBody} variant='bodySmall' color={description ? 'text.secondary' : 'text.input.placeholder'}>
              <Markdown>
                {aboutMe}
              </Markdown>
            </Typography>
          </IntroductionContainer>

        </AboutMeContainer>
      </Box>
      {isOverflow && <Box sx={{ marginTop: '8px', marginBottom: '10px' }} onClick={onClickReadMore}>
        <Typography variant='bodySmall' sx={{ color: 'text.default', cursor: 'pointer' }}>
          {showReadMore ? 'Show more...' : 'Show less'}
        </Typography>
      </Box>
      }
    </MainContainer>
  ) : (
    <MainContainer>
      <Box>
        <Container>
          <Skeleton variant="circular" width={53} height={53} />
          <Box sx={{ marginLeft: '16px' }}>
            <Skeleton variant="rectangular" width={160} height={24} />
            <Skeleton variant="rectangular" width={140} height={18} sx={{ marginTop: '10px' }} />

            <Container sx={{ paddingTop: '2px', paddingBottom: '2px' }}>
              <Skeleton variant="rectangular" width={180} height={30} sx={{ marginTop: '10px' }} />

            </Container>
          </Box>
        </Container>

        <StatisticsContainer>
          <Skeleton variant="rectangular" width={'100%'} height={60} sx={{ marginTop: '10px' }} />

        </StatisticsContainer>

        <AboutMeContainer >
          <Box sx={{ marginTop: '8px' }}>
            <Typography variant='labelMedium' color='text.default'>
              About me
            </Typography>
          </Box>
          <IntroductionContainer ref={refContainer} sx={scrollableAreaStyle}>
            <Skeleton variant="rectangular" width={'100%'} height={60} sx={{ marginTop: '10px' }} />

          </IntroductionContainer>

        </AboutMeContainer>
      </Box>
      <Box sx={{ marginTop: '8px', marginBottom: '10px' }}>
        <Skeleton variant="rectangular" width={'100%'} height={60} sx={{ marginTop: '10px' }} />
      </Box>
    </MainContainer>
  )
}

export default AuthorInformation;