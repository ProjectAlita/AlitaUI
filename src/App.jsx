import { useLazyAuthorDetailsQuery } from "@/api/social.js";
import { NAV_BAR_HEIGHT, PERMISSION_GROUPS, PromptsTabs } from "@/common/constants";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { useEffect } from "react";
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
import CreatePrompt from "./pages/CreatePrompt.jsx";
import Prompts from "./pages/Discover/Prompts.jsx";
import EditPrompt from "./pages/EditPrompt/EditPrompt.jsx";
import LoadingPage from './pages/LoadingPage';
import ModerationSpace from './pages/ModerationSpace/ModerationSpace';
import MyLibrary from './pages/MyLibrary/MyLibrary';
import Page404 from "./pages/Page404.jsx";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile.jsx";
import RouteDefinitions, { getBasename } from './routes';


const NavBarPlaceholder = styled('div')(() => ({
  height: NAV_BAR_HEIGHT
}));


gaInit()

const ProtectedRoutes = () => {
  const location = useLocation();
  useEffect(() => {
    ReactGA.isInitialized && ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })
    // eslint-disable-next-line no-console
    console.log('Google analytics init:', ReactGA.isInitialized)
  }, [location])

  const user = useSelector(state => state.user);
  const [userDetails] = useLazyAuthorDetailsQuery();
  const [getUserPermissions] = useLazyPermissionListQuery();
  useEffect(() => {
    if (!user.id) {
      userDetails();
    }
    if (!user.permissions || !user.permissions.length) {
      getUserPermissions();
    }
  }, [getUserPermissions, user, userDetails])

  const { permissions } = user;

  const ProtectedRoute = ({ requiredPermissions, children }) => {
    if (!requiredPermissions) return children;
    if (!permissions) return <LoadingPage />

    const hasPermission = requiredPermissions.some((p) => permissions?.includes(p));

    if (!hasPermission) {
      return <Navigate to={`${RouteDefinitions.Prompts}/${PromptsTabs[1]}`} replace />;
    }

    return children;
  };

  const routes = [
    { path: RouteDefinitions.Profile, element: <UserProfile /> },
    { path: RouteDefinitions.Settings, element: <Settings /> },

    /* prompt detail routes start*/
    { path: RouteDefinitions.CreatePrompt, element: <CreatePrompt /> },

    // my library prompt
    { path: RouteDefinitions.EditPrompt, element: <EditPrompt /> },

    // moderation prompt:
    { path: RouteDefinitions.ModerationSpacePrompt, element: <EditPrompt />, requiredPermissions: PERMISSION_GROUPS.moderation },

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
    { path: RouteDefinitions.Prompts, element: <Prompts /> },
    { path: RouteDefinitions.PromptsWithTab, element: <Prompts /> },
    { path: RouteDefinitions.Collections, element: <Collections /> },
    { path: RouteDefinitions.CollectionsWithTab, element: <Collections /> },
    { path: RouteDefinitions.ModerationSpace, element: <ModerationSpace />, requiredPermissions: PERMISSION_GROUPS.moderation },
    { path: RouteDefinitions.MyLibrary, element: < MyLibrary /> },
    { path: RouteDefinitions.MyLibraryWithTab, element: < MyLibrary /> },

    // user public page
    { path: RouteDefinitions.UserPublic, element: < MyLibrary publicView={true}/> },
    { path: RouteDefinitions.UserPublicWithTab, element: < MyLibrary publicView={true}/> },

    // Collection detail routes
    { path: RouteDefinitions.CreateCollection, element: <CreateCollection /> },
    { path: RouteDefinitions.EditCollection, element: <EditCollection /> },
    { path: RouteDefinitions.CollectionDetail, element: <CollectionDetail /> },
    { path: RouteDefinitions.MyLibraryCollectionDetail, element: <CollectionDetail /> },
    { path: RouteDefinitions.UserPublicCollectionDetail, element: <CollectionDetail /> },
  ];

  return <Routes>
    <Route index element={<Navigate to={`${RouteDefinitions.Prompts}/${PromptsTabs[1]}`} replace />} />
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
            <NavBarPlaceholder />
            <UnsavedDialog />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
              <ProtectedRoutes />
            </Box>
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
