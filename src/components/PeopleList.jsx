import { Skeleton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useMemo } from "react";

import Person from "@/components/Icons/Person";
import { useNavigateToAuthorPublicPage } from '@/components/useCardNavigate';

const avatarSize = 32; 
const StyledAvatar = styled(Avatar)(() => ({
  width: avatarSize,
  height: avatarSize,
  marginRight: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem',
  fontSize: '1rem'
}));

const SkeletonContainer = styled('div')(() => ({
  display: 'flex', 
  flexWrap: 'wrap', 
  flexDirection: 'row'
}));

const ItemContainer = styled('div')(() => ({
  width:'100%', 
  display: 'flex', 
  alignItems:'center',
  marginBottom: '8px',
  cursor: 'pointer',
}));

const LIST_OF_ITEMS_LIMIT = 5;

const PeopleList = ({ title, people, isSuccess, isError, isLoading }) => {
  const { navigateToAuthorPublicPage } = useNavigateToAuthorPublicPage();

  const successContent = useMemo(() => (
    people.length > 0 ?
    people?.slice(0, LIST_OF_ITEMS_LIMIT)
      .map(({ id, avatar, name, email }) => {
        const displayName = name || email || 'unknown';
        return (
          <ItemContainer key={id} onClick={navigateToAuthorPublicPage(id, name)}>
            <StyledAvatar alt={displayName}>
              {avatar ? <img width={avatarSize} src={avatar} alt={displayName} /> : <Person fontSize={'16px'} />}
            </StyledAvatar>
            <Typography component="span" variant="caption">
              {displayName}
            </Typography>
          </ItemContainer>
        )
      }) :
      <Typography variant={'body2'}>None.</Typography>
  ), [navigateToAuthorPublicPage, people]);

  return (
    <div style={{ marginBottom: '14px'}}>
      <Typography 
        component='div' 
        variant='labelMedium' 
        sx={{ mb: 2 }}
      >
        {title}
      </Typography>
      {
        isLoading &&
          <SkeletonContainer>
            {
              Array.from({ length: 5 }).map((_, index) => 
              <ItemContainer key={index}>
                <Skeleton variant="circular">
                  <Avatar sx={{ width: avatarSize, height: avatarSize }}/>
                </Skeleton>
                <Skeleton variant='waved' height='1rem' width='100%' sx={{ marginLeft:'1rem' }}  />
              </ItemContainer>
              )
            }
          </SkeletonContainer>
      }

      {
        isSuccess && successContent
      }

      {
        isError && <Typography variant={'body2'}>Failed to load.</Typography>
      }
    </div>
  );
}

export default PeopleList;