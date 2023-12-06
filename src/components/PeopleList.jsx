import StyledLabel from "@/components/StyledLabel";
import { Skeleton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useMemo } from "react";

import Person from "@/components/Icons/Person";

const Label = styled(StyledLabel)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));
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
  marginBottom: '8px'
}));

const PeopleList = ({ title, people, isSuccess, isError, isLoading }) => {
  const successContent = useMemo(() => (
    people.length > 0 ?
    people.map(({ id, avatar, name, email }) => {
        const displayName = name || email || 'unknown';
        return (
          <ItemContainer key={id}>
            <StyledAvatar alt={displayName}>
              {avatar ? <img src={avatar} alt={displayName} /> : <Person fontSize={'16px'} />}
            </StyledAvatar>
            <Typography component="span" variant="caption">
              {displayName}
            </Typography>
          </ItemContainer>
        )
      }) :
      <Typography variant={'body2'}>None.</Typography>
  ), [people]);

  return (
    <div>
      <div>
        <Label>{title}</Label>
      </div>
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