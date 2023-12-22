import { NAV_BAR_HEIGHT, PromptsTabs } from "@/common/constants";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { gaInit } from "./GA";
import NavBar from './components/NavBar.jsx';
import CollectionDetail from './pages/Collections/CollectionDetail';
import Collections from './pages/Collections/Collections';
import CreateCollection from './pages/Collections/CreateCollection';
import CreatePrompt from "./pages/CreatePrompt.jsx";
import Prompts from "./pages/Discover/Prompts.jsx";
import EditPrompt from "./pages/EditPrompt/EditPrompt.jsx";
import ModerationSpace from './pages/ModerationSpace/ModerationSpace';
import MyLibrary from './pages/MyLibrary/MyLibrary';
import Page404 from "./pages/Page404.jsx";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile.jsx";
import RouteDefinitions from './routes';
import {useAuthorDetailsQuery} from "@/api/social.js";

const NavBarPlaceholder = styled('div')(() => ({
  height: NAV_BAR_HEIGHT
}));


gaInit()

const App = () => {
  const location = useLocation();
  // const user = useSelector((state) => state.user);
  // const [userDetails] = useLazyUserDetailsQuery();
  // useEffect(() => {
  //   if (!user.id) {
  //     userDetails();
  //   }
  // }, [user, userDetails])
  useAuthorDetailsQuery()
  
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
                <Route index element={<Navigate to={`${RouteDefinitions.Prompts}/${PromptsTabs[1]}`} replace />} />
                <Route path={RouteDefinitions.Profile} element={<UserProfile />} />
                <Route path={RouteDefinitions.Prompts} element={<Prompts />} />
                <Route path={RouteDefinitions.PromptsWithTab} element={<Prompts />} />
                <Route path={RouteDefinitions.MyLibrary} element={< MyLibrary />} />
                <Route path={RouteDefinitions.MyLibraryWithTab} element={< MyLibrary />} />
                <Route path={RouteDefinitions.Collections} element={<Collections />} />
                <Route path={RouteDefinitions.CollectionsWithTab} element={<Collections />} />
                <Route path={RouteDefinitions.CreateCollection} element={<CreateCollection />} />
                <Route path={RouteDefinitions.CollectionDetail} element={<CollectionDetail />} />
                <Route path={RouteDefinitions.MyLibraryCollectionDetail} element={<CollectionDetail />} />
                <Route path={RouteDefinitions.CreatePrompt} element={<CreatePrompt />} />
                <Route path={RouteDefinitions.ViewPrompt} element={<EditPrompt />} />
                <Route path={RouteDefinitions.ViewPromptVersion} element={<EditPrompt />} />
                <Route path={RouteDefinitions.EditPrompt} element={<EditPrompt />} />
                <Route path={RouteDefinitions.EditPromptVersion} element={<EditPrompt />} />
                <Route path={RouteDefinitions.MyLibraryCollectionPromptDetail} element={<EditPrompt />} />
                <Route path={RouteDefinitions.MyLibraryCollectionPromptVersionDetail} element={<EditPrompt />} />
                <Route path={RouteDefinitions.Settings} element={<Settings />} />
                <Route path={RouteDefinitions.ModerationSpace} element={<ModerationSpace />} />
                <Route path={RouteDefinitions.ModerationSpacePrompt} element={<EditPrompt />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </Box>
          </>
        }
      />

      <Route path="*" element={<Page404 />} />
    </Routes>
  )
}

export default App
