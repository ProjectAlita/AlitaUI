import { useMemo } from 'react';
import { useMatch } from 'react-router-dom';
import RouteDefinitions from '@/routes';

const useSearchBar = () => {
  const isPublicPromptsPage = useMatch({ path: RouteDefinitions.PromptsWithTab });
  const isPublicCollectionsPage =  useMatch({ path: RouteDefinitions.CollectionsWithTab });
  const isMyLibraryPage = useMatch({ path: RouteDefinitions.MyLibraryWithTab });
  const isUserPublicPage = useMatch({ path: RouteDefinitions.UserPublicWithTab });

  const showSearchBar = useMemo(() => {
    return isPublicPromptsPage ||
      isPublicCollectionsPage ||
      isMyLibraryPage ||
      isUserPublicPage;
  }, [isPublicPromptsPage, isPublicCollectionsPage, isMyLibraryPage, isUserPublicPage]);
  return { 
    showSearchBar,
    isPublicPromptsPage,
    isPublicCollectionsPage,
    isMyLibraryPage,
    isUserPublicPage,
   }
}


export default useSearchBar;
