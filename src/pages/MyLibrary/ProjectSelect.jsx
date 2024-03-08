import { PUBLIC_PROJECT_ID, ViewMode } from "@/common/constants";
import SingleSelect from "@/components/SingleSelect";
import useSearchBar from "@/components/useSearchBar";
import RouteDefinitions, { PathSessionMap } from "@/routes";
import { actions as settingsActions } from "@/slices/settings";
import { Box, useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useViewMode } from "../hooks";
import { useProjectListQuery } from "@/api/project";

const SelectContainer = styled(Box)(() => (`
  display: flex;
  margin-left: 0.5rem;
  z-index: 1001;
  display: flex;
  align-items: flex-end;
`));

const StyledContainer = styled(Box)(() => ({
  display: 'flex',
  boxSizing: 'border-box',
  justifyContent: 'flex-end',
  alignItems: 'baseline',
  paddingRight: '0',
  height: '40px',
}))

export const ProjectSelectShowMode = {
  CompactMode: 'CompactMode',
  NormalMode: 'NormalMode',
}

export default function ProjectSelect({
  customSelectedColor,
  showMode = ProjectSelectShowMode.CompactMode,
  label,
  sx,
  selectSX,
  labelSX,
  inputSX,
  disabled = false,
  required,
  forLocalUsage = false,
  value = {},
  onChange,
}) {

  const theme = useTheme();
  const dispatch = useDispatch();

  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const { project } = useSelector(state => state.settings);
  const selectedProject = useMemo(() => {
    if (forLocalUsage) {
      return value.id ? { id: value.id, name: value.name, } : { id: privateProjectId, name: 'Private' };
    } else {
      return project?.id ? project : ({ id: privateProjectId, name: 'Private' });
    }
  }, [forLocalUsage, privateProjectId, project, value.id, value.name])

  const { data = [] } = useProjectListQuery({}, { skip: !selectedProject?.id });

  const getProjectName = useCallback(item => {
    if (!item) return '';
    if (item.id === privateProjectId) return 'Private';
    if (item.id === parseInt(PUBLIC_PROJECT_ID)) return 'Public';
    return item.name
  }, [privateProjectId]);

  const projectOptions = useMemo(() => [
    ...data.map(item => ({
      label: getProjectName(item),
      value: item.id
    }))
  ], [data, getProjectName]);

  const { isMyLibraryPage } = useSearchBar();
  const viewMode = useViewMode();
  const navigate = useNavigate()
  const location = useLocation();
  const isCreatingNow = useMemo(() => location.pathname.includes('/create'), [location.pathname]);

  const setBreadCrumb = useCallback((name) => {
    if (!name || projectOptions.length <= 1) return;

    if (isMyLibraryPage && viewMode === ViewMode.Owner || isCreatingNow) {
      const suffix = name ? (' - ' + name) : '';
      const breadCrumb = PathSessionMap[RouteDefinitions.MyLibrary] + suffix
      const needChange = location.state?.routeStack?.[0]?.breadCrumb !== breadCrumb;

      if (!needChange) {
        return;
      }
      const pagePath = location.pathname + location.search
      const newRouteStack = location.state?.routeStack || [{
        breadCrumb,
        viewMode,
        pagePath
      }];
      newRouteStack[0].breadCrumb = breadCrumb
      navigate(pagePath, {
        replace: true,
        state: {
          routeStack: newRouteStack,
        }
      });
    }
  }, [isCreatingNow, isMyLibraryPage, location.pathname, location.search, location.state?.routeStack, navigate, projectOptions.length, viewMode]);

  const onChangeProject = useCallback((id) => {
    const name = projectOptions.find(item => item.value === id)?.label;
    if (forLocalUsage) {
      onChange({ id, name })
    } else {
      dispatch(settingsActions.setProject({
        id,
        name
      }));
    }
  }, [dispatch, forLocalUsage, onChange, projectOptions]);

  useEffect(() => {
    if (!forLocalUsage) {
      setBreadCrumb(selectedProject.name);
    }
  }, [setBreadCrumb, selectedProject.name, forLocalUsage]);

  if (projectOptions.length <= 1 && showMode === ProjectSelectShowMode.CompactMode) return null;

  return showMode === ProjectSelectShowMode.CompactMode ? <StyledContainer sx={sx}>
    <SelectContainer>
      <SingleSelect
        onValueChange={onChangeProject}
        value={selectedProject.id}
        displayEmpty={false}
        options={projectOptions}
        customSelectedColor={`${customSelectedColor || theme.palette.text.primary} !important`}
        customSelectedFontSize={'0.875rem'}
        sx={selectSX}
        labelSX={labelSX}
        inputSX={inputSX}
        disabled={disabled}
        required={required}
      />
    </SelectContainer>
  </StyledContainer>
    : <SingleSelect
      label={label}
      onValueChange={onChangeProject}
      value={selectedProject.id}
      displayEmpty={false}
      options={projectOptions}
      customSelectedColor={`${customSelectedColor || theme.palette.text.primary} !important`}
      customSelectedFontSize={'0.875rem'}
      sx={selectSX}
      labelSX={labelSX}
      inputSX={inputSX}
      disabled={disabled}
      required={required}
    />
}