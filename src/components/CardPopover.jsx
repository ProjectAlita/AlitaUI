import styled from '@emotion/styled';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {
  forwardRef,
  isValidElement,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import UserAvatar from './UserAvatar';
import useTags from './useTags';
import { useNavigateToAuthorPublicPage } from './useCardNavigate';


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

const StyledCategoryList = styled(List)(() => ({
  overflowY: 'scroll',
  minWidth: '6.3125rem',
  maxHeight: '8.3rem',
  '& .MuiTypography-body2': {
    display: 'flex',
    justifyContent: 'center'
  },
  '::-webkit-scrollbar': {
    display: 'none'
  }
}));

const CardPopover = forwardRef((props, ref) => {
  const { contentList, type } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const { handleClickTag } = useTags();
  const { navigateToAuthorPublicPage } = useNavigateToAuthorPublicPage();

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
      <StyledCategoryList>
        {contentList?.map((content, index) => {
          const contentMap = {
            author: (
              <StyledAuthorPopoverItem onClick={navigateToAuthorPublicPage(content.id, content.name)}>
                <UserAvatar
                  key={`${content.id || content.name || content}-${index}`}
                  name={content.name}
                  avatar={content.avatar}
                />
                <div style={{ marginLeft: '0.5rem' }}>{content.name}</div>
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
      </StyledCategoryList>
    </StyledPopoverContainer>
  );
});

CardPopover.displayName = 'CardPopover';

export default CardPopover;