import { renderStatusComponent } from '@/common/utils';
import StyledLabel from "@/components/StyledLabel";
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useMemo } from "react";

import Person from "@/components/Icons/Person";

const Label = styled(StyledLabel)(({ theme }) => ({
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

const PeopleList = ({ title, people, isSuccess, isError, isLoading }) => {
  const successContent = useMemo(() => (
    people.length > 0 ?
    people.map(({ id, avatar, name, email }) => {
        const displayName = name || email || 'unknown';
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <StyledAvatar alt={displayName}>
              {avatar ? <img src={avatar} alt={displayName} /> : <Person fontSize={'16px'} />}
            </StyledAvatar>
            <Typography component="span" variant="caption">
              {displayName}
            </Typography>
          </div>
        )
      }) :
      <Typography variant={'body2'}>None.</Typography>
  ), [people]);

  return (
    <div>
      <div>
        <Label>{title}</Label>
      </div>
      {renderStatusComponent({ isLoading, isSuccess, isError, successContent })}
    </div>
  );
}

export default PeopleList;