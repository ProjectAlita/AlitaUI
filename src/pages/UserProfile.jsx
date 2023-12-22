/* eslint react/jsx-no-bind: 0 */
// eslint react/jsx-no-bind: 0
import {
  Button,
  Collapse,
  Container, FormControl, FormHelperText,
  IconButton, Input, InputAdornment, InputLabel,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText, MenuItem, Select,
  TextField, useTheme
} from "@mui/material";
import {useSelector} from "react-redux";
import {useAuthorDescriptionMutation, useAuthorDetailsQuery} from "@/api/social.js";
import UserAvatar from "@/components/UserAvatar.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {ExpandLess, ExpandMore, Visibility, VisibilityOff} from "@mui/icons-material";
import DeleteIcon from "@/components/Icons/DeleteIcon.jsx";
import CopyIcon from "@/components/Icons/CopyIcon";
import EmailIcon from '@mui/icons-material/Email';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';


const millisecondsPerDay = 24 * 60 * 60 * 1000
const copyToClipboard = text => {
  // console.log('text', text)
  const textField = document.createElement('textarea')
  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()
}

const handleCopy = text => {
  navigator ? navigator.clipboard.writeText(text) : copyToClipboard(text)
}

const ExpirationMessage = ({expires}) => {
  const theme = useTheme()
  const [expireText, setExpireText] = useState('Expires: never')
  const [textColor, setTextColor] = useState('initial')

  useEffect(() => {
    if (expires !== undefined || expires !== null) {
      // const expDate = new Date(expires + 'Z')
      const expDate = new Date(expires)
      const dateDiff = expDate - new Date()
      const daysLeft = Math.round(dateDiff / millisecondsPerDay)
      switch (true) {
        case daysLeft < 0 || Object.is(daysLeft, -0):
          setExpireText('Expired')
          setTextColor(theme.palette.error.main)
          break
        case daysLeft === 0:
          setExpireText('Expires today')
          setTextColor(theme.palette.error.main)
          break
        case daysLeft === 1:
          setExpireText('Expires in: 1 day')
          setTextColor(theme.palette.warning.main)
          break
        case daysLeft <= 7:
          setExpireText(`Expires in: ${daysLeft} days`)
          setTextColor(theme.palette.warning.light)
          break
        default:
          setExpireText(`Expires in: ${daysLeft} days`)
          setTextColor(theme.palette.success.main)
      }
    }
  }, [
    expires, theme.palette.error.main, theme.palette.success.main,
    theme.palette.warning.light, theme.palette.warning.main
  ])


  return (
    // <Typography variant={"caption"} color={theme.palette.error.main}>{expireText}</Typography>
    <Typography variant={"caption"} color={textColor}>{expireText}</Typography>
  )
}

const TokenItem = ({name, value, expires}) => {
  const [showValue, setShowValue] = useState(false)
  const handleShowValue = () => {
    setShowValue(prevState => !prevState)
  }

  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel htmlFor={`token_${name}`} size={"normal"} disableAnimation>
        <Typography variant={"h6"}>{name}</Typography>
      </InputLabel>
      <Input
        id={`token_${name}`}
        type={showValue ? 'text' : 'password'}
        fullWidth
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              edge="end" aria-label="toggle password visibility" size={"small"}
              onClick={handleShowValue}
            >
              {showValue ?
                <VisibilityOff fontSize={'inherit'} color={'inherit'}/> :
                <Visibility fontSize={'inherit'} color={'inherit'}/>}
            </IconButton>
            <IconButton edge="end" aria-label="copy" size={"small"} onClick={
              () => handleCopy(value)
            }>
              <CopyIcon fontSize={'inherit'}/>
            </IconButton>
            <IconButton edge="end" aria-label="delete" size={"small"} color={"error"}>
              <DeleteIcon fontSize={'inherit'}/>
            </IconButton>
          </InputAdornment>
        }
        value={value}
        disabled
        multiline={showValue}
      />
      <FormHelperText><ExpirationMessage expires={expires}/></FormHelperText>
    </FormControl>
  )
}

const TokenPart = ({tokens}) => {
  const [expiration, setExpiration] = useState(30)
  const [showAddToken, setShowAddToken] = useState(false)

  const handleAddTokenClick = () => {
    if (showAddToken) {
      //   todo: add api call
    } else {
      setShowAddToken(true)
    }
  }

  return (<>
      <List component="div" disablePadding>
        {tokens?.map(i => (
          <ListItem
            key={i.id}
            sx={{pl: 4}}
          >
            <TokenItem {...i} />
          </ListItem>
        ))}
      </List>
      {/*<Divider sx={{ml: 4, mt: 2, mb: 1}}/>*/}
      <Box display={'flex'} pl={4} pb={1}>
        {showAddToken && <>
          <TextField variant={"standard"} fullWidth label={'Name'} required/>
          <FormControl fullWidth>
            <InputLabel>Expiration</InputLabel>
            <Select
              variant={"standard"}
              value={expiration}
              label="Expiration"
              onChange={e => setExpiration(e.target.value)}
            >
              <MenuItem value={30}>30 Days</MenuItem>
              <MenuItem value={60}>60 Days</MenuItem>
              <MenuItem value={90}>90 Days</MenuItem>
            </Select>
          </FormControl>
        </>}
        <Button variant={"outlined"} size={"small"} onClick={handleAddTokenClick} sx={{flex: 'none'}}>
          {showAddToken ? 'submit' : 'add token'}
        </Button>
      </Box>
    </>
  )
}

const AboutMeItem = ({description}) => {
  const [inputValue, setInputValue] = useState('')
  const [putDescription, {isFetching}] = useAuthorDescriptionMutation()
  useEffect(() => {
    description && setInputValue(description)
  }, [description])
  const handleSave = async () => {
    await putDescription({description: inputValue})
  }
  return (
    <>
      <TextField
        disabled={isFetching}
        value={inputValue}
        label={'About me'}
        variant={"standard"}
        onChange={e => setInputValue(e.target.value)}
        fullWidth
        multiline
      />
      <Button onClick={handleSave}>save</Button>
    </>
  )
}

const UserProfile = () => {
  const user = useSelector(state => state.user)
  useAuthorDetailsQuery()

  const [tokenListOpen, setTokenListOpen] = useState(true)
  const [integrationListOpen, setIntegrationListOpen] = useState(true)

  const handleTokenListOpen = () => {
    setTokenListOpen((prevState) => !prevState);
  }
  const handleIntegrationListOpen = () => {
    setIntegrationListOpen((prevState) => !prevState);
  }


  return (
    <Container>
      <Box sx={{display: 'flex'}}>
        <UserAvatar avatar={user.avatar} name={user.name} size={64}/>
        <Box marginLeft={'20px'}>
          <Typography variant={"h5"} color={'text.secondary'}>
            {user.name}
          </Typography>
          {user.title && <Typography fontSize={"small"} sx={{display: 'flex', alignItems: 'center'}}>
            <WorkOutlineIcon fontSize={"inherit"}/>
            <Typography variant={'caption'} marginLeft={'4px'}>{user.title}</Typography>
          </Typography>}
          <Link href={`mailto:${user.email}`} fontSize={"small"} sx={{display: 'flex', alignItems: 'center'}}>
            <EmailIcon fontSize={"inherit"}/>
            <Typography variant={'caption'} marginLeft={'4px'}>{user.email}</Typography>
          </Link>
        </Box>
      </Box>

      <List>
        <ListItem>
          <AboutMeItem description={user.description}/>
        </ListItem>

        <ListItemButton onClick={handleTokenListOpen}>
          <ListItemText primary="My tokens"/>
          {tokenListOpen ? <ExpandLess/> : <ExpandMore/>}
        </ListItemButton>
        <Collapse in={tokenListOpen} timeout="auto" unmountOnExit>
          <TokenPart tokens={user.tokens}/>
        </Collapse>

        <ListItemButton onClick={handleIntegrationListOpen}>
          <ListItemText primary="My AI integrations"/>
          {integrationListOpen ? <ExpandLess/> : <ExpandMore/>}
        </ListItemButton>
        <Collapse in={integrationListOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {user?.integrations?.map(i => (
              <ListItem
                key={i.id}
                sx={{pl: 4}}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" size={"small"} onClick={
                    () => handleCopy(i.uid)
                  }>
                    <CopyIcon fontSize={'inherit'}/>
                  </IconButton>
                }>
                <ListItemText
                  // primary={i.uid}
                  // secondary={`${i.name} - ${i.config?.name}`}
                  primary={`${i.name} - ${i.config?.name}`}
                  secondary={i.uid}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>

      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete" size={"small"}
                      onClick={
                        () => handleCopy(user.personal_project_id)
                      }>
            <CopyIcon fontSize={'inherit'}/>
          </IconButton>
        }
      >
        {/*<ListItemText primary={`Personal project id: ${user.personal_project_id}`}/>*/}
        <ListItemText primary={
          <Typography>Personal project id: {
            <Typography color={'text.secondary'} component={'span'}>{user.personal_project_id}</Typography>
          }</Typography>
        }/>
      </ListItem>

      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete" size={"small"} onClick={
            () => handleCopy(user.api_url)
          }>
            <CopyIcon fontSize={'inherit'}/>
          </IconButton>
        }
      >
        <ListItemText primary={
          <Typography>Api url: {
            <Typography color={'text.secondary'} component={'span'}>{user.api_url}</Typography>
          }</Typography>
        }/>
      </ListItem>

    </Container>
  )
}

export default UserProfile