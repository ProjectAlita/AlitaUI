import { Fragment } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ReplyIcon from '@/components/Icons/ReplyIcon';
import CommentInput from './CommentInput';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';

const StyledReplyArea = styled('div')(() => ({
  display: 'flex',
}));

const StyledListItemAvatar = styled(ListItemAvatar)(() => ({
  minWidth: '1.763rem',
  marginTop: '3px'
}))

const StyledAvatar = styled(Avatar)(() => ({
  width: '1.25rem',
  height: '1.25rem',
  fontSize: '.9rem',
}))

const StyledCommentHeader = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.text.primary,
  fontSize: '0.75rem',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '1rem',
}));

const StyledCommentArea = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '1.5rem',
}));

const StyledSubReplyArea = styled('div')(() => ({
  marginLeft: '1.75rem',
}));

const StyledSubReplyAreaList = styled(List)(() => ({
  display: 'flex',
}));

const StyledReplyIcon = styled(ReplyIcon)(() => ({
  width: '1rem',
  height: '1rem',
  verticalAlign: 'middle',
}));

const StyledReplyIconContainer = styled('div')(() => ({
  padding: '.25rem',
  cursor: 'pointer'
}));

const StyledReplyCount = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: '.38rem .75rem',
}));

const StyledReplyOperator = styled('div')(() => ({
  display: 'flex',
}));

const StyledListItem = styled(ListItem)(() => ({
  flexDirection: 'column'
}));

const Comment = () => {
  return (
    <Fragment>
      <StyledListItem alignItems='flex-start'>
        <div>
          <StyledReplyArea>
            <StyledListItemAvatar>
              <StyledAvatar alt='Tom Ford' src='/static/images/avatar/1.jpg' />
            </StyledListItemAvatar>
            <ListItemText
              component={'div'}
              primary={
                <Typography component='div' variant='body2'>
                  <StyledCommentHeader>
                    {'Ford Jim 2023/11/27'}
                  </StyledCommentHeader>
                </Typography>
              }
              secondary={
                <Typography component='div' variant='body2'>
                  <StyledCommentArea>
                    {
                      'Vitae nibh turpis scelerisque commodo egestas id morbi urna in. Arcu id pellentesque amet commodo aenean. Vitae nibh turpis scelerisque commodo egestas id morbi urna in. Arcu id pellentesque amet commodo aenean.'
                    }
                  </StyledCommentArea>
                  <StyledReplyOperator>
                    <StyledReplyIconContainer>
                      <StyledReplyIcon />
                    </StyledReplyIconContainer>
                    <StyledReplyCount>2</StyledReplyCount>
                  </StyledReplyOperator>
                </Typography>
              }
            />
          </StyledReplyArea>
          <StyledSubReplyArea>
            <StyledSubReplyAreaList>
              <StyledListItemAvatar>
                <StyledAvatar alt='Ford Jim' src='/static/images/avatar/1.jpg' />
              </StyledListItemAvatar>
              <ListItemText
                primary={
                  <Typography component='div' variant='body2'>
                    <StyledCommentHeader>
                      {'Ford Jim 2023/11/27'}
                    </StyledCommentHeader>
                  </Typography>
                }
                secondary={
                  <Typography component='div' variant='body2'>
                    <StyledCommentArea>
                      {
                        'Arcu id pellentesque amet commodo aenean.'
                      }
                    </StyledCommentArea>
                    <StyledReplyOperator>
                      <StyledReplyIconContainer>
                        <StyledReplyIcon />
                      </StyledReplyIconContainer>
                      <StyledReplyCount>2</StyledReplyCount>
                    </StyledReplyOperator>
                  </Typography>
                }
              />
            </StyledSubReplyAreaList>
          </StyledSubReplyArea>
          <StyledSubReplyArea>
            <StyledSubReplyAreaList>
              <StyledListItemAvatar>
                <StyledAvatar alt='Ford Jim' src='/static/images/avatar/1.jpg' />
              </StyledListItemAvatar>
              <ListItemText
                primary={
                  <Typography component='div' variant='body2'>
                    <StyledCommentHeader>
                      {'Ford Jim 2023/11/27'}
                    </StyledCommentHeader>
                  </Typography>
                }
                secondary={
                  <Typography component='div' variant='body2'>
                    <StyledCommentArea>
                      {
                        'Arcu id pellentesque amet commodo aenean.'
                      }
                    </StyledCommentArea>
                    <StyledReplyOperator>
                      <StyledReplyIconContainer>
                        <StyledReplyIcon />
                      </StyledReplyIconContainer>
                      <StyledReplyCount>2</StyledReplyCount>
                    </StyledReplyOperator>
                  </Typography>
                }
              />
            </StyledSubReplyAreaList>
          </StyledSubReplyArea>
        </div>
        <CommentInput />
      </StyledListItem>
    </Fragment>
  );
};

export default Comment;
