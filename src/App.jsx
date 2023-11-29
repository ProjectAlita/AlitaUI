import { NAV_BAR_HEIGHT } from "@/common/constants";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { Suspense, lazy, useEffect } from "react";
import ReactGA from "react-ga4";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { gaInit } from "./GA";
import { useUserDetailsQuery } from './api/auth';
import NavBar from './components/NavBar.jsx';
import Discover from "./pages/Discover/Discover.jsx";
import Collections from './pages/Collcetions/Collections';
import  MyLibrary from './pages/MyLibrary/MyLibrary';
import Page404 from "./pages/Page404.jsx";
import CreatePrompt from "./pages/PromptDetail/CreatePrompt.jsx";
import EditPrompt from "./pages/PromptDetail/EditPrompt.jsx";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile.jsx";

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
                <Route index element={<Navigate to="/discover" replace />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/my-library" element={< MyLibrary />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/prompt/create" element={<CreatePrompt />} />
                <Route path="/prompt/:promptId" element={<EditPrompt />} />
                <Route path="/prompt/:promptId/:version" element={<EditPrompt />} />
                <Route path="/settings" element={<Settings />} />
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
