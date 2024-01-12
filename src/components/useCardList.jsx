import PromptCard from '@/components/Card.jsx';
import * as React from 'react';

const useCardList = (viewMode, collectionName = '', trendRange = '') => {
  const PAGE_SIZE = 20;

  const renderCard = React.useCallback(
    (cardData, cardType, index, dynamic) => {
      return (
        <PromptCard
          data={cardData}
          viewMode={viewMode}
          type={cardType}
          index={index}
          collectionName={collectionName}
          dynamic={dynamic}
          pageSize={PAGE_SIZE}
          trendRange={trendRange}
        />
      );
    },
    [collectionName, trendRange, viewMode],
  );

  return {
    renderCard,
    PAGE_SIZE,
  };
};

export default useCardList;