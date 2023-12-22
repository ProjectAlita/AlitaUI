import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import UserAvatar from '@/components/UserAvatar';
import { filterProps } from '@/common/utils';

const isDefined = (prop) => prop !== undefined && prop !== null;

const MainContainer = styled(Box,)(() => ({
  height: 'calc(100vh - 383px);',
  overflow: 'hidden',
}));

const Body = styled(Box, filterProps('expanded'))(() => ({
  maxHeight: 'calc(100vh - 425px);',
}));

const Container = styled(Box)(() => `
  display: flex;
  flex-direction: row;
`);

const ShadowBlock = styled(Box)(({ theme }) => `
  display: flex;
  padding: 2px 10px;
  align-items: flex-start;
  gap: 4px;
  border-radius: 23px;
  background: ${theme.palette.background.button.default};
  margin-right: 8px;
`);

const ShadowBlockTypography = styled(Typography)(({ theme }) => `
  color: ${theme.palette.text.info};
  text-align: center;
`);

const StatisticsContainer = styled(Box)(() => ({
  display: 'flex',
  marginTop: '16px',
  width: '100%',
}));

const StatisticsBlock = styled(Box)(() => `
display: flex;
flex-direction: column;
align-items: center;
flex-grow: 1;
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

const AuthorInformation = ({
  name,
  avatar,
  title,
  level,
  exp,
  rewards,
  ownItems,
  sharedItems,
  authorIntroduction
}) => {
  const refBody = useRef(null);
  const refContainer = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  const [showReadMore, setShowReadMore] = useState(true);
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
    const clientRect = refContainer.current?.getBoundingClientRect();
    if (authorIntroduction && clientRect.top + clientRect.height > window.innerHeight - 42) {
      setIsOverflow(true);
    } else {
      setIsOverflow(false);
      setShowReadMore(true);
    }
  }, [authorIntroduction]);

  const scrollableAreaStyle = useMemo(() => {
    if (showReadMore && isOverflow) {
      return  { maxHeight: 'calc(100vh - 610px);', overflowY: 'hidden' };
    } else if (isOverflow) {
      return { overflowY: 'scroll', height: 'calc(100vh - 610px);' };
    } 
    return undefined;
  }, [isOverflow, showReadMore]);

  useEffect(() => {
    updateOverflow();
    window.addEventListener("resize", updateOverflow);
    return () => {
      window.removeEventListener("resize", updateOverflow);
    };
  }, [updateOverflow]);

  return (
    <MainContainer>
      <Body>
        <Container>
          <UserAvatar avatar={avatar} name={name} size={53} />
          <Box sx={{ marginLeft: '16px' }}>
            <Box>
              <Typography variant='labelMedium' sx={{ color: 'text.secondary' }}>
                {name}
              </Typography>
            </Box>
            {
              isDefined(title) && <Box sx={{ paddingTop: '4px', paddingBottom: '4px' }}>
                <Typography variant='bodySmall'>
                  {title}
                </Typography>
              </Box>
            }
            <Container sx={{ paddingTop: '4px', paddingBottom: '4px' }}>
              {
                isDefined(level) && <ShadowBlock >
                  <ShadowBlockTypography variant='labelSmall'>
                    {`Lvl. - ${level}`}
                  </ShadowBlockTypography>
                </ShadowBlock>
              }
              {
                isDefined(exp) && <ShadowBlock >
                  <ShadowBlockTypography variant='labelSmall'>
                    {`Exp. - ${exp}`}
                  </ShadowBlockTypography>
                </ShadowBlock>
              }
            </Container>
          </Box>
        </Container>
        {
          ownItems &&
          <StatisticsContainer>
            <StatisticsBlock>
              <Box>
                <Typography variant='labelMedium' sx={{ color: 'text.secondary' }}>
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
                <Typography variant='labelMedium' sx={{ color: 'text.secondary' }}>
                  {ownItems}
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
                <Typography variant='labelMedium' sx={{ color: 'text.secondary' }}>
                  {sharedItems}
                </Typography>
              </Box>
              <LabelBlockWithRightBorder>
                <Typography variant='bodySmall'>
                  Shared Items
                </Typography>
              </LabelBlockWithRightBorder>
            </StatisticsBlock>
          </StatisticsContainer>
        }
        {
          authorIntroduction &&
          <AboutMeContainer >
            <Box sx={{ marginTop: '8px' }}>
              <Typography variant='labelMedium' sx={{ color: 'text.default' }}>
                About me
              </Typography>
            </Box>
            <IntroductionContainer ref={refContainer} sx={scrollableAreaStyle}>
              <Typography ref={refBody} variant='bodySmall' sx={{ color: 'text.secondary' }}>
                {authorIntroduction}
              </Typography>
            </IntroductionContainer>

          </AboutMeContainer>
        }
      </Body>
      {isOverflow && <Box sx={{ marginTop: '8px', marginBottom: '10px' }} onClick={onClickReadMore}>
        <Typography variant='bodySmall' sx={{ color: 'text.default' }}>
          {showReadMore ? 'Read more...' : 'Show less'}
        </Typography>
      </Box>
      }
    </MainContainer>
  )
}

export default AuthorInformation;