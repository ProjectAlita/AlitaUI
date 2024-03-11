import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as applicationsActions } from '@/slices/applications';
import { CollectionStatus, PromptsTabs } from '@/common/constants';
import { useParams } from 'react-router-dom';

export default function useApplicationDispatchQueryParams(page, selectedTagIds, query, trendRange = undefined) {
  const dispatch = useDispatch();
  const queryParams = useSelector(state => state.collections.queryParams);
  const { tab } = useParams();

  useEffect(() => {
    const newQueryParams = {
      page,
      params: {
        statuses: CollectionStatus.Published,
        tags: selectedTagIds,
        sort_by: 'created_at',
        sort_order: 'desc',
        query,
        my_liked: tab === PromptsTabs[1] ? true : undefined,
        trend_start_period: tab === PromptsTabs[2] ? trendRange : undefined,
      }
    }
    
    if (JSON.stringify(queryParams) !== JSON.stringify(newQueryParams)) {
      dispatch(applicationsActions.setQueryParams(newQueryParams));
    }
  }, [dispatch, page, query, queryParams, selectedTagIds, tab, trendRange]);
}
