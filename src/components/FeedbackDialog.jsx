/* eslint react/jsx-no-bind: 0 */
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useEffect, useState} from "react";
import {Fab, Rating, Typography} from "@mui/material";
import {
  StyledConfirmButton,
  StyledDialogActions,
  StyledDialogBase,
  StyledDialogContentText
} from "@/components/StyledDialog.jsx";
import {useLocation} from "react-router-dom";
import Box from "@mui/material/Box";
import FavoriteIcon from '@mui/icons-material/Favorite';
import {styled} from "@mui/material/styles";
import FeedbackIcon from '@mui/icons-material/Feedback';
import {useFeedbackMutation} from "@/api/social.js";


const HeartIcon = styled(FavoriteIcon)(({theme}) => (`
  fill: ${theme.palette.background.secondary};
  filter: drop-shadow(0px 0px 23px #7CE4DE) drop-shadow(0px 1px 8px rgba(124, 228, 222, 0.70));
`));

const FeedbackDialog = () => {
  const [open, setOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [rating, setRating] = useState(0)
  const [thanks, setThanks] = useState(false)
  const location = useLocation()
  const [sendFeedback, {isSuccess, isError}] = useFeedbackMutation()

  const setInitialState = () => {
    setOpen(false)
    setFeedbackText('')
    setRating(0)
  }

  useEffect(() => {
    setInitialState()
  }, [location.pathname])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    thanks ? setInitialState() : setOpen(false)
  }


  const handleSubmit = async e => {
    e.preventDefault()
    await sendFeedback({feedbackText, rating, location: location.pathname})
    // console.log({feedbackText, rating})
  }
  useEffect(() => {
    isSuccess && setThanks(true)
  }, [isSuccess])


  return (
    <>
      <Fab size="small" color="primary" aria-label="feedback"
           onClick={handleClickOpen}
           sx={{
             position: 'fixed',
             bottom: '15px',
             right: '15px',
             opacity: 0.2,
             transition: 'opacity 0.5s linear',
             ":hover": {
               opacity: 0.7
             }
           }}>
        <FeedbackIcon/>
      </Fab>
      <StyledDialogBase
        onTransitionExited={() => {
          setThanks(false)
        }}
        fullWidth
        maxWidth={'md'}
        open={open}
        onClose={handleClose}
      >

        <Box display={thanks ? 'flex' : 'none'} minHeight={'337px'} textAlign={'center'} flexDirection={'column'}
             alignItems={'center'} justifyContent={'center'}>
          <Typography variant={'h4'} mb={2}>Thank you for feedback!</Typography>
          <HeartIcon fontSize={'large'}/>
        </Box>
        <Box display={!thanks ? 'block' : 'none'}>
          <DialogTitle>Share your thoughts and ideas!</DialogTitle>
          <DialogContent>
            <StyledDialogContentText>
              Let us know how we can improve.
            </StyledDialogContentText>
            <Rating
              name={'feedback-rating'}
              value={rating}
              onClick={(e) => {
                const element = e.target.lastElementChild;
                if(element){
                  const newValue = Number(element.innerText.split(' ')[0]);
                  setRating(newValue)
                }
              }}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              label="Feedback"
              type="text"
              fullWidth
              variant={'outlined'}
              multiline
              minRows={5}
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              error={isError}
              helperText={isError ? 'Feedback submit error, please try again' : ''}
            />
          </DialogContent>
          <StyledDialogActions>
            <StyledConfirmButton onClick={handleClose} color={'secondary'}>Cancel</StyledConfirmButton>
            <StyledConfirmButton onClick={handleSubmit}>Send</StyledConfirmButton>
          </StyledDialogActions>
        </Box>
      </StyledDialogBase>
    </>
  );
}
export default FeedbackDialog