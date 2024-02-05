import { ViewMode } from '@/common/constants';
import AuthorInformation from '@/components/AuthorInformation';
import Categories from '@/components/Categories';
import { useViewMode } from '@/pages/hooks';
import { rightPanelStyle, tagsStyle } from './CommonStyles';
import ProjectSelect from './ProjectSelect';
import useQueryTrendingAuthor from './useQueryTrendingAuthor';

export default function RightPanel({ tagList }) {
  const { isLoadingAuthor } = useQueryTrendingAuthor();
  const viewMode = useViewMode();
  return (
    <div style={rightPanelStyle}>
      {
        viewMode === ViewMode.Owner && <ProjectSelect />
      }
      <Categories tagList={tagList} title='Tags' style={tagsStyle} />
      <AuthorInformation isLoading={isLoadingAuthor} />
    </div>
  )
}