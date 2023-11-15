import { SOURCE_PROJECT_ID, CARD_FLEX_GRID } from '@/common/constants';
import PromptCard from '@/components/Card.jsx';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { usePromptListQuery } from '@/api/prompts.js';
import Categories from './Categories.jsx';
import TrendingAuthors from './TrendingAuthors.jsx';

const PromptList = () => {
  const { filteredList, tagList } = useSelector((state) => state.prompts);
  const { isError } = usePromptListQuery(SOURCE_PROJECT_ID);
  const styleSet = {
    1: CARD_FLEX_GRID.ONE_CARD,
    2: CARD_FLEX_GRID.TWO_CARDS,
    3: CARD_FLEX_GRID.THREE_CARDS,
  }
  const cardWidth = styleSet[filteredList.length] || CARD_FLEX_GRID.MORE_THAN_THREE_CARDS
  const { XL, LG, MD, SM, XS } = cardWidth;
  if (isError) return <>error</>;
  return (
    <Grid container style={{ flexGrow: 1, width: 'calc(100% - 15.5rem)' }}>
      {filteredList.map(
        (promptData) => {
          return (
            <Grid
              item
              key={promptData.id}
              sx={{
                background: '#181F2A',
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
                border: '1px solid #26323D',
                display: 'flex',
                alignItems: 'center',
                flexGrow: '0',
              }}
            >
              <PromptCard data={promptData} />
            </Grid>
          );
        }
      )}
      <Grid
        item
        xs={3}
        style={{
          position: 'fixed',
          right: '1.5rem',
          height: '100vh',
          width: '18.5rem',
          paddingLeft: '1rem'
        }}
      >
        <Categories tagList={tagList}/>
        <TrendingAuthors />
      </Grid>
    </Grid>
  );
};

export default PromptList;
