import { useTrendingAuthorsListQuery } from "@/api/trendingAuthor";
import { PUBLIC_PROJECT_ID } from '@/common/constants';
import { useSelector } from "react-redux";
import PeopleList from '@/components/PeopleList';

const TrendingAuthors = () => {
  const { trendingAuthorsList = [] } = useSelector(state => state.trendingAuthor);
  const { isSuccess, isError, isLoading } = useTrendingAuthorsListQuery(PUBLIC_PROJECT_ID);
  return (
    <PeopleList
      title={'Trending Authors'}
      people={trendingAuthorsList}
      isSuccess={isSuccess}
      isError={isError}
      isLoading={isLoading}
    />
  );
}

export default TrendingAuthors;