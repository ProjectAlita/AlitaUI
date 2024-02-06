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

export default function ProjectSelect({ customSelectedColor }) {

  const theme = useTheme();
  const dispatch = useDispatch();

  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const { project } = useSelector(state => state.settings);
  const projectName = useMemo(() => project?.name || 'Personal',
    [project?.name]);
  const projectId = useMemo(() => project?.id || privateProjectId,
    [project, privateProjectId]);

  const { data = [] } = useProjectListQuery({}, { skip: !projectId });

  const projectOptions = useMemo(() => [
    { label: 'Personal', value: privateProjectId },
    ...data.filter(item => ![privateProjectId, parseInt(PUBLIC_PROJECT_ID)].includes(item.owner_id))
      .map(item => ({ label: item.name, value: item.id })),
  ], [data, privateProjectId]);

  const { isMyLibraryPage } = useSearchBar();
  const viewMode = useViewMode();
  const navigate = useNavigate()
  const location = useLocation();

  const setBreadCrumb = useCallback((name) => {
    if (!name || projectOptions.length <= 1) return;

    const suffix = name ? (' - ' + name) : '';
    const breadCrumb = PathSessionMap[RouteDefinitions.MyLibrary] + suffix
    const needChange = location.state?.routeStack?.[0]?.breadCrumb !== breadCrumb;
    if (!needChange) {
      return;
    }

    if (isMyLibraryPage && viewMode === ViewMode.Owner) {
      const pagePath = location.pathname + location.search
      navigate(pagePath, {
        replace: true,
        state: {
          routeStack: [{
            breadCrumb,
            viewMode,
            pagePath
          }],
        }
      });
    }
  }, [isMyLibraryPage, location.pathname, location.search, location.state?.routeStack, navigate, projectOptions.length, viewMode]);

  const onChangeProject = useCallback((id) => {
    const name = projectOptions.find(item => item.value === id)?.label;
    dispatch(settingsActions.setProject({
      id,
      name
    }));
  }, [dispatch, projectOptions]);

  useEffect(() => {
    setBreadCrumb(projectName);
  }, [setBreadCrumb, projectName]);

  if (projectOptions.length <= 1) return null;

  return <StyledContainer>
    <SelectContainer>
      <SingleSelect
        onValueChange={onChangeProject}
        value={projectId}
        displayEmpty
        options={projectOptions}
        customSelectedColor={`${customSelectedColor || theme.palette.text.primary} !important`}
        customSelectedFontSize={'0.875rem'}
      />
    </SelectContainer>
  </StyledContainer>
}