import {
  CARD_FLEX_GRID,
  CARD_LIST_WIDTH,
  CARD_LIST_WIDTH_CENTERED,
  CARD_LIST_WIDTH_FULL,
  CARD_LIST_WIDTH_FULL_CENTERED,
  FULL_WIDTH_CARD_FLEX_GRID,
  FULL_WIDTH_FLEX_GRID_PAGE,
  MARGIN_COMPENSATION,
  MIN_CARD_WIDTH,
} from '@/common/constants';
import { filterProps } from '@/common/utils';
import EmptyListBox from '@/components/EmptyListBox';
import useTags from '@/components/useTags';
import { Grid, Skeleton } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import RightPanel from './RightPanel';

const CardListContainer = styled(
  Grid,
  filterProps('isFullWidth')
)(({ theme, isFullWidth }) => ({
  flexGrow: 1,
  width: isFullWidth ? CARD_LIST_WIDTH_FULL : CARD_LIST_WIDTH,
  overflowY: 'hidden',
  marginRight: `-${MARGIN_COMPENSATION}`,
  [theme.breakpoints.up('centered_content')]: {
    width: isFullWidth ?
      CARD_LIST_WIDTH_FULL_CENTERED :
      CARD_LIST_WIDTH_CENTERED
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
  emptyListPlaceHolder,
  headerHeight = '150px',
  dynamicTags,
}) => {
  const [cardWidth, setCardWidth] = React.useState(CARD_FLEX_GRID.MORE_THAN_THREE_CARDS)
  const [cardWidthXS, setCardWidthXS] = React.useState('')
  const [cardWidthSM, setCardWidthSM] = React.useState('')
  const [cardWidthFullWidthSM, setCardWidthFullWidthSM] = React.useState('')
  const [cardWidthMD, setCardWidthMD] = React.useState('')
  const [cardWidthLG, setCardWidthLG] = React.useState('')
  const [cardWidthXL, setCardWidthXL] = React.useState('')
  const [cardWidthXXL, setCardWidthXXL] = React.useState('')
  const [isFullWidthPage, setIsFullWidthPage] = React.useState(false)
  const { tagList } = useSelector((state) => state.prompts);
  const { calculateTagsWidthOnCard, setGetElement } = useTags(tagList);
  const { pathname } = useLocation();
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
    setIsFullWidthPage(FULL_WIDTH_FLEX_GRID_PAGE.includes(pathname))
  }, [pathname])

  React.useEffect(() => {
    const defaultGridSet = isFullWidthPage ? FULL_WIDTH_CARD_FLEX_GRID.MORE_THAN_THREE_CARDS : CARD_FLEX_GRID.MORE_THAN_THREE_CARDS
    const styleSet = isFullWidthPage ? {
      1: FULL_WIDTH_CARD_FLEX_GRID.ONE_CARD,
      2: FULL_WIDTH_CARD_FLEX_GRID.TWO_CARDS,
      3: FULL_WIDTH_CARD_FLEX_GRID.THREE_CARDS,
    } : {
      1: CARD_FLEX_GRID.ONE_CARD,
      2: CARD_FLEX_GRID.TWO_CARDS,
      3: CARD_FLEX_GRID.THREE_CARDS,
    }
    setCardWidth(styleSet[cardList.length] || defaultGridSet)
    const { XXL, XL, LG, MD, SM, FW_SM, XS } = cardWidth;
    setCardWidthXXL(XXL)
    setCardWidthXL(XL)
    setCardWidthLG(LG)
    setCardWidthMD(MD)
    setCardWidthSM(SM)
    setCardWidthFullWidthSM(FW_SM)
    setCardWidthXS(XS)
  }, [cardList, cardWidth, isFullWidthPage]);

  const gridStyle = React.useCallback((theme) => ({
    background: theme.palette.background.secondary,
    margin: isFullWidthPage ? '0 1rem 1rem 0' : '0 1rem 1rem 0',
    minWidth: MIN_CARD_WIDTH,
    width: {
      prompt_list_xxl: cardWidthXXL,
      prompt_list_xl: cardWidthXL,
      prompt_list_lg: cardWidthLG,
      prompt_list_md: cardWidthMD,
      prompt_list_full_width_sm: isFullWidthPage ? cardWidthFullWidthSM : cardWidthSM,
      prompt_list_sm: cardWidthSM,
      prompt_list_xs: cardWidthXS
    },
    height: '192px',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.border.activeBG}`,
    display: 'flex',
    alignItems: 'center',
    flexGrow: '0',
  }), [cardWidthFullWidthSM, cardWidthLG, cardWidthMD, cardWidthSM, cardWidthXL, cardWidthXS, cardWidthXXL, isFullWidthPage]);

  React.useEffect(() => {
    if (isLoading) return
    calculateTagsWidthOnCard();
    setGetElement(false);
  }, [calculateTagsWidthOnCard, isLoading, setGetElement]);

  return (
    <>
      <CardListContainer container isFullWidth={!rightPanelContent}>
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
                      key={cardData.id + (cardData.cardType || cardType)}
                      sx={gridStyle}
                    >
                      {
                        renderCard(cardData, cardData.cardType || cardType, index, dynamicTags)
                      }
                    </Grid>
                  );
                }
              )
              :
              <EmptyListBox emptyListPlaceHolder={emptyListPlaceHolder} headerHeight={headerHeight} showErrorMessage={!!isError} />
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
      </CardListContainer>
      <RightPanel offsetFromTop={rightPanelOffset}>
        {rightPanelContent}
      </RightPanel>
    </>
  );
};

export default CardList;
