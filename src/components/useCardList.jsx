import PromptCard from '@/components/Card.jsx';
import * as React from 'react';

const useCardList = (viewMode, collectionName) => {
  const PAGE_SIZE = 20;

  const renderCard = React.useCallback(
    (cardData, cardType) => {
      return (
        <PromptCard data={cardData} viewMode={viewMode} type={cardType} collectionName={collectionName}/>
      );
    },
    [collectionName, viewMode],
  );

  return {
    renderCard,
    PAGE_SIZE,
  };
};

export default useCardList;