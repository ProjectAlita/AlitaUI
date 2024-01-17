import PromptCard from '@/components/Card.jsx';
import * as React from 'react';

const useCardList = (viewMode, collectionName = '') => {
  const PAGE_SIZE = 20;

  const renderCard = React.useCallback(
    (cardData, cardType, index, dynamic) => {
      return cardData?.metaOnly ? {
        viewMode: viewMode,
        collectionName: collectionName,
      } : (
        <PromptCard
          data={cardData}
          viewMode={viewMode}
          type={cardType}
          index={index}
          collectionName={collectionName}
          dynamic={dynamic}
          pageSize={PAGE_SIZE}
        />
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