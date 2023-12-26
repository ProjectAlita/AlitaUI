import { useMemo } from 'react';
import { useMatch } from 'react-router-dom';
import RouteDefinitions from '@/routes';

const useSearchBar = () => {
  const resultWithPrompts = useMatch({ path: RouteDefinitions.Prompts });
  const resultWithPromptsWithTab = useMatch({ path: RouteDefinitions.PromptsWithTab });
  const resultWithCollections = useMatch({ path: RouteDefinitions.Collections });
  const resultWithCollectionsWithTab = useMatch({ path: RouteDefinitions.CollectionsWithTab });
  const resultWithMyLibrary = useMatch({ path: RouteDefinitions.MyLibrary });
  const resultWithMyLibraryWithTab = useMatch({ path: RouteDefinitions.MyLibraryWithTab }); 
  const showSearchBar = useMemo(() => {
    return resultWithPrompts ||
      resultWithPromptsWithTab || 
      resultWithCollections ||
      resultWithCollectionsWithTab ||
      resultWithMyLibrary ||
      resultWithMyLibraryWithTab;
  }, [
    resultWithCollections, 
    resultWithCollectionsWithTab, 
    resultWithPrompts, 
    resultWithPromptsWithTab,
    resultWithMyLibrary,
    resultWithMyLibraryWithTab
  ]);
  return { showSearchBar }
}


export default useSearchBar;
