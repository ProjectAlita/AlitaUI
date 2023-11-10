import ReactGA from "react-ga4";
import { DEV, VITE_GAID } from "./common/constants.js";

export const gaInit = () => VITE_GAID !== undefined && ReactGA.initialize(VITE_GAID, {testMode: DEV})