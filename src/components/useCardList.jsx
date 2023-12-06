import PromptCard from '@/components/Card.jsx';
import * as React from 'react';

const useCardList = (viewMode) => {
  const PAGE_SIZE = 20;

  const renderCard = React.useCallback(
    (cardData, cardType) => {
      return (
        <PromptCard data={cardData} viewMode={viewMode} type={cardType}/>
      );
    },
    [viewMode],
  );

  return {
    renderCard,
    PAGE_SIZE,
  };
};

export default useCardList;