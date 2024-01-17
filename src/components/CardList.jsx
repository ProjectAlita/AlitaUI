import EmptyListBox from '@/components/EmptyListBox';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DataCards from './DataCards';
import DataTable from './DataTable';
import RightPanel from './RightPanel';
import { SearchParams, ViewOptions } from '@/common/constants';

const CardList = (props) => {
  const {
    cardList,
    rightPanelOffset,
    rightPanelContent,
    emptyListPlaceHolder,
    isError,
    headerHeight = '150px',
    ...rest

  } = props;

  const [searchParams] = useSearchParams();
  const isTableView = useMemo(() => searchParams.get(SearchParams.View) === ViewOptions.Table, [searchParams]);
  return (
    <>
      {
        isError &&
        <EmptyListBox emptyListPlaceHolder={emptyListPlaceHolder} headerHeight={headerHeight} showErrorMessage={!!isError} />
      }
      {
        isTableView ?
          <DataTable data={cardList} isFullWidth={!rightPanelContent} {...rest}/>
          :
          <DataCards 
            data={cardList} 
            {...rest} />
      }
      <RightPanel offsetFromTop={rightPanelOffset}>
        {rightPanelContent}
      </RightPanel>
    </>
  );
};

export default CardList;
