import { NAV_BAR_HEIGHT } from "@/common/constants";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { Suspense, lazy, useEffect } from "react";
import ReactGA from "react-ga4";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { gaInit } from "./GA";
import { useUserDetailsQuery } from './api/auth';
import NavBar from './components/NavBar.jsx';
import Prompts from "./pages/Discover/Prompts.jsx";
import Collections from './pages/Collections/Collections';
import CreateCollection from './pages/Collections/CreateCollection';
import  MyLibrary from './pages/MyLibrary/MyLibrary';
import Page404 from "./pages/Page404.jsx";
import CreatePrompt from "./pages/CreatePrompt.jsx";
import EditPrompt from "./pages/EditPrompt/EditPrompt.jsx";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile.jsx";
import RouteDefinitions from './routes';
import CollectionDetail from '@/pages/Collections/CollectionDetail';

const Demo = lazy(() => import("./pages/Demo/Demo.jsx"));

const NavBarPlaceholder = styled('div')(() => ({
  height: NAV_BAR_HEIGHT
}));


gaInit()

const App = () => {
  const location = useLocation();
  useUserDetailsQuery();
  useEffect(() => {
    ReactGA.isInitialized && ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })
    // eslint-disable-next-line no-console
    console.log('Google analytics init:', ReactGA.isInitialized)
  }, [location])

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <>
          <NavBar />
          <NavBarPlaceholder />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
              <Routes>
                <Route index element={<Navigate to={RouteDefinitions.Prompts} replace />} />
                <Route path={RouteDefinitions.Profile} element={<UserProfile />} />
                <Route path={RouteDefinitions.Prompts} element={<Prompts />} />
                <Route path={RouteDefinitions.MyLibrary} element={< MyLibrary />} />
                <Route path={RouteDefinitions.Collections} element={<Collections />} />
                <Route path={RouteDefinitions.CreateCollection} element={<CreateCollection />} />
                <Route path={RouteDefinitions.CollectionDetail} element={<CollectionDetail />} />
                <Route path={RouteDefinitions.CreatePrompt} element={<CreatePrompt />} />
                <Route path={RouteDefinitions.EditPrompt} element={<EditPrompt />} />
                <Route path={RouteDefinitions.EditPromptVersion} element={<EditPrompt />} />
                <Route path={RouteDefinitions.Settings} element={<Settings />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </Box>
          </>
        }
      />
      <Route path="/demo" element={
        <Suspense fallback={<div>Loading Component</div>}>
          <Demo />
        </Suspense>
      } />

      <Route path="*" element={<Page404 />} />
    </Routes>
  )
}

export default App
