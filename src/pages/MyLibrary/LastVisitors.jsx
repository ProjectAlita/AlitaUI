import { useTrendingAuthorsListQuery } from "@/api/mock";
import { SOURCE_PROJECT_ID } from '@/common/constants';
import { useSelector } from "react-redux";
import PeopleList from '@/components/PeopleList';

const LastVisitors = () => {
  const { trendingAuthorsList } = useSelector(state => state.mock);
  const { isSuccess, isError, isLoading } = useTrendingAuthorsListQuery(SOURCE_PROJECT_ID);
  return (
    <PeopleList
      title={'Last Visitors'}
      people={trendingAuthorsList}
      isSuccess={isSuccess}
      isError={isError}
      isLoading={isLoading}
    />
  );
}

export default LastVisitors;