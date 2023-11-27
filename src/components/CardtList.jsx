import { CARD_FLEX_GRID } from '@/common/constants';
import { Grid, Skeleton } from '@mui/material';
import * as React from 'react';
import RightPanel from './RightPanel';


const  CardList = ({cardList, isLoading, isError, rightPanelContent, renderCard, isLoadingMore, onScroll }) => {
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
    minWidth: '260px',
    width: {
      xl: XL,
      lg: LG,
      md: MD,
      sm: SM,
      xs: XS
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
            (promptData) => {
              return (
                <Grid
                  item
                  key={promptData.id}
                  sx={gridStyle}
                >
                  {
                    renderCard(promptData)
                  }
                </Grid>
              );
            }
          )}

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
          <RightPanel>
            {rightPanelContent}
          </RightPanel>
        </Grid>
      </>
    );
};

export default  CardList;
