import { useLazyAuthorDetailsQuery } from "@/api/social.js";
import {
  CollectionTabs,
  ModerationTabs,
  MyLibraryTabs,
  PERMISSION_GROUPS,
  PERSONAL_SPACE_PERIOD_FOR_NEW_USER,
  PromptsTabs,
  SettingsPersonalProjectTabs,
  DatasourcesTabs,
} from "@/common/constants";
import FeedbackDialog from "@/components/FeedbackDialog.jsx";
import CreateDeployment from '@/pages/Settings/CreateDeployment';
import CreatePersonalToken from '@/pages/Settings/CreatePersonalToken';
import Settings from '@/pages/Settings/Settings';
import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import ReactGA from "react-ga4";
import { useSelector } from "react-redux";
import {
  Navigate, Route, RouterProvider, Routes, createBrowserRouter,
  createRoutesFromElements,
  useLocation
} from "react-router-dom";
import { gaInit } from "./GA";
import { useLazyPermissionListQuery } from "./api/auth";
import NavBar from './components/NavBar.jsx';
import UnsavedDialog from './components/UnsavedDialog';
import CollectionDetail from './pages/Collections/CollectionDetail';
import Collections from './pages/Collections/Collections';
import CreateCollection from './pages/Collections/CreateCollection';
import EditCollection from './pages/Collections/EditCollection';
import CreatePrompt from "./pages/Prompts/CreatePrompt.jsx";
import Prompts from "./pages/Prompts/Prompts.jsx";
import EditPrompt from "./pages/Prompts/EditPrompt.jsx";
import LoadingPage from './pages/LoadingPage';
import ModeSwitch from "./pages/ModeSwitch";
import ModerationSpace from './pages/ModerationSpace/ModerationSpace';
import MyLibrary from './pages/MyLibrary/MyLibrary';
import Page404 from "./pages/Page404.jsx";
import RouteDefinitions, { getBasename } from './routes';
import CreateDatasource from './pages/DataSources/CreateDatasource';
import Datesources from './pages/DataSources/DataSources';
import EditDatasource from "@/pages/DataSources/EditDatasource.jsx";


gaInit()

let userInfoTimer = undefined;

const ProtectedRoutes = () => {
  const location = useLocation();
  useEffect(() => {
    ReactGA.isInitialized && ReactGA.send({ hitType: 'pageview', page: decodeURI(location.pathname) + location.search })
    // eslint-disable-next-line no-console
    console.log('Google analytics init:', ReactGA.isInitialized)
  }, [location])

  const user = useSelector(state => state.user);
  const [getUserDetails] = useLazyAuthorDetailsQuery();
  const [getUserPermissions] = useLazyPermissionListQuery();
  useEffect(() => {
    if (!user.id) {
      getUserDetails();
    }
    if (!user.permissions || !user.permissions.length) {
      getUserPermissions();
    }
  }, [getUserPermissions, user, getUserDetails]);

  useEffect(() => {
    if (!user.personal_project_id) {
      getUserDetails();
    }
  }, [location, user.personal_project_id, getUserDetails]);

  useEffect(() => {
    if (!user.personal_project_id && !userInfoTimer) {
      userInfoTimer = setTimeout(() => {
        getUserDetails();
      }, PERSONAL_SPACE_PERIOD_FOR_NEW_USER);
    }
  }, [user.personal_project_id, getUserDetails]);

  useEffect(() => {
    if (user.personal_project_id && userInfoTimer) {
      clearTimeout(userInfoTimer);
      userInfoTimer = undefined;
    }
  }, [user.personal_project_id]);

  const { permissions } = user;

  const ProtectedRoute = ({ requiredPermissions, children }) => {
    if (!requiredPermissions) return children;
    if (!permissions) return <LoadingPage />

    const hasPermission = requiredPermissions.some((p) => permissions?.includes(p));

    if (!hasPermission) {
      return <Navigate to={`${RouteDefinitions.Prompts}/${PromptsTabs[0]}`} replace />;
    }

    return children;
  };

  const getIndexElement = useCallback((relativePath) => {
    return <Navigate to={relativePath + location.search} state={location.state} replace />;
  }, [location.search, location.state]);

  const routes = useMemo(() => [
    /* data sources*/
    { path: RouteDefinitions.DataSources, element: getIndexElement(DatasourcesTabs[0]) },
    { path: RouteDefinitions.DataSourcesWithTab, element: <Datesources /> },
    { path: RouteDefinitions.CreateDatasource, element: <CreateDatasource /> },
    { path: RouteDefinitions.DataSourcesDetail, element: <EditDatasource /> },
    // my library datasource
    { path: RouteDefinitions.MyDatasourceDetails, element: <EditDatasource /> },
    // user public datasource
    { path: RouteDefinitions.UserPublicDatasourceDetail, element: <EditDatasource /> },

    { path: RouteDefinitions.Settings, element: getIndexElement(SettingsPersonalProjectTabs[0]) },
    { path: RouteDefinitions.SettingsWithTab, element: <Settings /> },
    { path: RouteDefinitions.CreatePersonalToken, element: <CreatePersonalToken /> },
    { path: RouteDefinitions.CreateDeployment, element: <CreateDeployment /> },
    { path: RouteDefinitions.EditDeployment, element: <CreateDeployment /> },
    { path: RouteDefinitions.ModeSwitch, element: <ModeSwitch /> },

    /* prompt detail routes start*/
    { path: RouteDefinitions.CreatePrompt, element: <CreatePrompt /> },

    // my library prompt
    { path: RouteDefinitions.EditPrompt, element: <EditPrompt /> },

    // moderation prompt:
    { path: RouteDefinitions.ModerationSpacePrompt, element: <EditPrompt />, requiredPermissions: PERMISSION_GROUPS.moderation },

    // moderation collection:
    { path: RouteDefinitions.ModerationSpaceCollection, element: <CollectionDetail />, requiredPermissions: PERMISSION_GROUPS.moderation },

    // public prompt prompt
    { path: RouteDefinitions.ViewPrompt, element: <EditPrompt /> },

    // my library collection prompt 
    { path: RouteDefinitions.MyLibraryCollectionPromptDetail, element: <EditPrompt /> },

    // public collection prompt 
    { path: RouteDefinitions.CollectionPromptDetail, element: <EditPrompt /> },

    // user public prompt
    { path: RouteDefinitions.UserPublicPrompts, element: <EditPrompt /> },

    // user public collection prompt
    { path: RouteDefinitions.UserPublicCollectionPromptDetail, element: <EditPrompt /> },
    /* prompt detail routes end*/

    // left drawer menu pages
    { path: RouteDefinitions.Prompts, element: getIndexElement(PromptsTabs[0]) },
    { path: RouteDefinitions.PromptsWithTab, element: <Prompts /> },
    { path: RouteDefinitions.Collections, element: getIndexElement(CollectionTabs[0]) },
    { path: RouteDefinitions.CollectionsWithTab, element: <Collections /> },
    { path: RouteDefinitions.ModerationSpace, element: getIndexElement(ModerationTabs[0]), requiredPermissions: PERMISSION_GROUPS.moderation },
    { path: RouteDefinitions.MyLibrary, element: getIndexElement(MyLibraryTabs[0]) },
    { path: RouteDefinitions.MyLibraryWithTab, element: < MyLibrary /> },
    { path: RouteDefinitions.ModerationSpaceWithTab, element: <ModerationSpace />, requiredPermissions: PERMISSION_GROUPS.moderation },

    // user public page
    { path: RouteDefinitions.UserPublic, element: getIndexElement(MyLibraryTabs[0]) },
    { path: RouteDefinitions.UserPublicWithTab, element: < MyLibrary publicView={true} /> },

    // Collection detail routes
    { path: RouteDefinitions.CreateCollection, element: <CreateCollection /> },
    { path: RouteDefinitions.EditCollection, element: <EditCollection /> },
    { path: RouteDefinitions.CollectionDetail, element: <CollectionDetail /> },
    { path: RouteDefinitions.MyLibraryCollectionDetail, element: <CollectionDetail /> },
    { path: RouteDefinitions.UserPublicCollectionDetail, element: <CollectionDetail /> },
  ], [getIndexElement]);

  return <Routes>
    <Route index element={<Navigate to={`${RouteDefinitions.Prompts}/${PromptsTabs[0]}`} replace />} />
    {
      routes.map(({ path, element, requiredPermissions }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute requiredPermissions={requiredPermissions}>
              {element}
            </ProtectedRoute>
          }>
          {path.endsWith('/:promptId') && <Route path=':version' element={<></>} />}
        </Route>
      ))
    }
    <Route path="*" element={<Page404 />} />
  </Routes>
};

const App = () => {
  const basename = getBasename();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/*"
        element={
          <>
            <NavBar />
            <UnsavedDialog />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
              <ProtectedRoutes />
            </Box>
            <FeedbackDialog />
          </>
        }>
        <Route path="*" element={<Page404 />} />
      </Route>
    ),
    { basename }
  );
  return <RouterProvider router={router} />;
}

export default App
