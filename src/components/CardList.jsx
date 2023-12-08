import { CARD_FLEX_GRID, CARD_LIST_WIDTH } from '@/common/constants';
import { Grid, Skeleton } from '@mui/material';
import * as React from 'react';
import RightPanel from './RightPanel';
import { filterProps } from '@/common/utils';

const CardListContainer = styled(
  Grid,
  filterProps([])
)(({theme}) => ({
  flexGrow: 1, 
  width: CARD_LIST_WIDTH, 
  overflowY: 'hidden',
<<<<<<< HEAD
=======
  marginTop: '-1rem',
  [theme.breakpoints.up('centered_content')]: {
    maxWidth: '2650px'
  }
>>>>>>> e939aa0 (feat: prompt page responsive)
}));

const  CardList = ({
  cardList, 
  isLoading, 
  isError, 
  rightPanelOffset,
  rightPanelContent, 
  renderCard, 
  isLoadingMore, 
  loadMoreFunc,
  cardType,
}) => {
  const onScroll = React.useCallback(() => {
    const isScrollOver = window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;
    if (isScrollOver) {
      loadMoreFunc();
    }
  }, [loadMoreFunc]);

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const styleSet = {
    1: CARD_FLEX_GRID.ONE_CARD,
    2: CARD_FLEX_GRID.TWO_CARDS,
    3: CARD_FLEX_GRID.THREE_CARDS,
  }
  const cardWidth = styleSet[cardList.length] || CARD_FLEX_GRID.MORE_THAN_THREE_CARDS
  const { XXL, XL, LG, MD, SM, XS } = cardWidth;
  const gridStyle = React.useCallback((theme) => ({
    background: theme.palette.background.secondaryBg,
<<<<<<< HEAD
    margin: '0 1rem 1rem 0',
    minWidth: '380px',
    maxWidth: '34.375rem',
=======
    margin: '1rem 1rem 0 0',
    maxWidth: {
      prompt_list_xxl: '34.375rem'
    },
>>>>>>> e939aa0 (feat: prompt page responsive)
    width: {
      prompt_list_xxl: XXL,
      prompt_list_xl: XL,
      prompt_list_lg: LG,
      prompt_list_md: MD,
      prompt_list_sm: SM,
      prompt_list_xs: XS
    },
    height: '192px',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.border.activeBG}`,
    display: 'flex',
    alignItems: 'center',
    flexGrow: '0',
  }), [LG, MD, SM, XL, XS, XXL]);

  if (isError) return <>error</>;

  return (
      <>
        <CardListContainer container>
          {
            isLoading ?
              Array.from({ length: 10 }).map((_, index) => (
                <Grid key={index} item sx={gridStyle}>
                  <Skeleton animation="wave" variant="rectangular" width='100%' height='100%'/>
                </Grid>
              )) : 
              cardList.map(
                (cardData) => {
                  return (
                    <Grid
                      item
                      key={cardData.id}
                      sx={gridStyle}
                    >
                      {
                        renderCard(cardData, cardType)
                      }
                    </Grid>
                  );
                }
              )
          }
          
          {
            !cardList.length && <div>You have not created anything</div>
          }
          {
            isLoadingMore &&
            <>
              {
                Array.from({ length: 8 }).map((_, index) => (
                  <Grid item key={index} sx={gridStyle}>
                    <Skeleton animation="wave" variant="rectangular" width={'100%'} height={192} style={{borderRadius: 8}} />
                  </Grid>
                ))
              }
            </>
          }
          <RightPanel offsetFromTop={rightPanelOffset}>
            {rightPanelContent}
          </RightPanel>
        </CardListContainer>
      </>
  );
};

export default  CardList;
