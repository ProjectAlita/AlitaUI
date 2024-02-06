import { ViewMode } from '@/common/constants';
import AuthorInformation from '@/components/AuthorInformation';
import Categories from '@/components/Categories';
import { useSelectedProjectId, useViewMode } from '@/pages/hooks';
import { useSelector } from 'react-redux';
import { rightPanelStyle, tagsStyle } from './CommonStyles';
import ProjectSelect from './ProjectSelect';
import useQueryTrendingAuthor from './useQueryTrendingAuthor';

export default function RightPanel({ tagList }) {
  const { isLoadingAuthor } = useQueryTrendingAuthor();
  const viewMode = useViewMode();
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const selectedProjectId = useSelectedProjectId();
  return (
    <div style={rightPanelStyle}>
      {
        viewMode === ViewMode.Owner && <ProjectSelect />
      }
      <Categories tagList={tagList} title='Tags' style={tagsStyle} />
      {
        selectedProjectId === privateProjectId ?
          <AuthorInformation isLoading={isLoadingAuthor} /> :
          null
      }
    </div>
  )
}