import { useLazyAuthorDetailsQuery } from "@/api/social.js";
import { DEV, NAV_BAR_HEIGHT, PERMISSION_GROUPS, PromptsTabs, VITE_BASE_URI } from "@/common/constants";
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
import { usePermissionListQuery } from "./api/auth";
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
import RouteDefinitions from './routes';


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
  useEffect(() => {
    if (!user.id) {
      userDetails();
    }
  }, [user, userDetails])
  usePermissionListQuery();
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
    { path: RouteDefinitions.Prompts, element: <Prompts /> },
    { path: RouteDefinitions.PromptsWithTab, element: <Prompts /> },
    { path: RouteDefinitions.MyLibrary, element: < MyLibrary /> },
    { path: RouteDefinitions.MyLibraryWithTab, element: < MyLibrary /> },
    { path: RouteDefinitions.UserPublic, element: < MyLibrary /> },
    { path: RouteDefinitions.UserPublicWithTab, element: < MyLibrary /> },
    { path: RouteDefinitions.UserPublicCollectionDetail, element: <CollectionDetail /> },
    { path: RouteDefinitions.UserPublicCollectionPromptDetail, element: <EditPrompt /> },
    { path: RouteDefinitions.UserPublicPrompts, element: <EditPrompt /> },
    { path: RouteDefinitions.UserPublicPromptsVersionDetail, element: <EditPrompt /> },
    { path: RouteDefinitions.Collections, element: <Collections /> },
    { path: RouteDefinitions.CollectionsWithTab, element: <Collections /> },
    { path: RouteDefinitions.CreateCollection, element: <CreateCollection /> },
    { path: RouteDefinitions.EditCollection, element: <EditCollection /> },
    { path: RouteDefinitions.CollectionDetail, element: <CollectionDetail /> },
    { path: RouteDefinitions.MyLibraryCollectionDetail, element: <CollectionDetail /> },
    { path: RouteDefinitions.CreatePrompt, element: <CreatePrompt /> },
    { path: RouteDefinitions.ViewPrompt, element: <EditPrompt /> },
    { path: RouteDefinitions.ViewPromptVersion, element: <EditPrompt /> },
    { path: RouteDefinitions.EditPrompt, element: <EditPrompt /> },
    { path: RouteDefinitions.EditPromptVersion, element: <EditPrompt /> },
    { path: RouteDefinitions.MyLibraryCollectionPromptDetail, element: <EditPrompt /> },
    { path: RouteDefinitions.MyLibraryCollectionPromptVersionDetail, element: <EditPrompt /> },
    { path: RouteDefinitions.Settings, element: <Settings /> },
    { path: RouteDefinitions.ModerationSpace, element: <ModerationSpace />, requiredPermissions: PERMISSION_GROUPS.moderation },
    { path: RouteDefinitions.ModerationSpacePrompt, element: <EditPrompt />, requiredPermissions: PERMISSION_GROUPS.moderation },
    { path: RouteDefinitions.ModerationSpacePromptVersion, element: <EditPrompt />, requiredPermissions: PERMISSION_GROUPS.moderation },
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
          }
        />
      ))
    }
    <Route path="*" element={<Page404 />} />
  </Routes>
};

const App = () => {
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
    { basename: DEV ? '' : `/${VITE_BASE_URI}` }
  );
  return <RouterProvider router={router} />;
}

export default App
