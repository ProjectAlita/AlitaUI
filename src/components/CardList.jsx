import { CARD_FLEX_GRID } from '@/common/constants';
import { Grid, Skeleton } from '@mui/material';
import * as React from 'react';
import RightPanel from './RightPanel';


const  CardList = ({
  cardList, 
  isLoading, 
  isError, 
  rightPanelOffset,
  rightPanelContent, 
  renderCard, 
  isLoadingMore, 
  loadMoreFunc 
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
  const { XL, LG, MD, SM, XS } = cardWidth;
  const gridStyle = React.useCallback((theme) => ({
    background: theme.palette.background.secondaryBg,
    margin: '1rem 1rem 0 0',
    minWidth: '380px',
    maxWidth: '34.375rem',
    width: {
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
  }), [LG, MD, SM, XL, XS]);

  if (isError) return <>error</>;

  return isLoading ?
    <Grid container spacing={2}>
      {
        Array.from({ length: 10 }).map((_, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Skeleton animation="wave" variant="rectangular" width={'100%'} height={200} />
          </Grid>
        ))
      }
    </Grid>
    :
    (
      <>
        <Grid container style={{ flexGrow: 1, width: 'calc(100% - 16.5rem)', overflowY: 'hidden' }}>
          {cardList.map(
            (cardData) => {
              return (
                <Grid
                  item
                  key={cardData.id}
                  sx={gridStyle}
                >
                  {
                    renderCard(cardData)
                  }
                </Grid>
              );
            }
          )}
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
        </Grid>
      </>
    );
};

export default  CardList;
