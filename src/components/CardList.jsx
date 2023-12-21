import { CARD_FLEX_GRID, CARD_LIST_WIDTH, CENTERED_CONTENT_BREAKPOINT } from '@/common/constants';
import { filterProps } from '@/common/utils';
import { Grid, Skeleton } from '@mui/material';
import * as React from 'react';
import RightPanel from './RightPanel';
import EmptyListBox from '@/components/EmptyListBox';

const CardListContainer = styled(
  Grid,
  filterProps([])
)(({ theme }) => ({
  flexGrow: 1,
  width: CARD_LIST_WIDTH,
  overflowY: 'hidden',
  [theme.breakpoints.up('centered_content')]: {
    maxWidth: `${CENTERED_CONTENT_BREAKPOINT}px`
  }
}));

const CardList = ({
  cardList, 
  isLoading, 
  isError, 
  rightPanelOffset,
  rightPanelContent, 
  renderCard, 
  isLoadingMore, 
  loadMoreFunc,
  cardType,
  placeHolder,
  headerHeight = '150px',
}) => {
  const [cardWidth, setCardWidth] = React.useState(CARD_FLEX_GRID.MORE_THAN_THREE_CARDS)
  const [cardWidthXS, setCardWidthXS] = React.useState('')
  const [cardWidthSM, setCardWidthSM] = React.useState('')
  const [cardWidthMD, setCardWidthMD] = React.useState('')
  const [cardWidthLG, setCardWidthLG] = React.useState('')
  const [cardWidthXL, setCardWidthXL] = React.useState('')
  const [cardWidthXXL, setCardWidthXXL] = React.useState('')
  const onScroll = React.useCallback(() => {
    const isScrollOver = document.documentElement.offsetHeight - (window.innerHeight + document.documentElement.scrollTop) < 10
    if (isScrollOver) {
      loadMoreFunc();
    }
  }, [loadMoreFunc]);

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  React.useEffect(() => {
    const styleSet = {
      1: CARD_FLEX_GRID.ONE_CARD,
      2: CARD_FLEX_GRID.TWO_CARDS,
      3: CARD_FLEX_GRID.THREE_CARDS,
    }
    setCardWidth(styleSet[cardList.length] || CARD_FLEX_GRID.MORE_THAN_THREE_CARDS)
    const { XXL, XL, LG, MD, SM, XS } = cardWidth;
    setCardWidthXXL(XXL)
    setCardWidthXL(XL)
    setCardWidthLG(LG)
    setCardWidthMD(MD)
    setCardWidthSM(SM)
    setCardWidthXS(XS)
  }, [cardList, cardWidth]);

  const gridStyle = React.useCallback((theme) => ({
    background: theme.palette.background.secondary,
    margin: '0 1rem 1rem 0',
    minWidth: '380px',
    maxWidth: {
      prompt_list_xxl: '34.375rem'
    },
    width: {
      prompt_list_xxl: cardWidthXXL,
      prompt_list_xl: cardWidthXL,
      prompt_list_lg: cardWidthLG,
      prompt_list_md: cardWidthMD,
      prompt_list_sm: cardWidthSM,
      prompt_list_xs: cardWidthXS
    },
    height: '192px',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.border.activeBG}`,
    display: 'flex',
    alignItems: 'center',
    flexGrow: '0',
  }), [cardWidthLG, cardWidthMD, cardWidthSM, cardWidthXL, cardWidthXS, cardWidthXXL]);

  return (
    <>
      <CardListContainer container>
        {
          isLoading ?
            Array.from({ length: 10 }).map((_, index) => (
              <Grid key={index} item sx={gridStyle}>
                <Skeleton animation="wave" variant="rectangular" width='100%' height='100%' />
              </Grid>
            ))
            :
            cardList.length && !isError
              ?
              cardList.map(
                (cardData, index) => {
                  return (
                    <Grid
                      item
                      key={cardData.id}
                      sx={gridStyle}
                    >
                      {
                        renderCard(cardData, cardType, index)
                      }
                    </Grid>
                  );
                }
              )
              :
              <EmptyListBox placeHolder={placeHolder} headerHeight={headerHeight} showErrorMessage={!!isError} />
        }
        {
          isLoadingMore &&
          <>
            {
              Array.from({ length: 8 }).map((_, index) => (
                <Grid item key={index} sx={gridStyle}>
                  <Skeleton animation="wave" variant="rectangular" width={'100%'} height={192} style={{ borderRadius: 8 }} />
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

export default CardList;
