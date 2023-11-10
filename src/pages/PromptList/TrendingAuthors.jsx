import { useTrendingAuthorsListQuery } from "@/api/mock";
import { SOURCE_PROJECT_ID } from '@/common/constants';
import { renderStatusComponent } from '@/common/utils';
import StyledLabel from "@/components/StyledLabel";
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useSelector } from "react-redux";

import Person from "@/components/Icons/Person";

const Label = styled(StyledLabel)(({theme}) => ({
  marginBottom: theme.spacing(2)
}));

const StyledAvatar = styled(Avatar)(() => ({
  width: 32,
  height: 32,
  marginRight: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem',
  fontSize: '1rem'
}));

const TrendingAuthors = () => {
  const {trendingAuthorsList} = useSelector(state => state.mock);
  const {isSuccess, isError, isLoading} = useTrendingAuthorsListQuery(SOURCE_PROJECT_ID);

  const successContent = (
    trendingAuthorsList.length > 0 ?
    trendingAuthorsList.map(({id, avatar, name, email}) => {
      const displayName = name || email || 'unknown';
      return (
        <div key={id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <StyledAvatar alt={displayName}>
            { avatar ? <img src={avatar} alt={displayName} /> : <Person fontSize={'16px'} /> }
          </StyledAvatar>
          <Typography component="span" variant="caption">
            {displayName}
          </Typography>
        </div>
      )
    }) : 
    <Typography variant={'body2'}>None.</Typography>
  );

  return (
    <div>
      <div>
        <Label>Trending Authors</Label>
      </div>
        {renderStatusComponent({isLoading, isSuccess, isError, successContent})}
    </div>
  );
}

export default TrendingAuthors;