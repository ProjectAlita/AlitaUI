import { useMemo } from 'react';
import { useMatch } from 'react-router-dom';
import RouteDefinitions from '@/routes';

const useSearchBar = () => {
  const resultWithPrompts = useMatch({ path: RouteDefinitions.Prompts });
  const resultWithPromptsWithTab = useMatch({ path: RouteDefinitions.PromptsWithTab });
  const isPublicPromptsPage = useMemo(() => resultWithPrompts || resultWithPromptsWithTab, 
    [resultWithPrompts, resultWithPromptsWithTab]);

  const resultWithCollections = useMatch({ path: RouteDefinitions.Collections });
  const resultWithCollectionsWithTab = useMatch({ path: RouteDefinitions.CollectionsWithTab });
  const isPublicCollectionsPage = useMemo(() => resultWithCollections || resultWithCollectionsWithTab, 
    [resultWithCollections, resultWithCollectionsWithTab]);

  const resultWithMyLibrary = useMatch({ path: RouteDefinitions.MyLibrary });
  const resultWithMyLibraryWithTab = useMatch({ path: RouteDefinitions.MyLibraryWithTab });
  const isMyLibraryPage = useMemo(() => resultWithMyLibrary || resultWithMyLibraryWithTab, 
    [resultWithMyLibrary, resultWithMyLibraryWithTab]);

  const resultWithUserPublic = useMatch({ path: RouteDefinitions.UserPublic });
  const resultWithUserPublicWithTab = useMatch({ path: RouteDefinitions.UserPublicWithTab });
  const isUserPublicPage = useMemo(() => resultWithUserPublic || resultWithUserPublicWithTab, 
    [resultWithUserPublic, resultWithUserPublicWithTab]);

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
