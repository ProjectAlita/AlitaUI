import { getInitials, stringToColor } from '@/common/utils';
import styled from '@emotion/styled';
import { Avatar } from '@mui/material';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  isValidElement,
} from 'react';
import useTags from './useTags';

const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      color: 'white',
      fontSize: '0.6rem',
    },
    children: `${getInitials(name)}`,
  };
};

const StyledPopoverContainer = styled(Popover)(({ theme }) => ({
  borderRadius: '0.5rem',
  '& > div': {
    border: `1px solid ${theme.palette.border.lines}`,
  },
  '& ul': {
    padding: '0',
  },
}));

const StyledPopoverItem = styled(ListItem)(() => ({
  padding: '.5rem 1rem',
}));

const StyledAuthorPopoverItem = styled('div')(() => ({
  cursor: 'pointer',
  caretColor: 'transparent',
  display: 'flex',
  padding: '0',
  '&:hover': {
    color: 'white'
  }
}));

const StyledCategoryPopoverItem = styled('div')(() => ({
  cursor: 'pointer',
  caretColor: 'transparent',
  display: 'flex',
  padding: '0',
  '&:hover': {
    color: 'white'
  }
}));

const CardPopover = forwardRef((props, ref) => {
  const { contentList, type } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const { handleClickTag } = useTags();
  const avatarStyle = {
    marginRight: '.5rem',
    padding: '0',
    width: '20px',
    height: '20px',
  };

  useImperativeHandle(ref, () => ({
    handleClick,
  }));

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'card-popover' : undefined;

  return (
    <StyledPopoverContainer
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <List>
        {contentList?.map((content, index) => {
          const contentMap = {
            author: (
              <StyledAuthorPopoverItem>
                <Avatar
                  key={`${content.id || content.name || content}-${index}`}
                  style={{
                    ...avatarStyle,
                  }}
                  {...stringAvatar(content.name)}
                />
                <div>{content.name}</div>
              </StyledAuthorPopoverItem>
            ),
            category: <StyledCategoryPopoverItem onClick={handleClickTag}>{content.name}</StyledCategoryPopoverItem>,
          };
          return (
            <StyledPopoverItem
              key={`${content.id || content.name || content}-${index}`}
            >
              <ListItemText
                component={'div'}
                primary={
                  <Typography component='div' variant='body2'>
                    {isValidElement(content) ? content : contentMap[type]}
                  </Typography>
                }
              />
            </StyledPopoverItem>
          );
        })}
      </List>
    </StyledPopoverContainer>
  );
});

CardPopover.displayName = 'CardPopover';

export default CardPopover;