import { useLazyPromptListQuery } from '@/api/prompts.js';
import { CARD_FLEX_GRID, SOURCE_PROJECT_ID } from '@/common/constants';
import PromptCard from '@/components/Card.jsx';
import { Grid } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Categories from './Categories.jsx';
import TrendingAuthors from './TrendingAuthors.jsx';

const PromptList = () => {
  const location = useLocation();
  const [selectedTags, setSelectedTags] = React.useState([]);

  const getTagsFromUrl = React.useCallback(() => {
    const currentQueryParam = location.search ? new URLSearchParams(location.search) : new URLSearchParams();
    const tagsParam = currentQueryParam.get("tags")?.split(",").filter(tag => tag !== '');
    let tags = []
    if (tagsParam?.length > 0) {
      tags = tagsParam
        .map(id => {
          try {
            return parseInt(id);
          } catch (error) {
            return '';
          }
        })
        .filter(tag => tag !== '');
    }
    return tags
  }, [location.search]);

  const [loadPrompts, {isError}] = useLazyPromptListQuery();

  React.useEffect(() => {
    const tags = getTagsFromUrl();
    setSelectedTags(tags);
    loadPrompts({ 
      projectId: SOURCE_PROJECT_ID, 
      params: {
        limit: 10,
        offset: 0,
        tags: tags.join(','),
      }
    })
  }, [getTagsFromUrl, loadPrompts]);
  
  const { filteredList, tagList } = useSelector((state) => state.prompts);

  const styleSet = {
    1: CARD_FLEX_GRID.ONE_CARD,
    2: CARD_FLEX_GRID.TWO_CARDS,
    3: CARD_FLEX_GRID.THREE_CARDS,
  }
  const cardWidth = styleSet[filteredList.length] || CARD_FLEX_GRID.MORE_THAN_THREE_CARDS
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
  }), [LG, MD, SM, XL, XS])
  if (isError) return <>error</>;

  return (
    <Grid container style={{ flexGrow: 1, width: 'calc(100% - 16.5rem)', overflowY: 'hidden' }}>
      {filteredList.map(
        (promptData) => {
          return (
            <Grid
              item
              key={promptData.id}
              sx={gridStyle}
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
        <Categories tagList={tagList} selectedTags={selectedTags}/>
        <TrendingAuthors />
      </Grid>
    </Grid>
  );
};

export default PromptList;
