import { SearchParams } from '@/common/constants';
import { useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const useChangeName = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {pathname, state: locationState} = useLocation();
  const nameParam = searchParams.get(SearchParams.Name);

  const handleChangeName = useCallback((newName) => {
    if (newName !== nameParam) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(SearchParams.Name);
      newSearchParams.append(SearchParams.Name, newName);

      const newRouteStack = locationState.routeStack.slice();
      const last = newRouteStack.length - 1
      newRouteStack[last] = { ...newRouteStack[last], breadCrumb: newName };
      
      navigate({
        pathname,
        search: newSearchParams.toString()
      }, {
        replace: true,
        state: {
          ...locationState,
          routeStack: newRouteStack
        }
      })
    }
  }, [locationState, nameParam, navigate, pathname, searchParams])

  return handleChangeName;
}

export default useChangeName;