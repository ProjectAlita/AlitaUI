/* eslint react/jsx-no-bind: 0 */
import {
  Button, CircularProgress,
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
import {useCallback, useEffect, useState} from "react";
import {ExpandLess, ExpandMore, Visibility, VisibilityOff} from "@mui/icons-material";
import DeleteIcon from "@/components/Icons/DeleteIcon.jsx";
import CopyIcon from "@/components/Icons/CopyIcon";
import EmailIcon from '@mui/icons-material/Email';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import {useGetModelsQuery} from "@/api/integrations.js";
import {useTokenCreateMutation, useTokenDeleteMutation, useTokenListQuery} from "@/api/auth.js";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const millisecondsPerDay = 24 * 60 * 60 * 1000
const copyToClipboard = text => {
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
    <Box width={'100%'}>
      <TextField
        disabled={isFetching}
        value={inputValue}
        label={'About me'}
        variant={"standard"}
        onChange={e => setInputValue(e.target.value)}
        fullWidth
        multiline
      />
      <Button variant={"outlined"} size={"small"} onClick={handleSave} sx={{flex: 'none', mt: 1}}>
        save
      </Button>
    </Box>
  )
}

const ExpirationMessage = ({expires}) => {
  const theme = useTheme()
  const [expireText, setExpireText] = useState('Expires: never')
  const [textColor, setTextColor] = useState('initial')

  useEffect(() => {
    if (expires !== undefined && expires !== null) {
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

const TokenItem = ({name, token, expires, uuid, onDelete}) => {
  const [showValue, setShowValue] = useState(false)
  const handleShowValue = () => {
    setShowValue(prevState => !prevState)
  }

  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel htmlFor={`token_${uuid}`} size={"normal"} disableAnimation>
        <Typography variant={"h6"}>{name}</Typography>
      </InputLabel>
      <Input
        id={`token_${uuid}`}
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
              () => handleCopy(token)
            }>
              <CopyIcon fontSize={'inherit'}/>
            </IconButton>
            <IconButton edge="end" aria-label="delete" size={"small"} color={"error"}
                        onClick={onDelete}
            >
              <DeleteIcon fontSize={'inherit'}/>
            </IconButton>
          </InputAdornment>
        }
        value={token}
        disabled
        multiline={showValue}
      />
      <FormHelperText><ExpirationMessage expires={expires}/></FormHelperText>
    </FormControl>
  )
}

const EXPIRATION_MEASURES = ['never', 'days', 'weeks', 'hours', 'minutes']
const TokenPart = ({user}) => {
  const [name, setName] = useState('')
  const [postError, setPostError] = useState('')
  const [expiration, setExpiration] = useState(30)
  const [measure, setMeasure] = useState(EXPIRATION_MEASURES[1])
  const [showAddToken, setShowAddToken] = useState(false)
  const [tokens, setTokens] = useState([])
  const {data, isLoading} = useTokenListQuery({skip: !user.personal_project_id})
  useEffect(() => {
    data && setTokens(data)
  }, [data])

  const [createToken] = useTokenCreateMutation()
  const [deleteToken] = useTokenDeleteMutation()
  const handleAddTokenClick = async () => {
    setPostError('')
    if (showAddToken) {
      const expires = measure === EXPIRATION_MEASURES[0] ? null : {measure, value: expiration}
      const {data: newToken, error} = await createToken({name, expires})
      if (!error) {
        setTokens(prevState => ([...prevState, newToken]))
        setName('')
        setMeasure(EXPIRATION_MEASURES[1])
      } else {
        setPostError(error?.data?.error)
      }

    } else {
      setShowAddToken(true)
    }
  }

  const handleTokenDelete = useCallback(async uuid => {
    const {error} = await deleteToken({uuid})
    !error && setTokens(prevState => prevState.filter(i => i.uuid !== uuid))
  }, [deleteToken, setTokens])


  if (isLoading) {
    return <Box display={"flex"} justifyContent={"center"}><CircularProgress /></Box>
  }

  return (
    <>
      <List component="div" disablePadding>
        {tokens?.map(i => (
          <ListItem
            key={i.uuid}
            sx={{pl: 4}}
          >
            <TokenItem {...i} onDelete={handleTokenDelete.bind(null, i.uuid)}/>
          </ListItem>
        ))}
      </List>

      <Box pl={4} pb={1} mt={1}>
        {showAddToken && (
          <Box display={'flex'}>
            <TextField variant={"standard"} fullWidth label={'Name'} required
                       value={name}
                       onChange={e => setName(e.target.value)}
                       autoComplete={'off'}
                       error={!!postError}
                       helperText={postError}
            />
            {measure !== EXPIRATION_MEASURES[0] &&
              <TextField variant={"standard"} fullWidth label={measure} required
                         type={"number"}
                         onChange={e => setExpiration(e.target.value)}
                         autoComplete={'off'}
                         value={expiration}
                         sx={{ml: 1}}
              />}
            <FormControl fullWidth sx={{ml: 1}}>
              <InputLabel>Expiration</InputLabel>
              <Select
                variant={"standard"}
                value={measure}
                label="Expiration"
                onChange={e => setMeasure(e.target.value)}
              >
                {EXPIRATION_MEASURES.map(i => <MenuItem value={i} key={i}>{i}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        )}
        <Button variant={"outlined"} size={"small"} onClick={handleAddTokenClick} sx={{mt: 1}}>
          {showAddToken ? 'submit' : 'add token'}
        </Button>
      </Box>
    </>
  )
}

const IntegrationItem = ({uid, name, config, settings}) => {
  const [collapseOpen, setCollapseOpen] = useState(false)
  return (
    <ListItem
      sx={{pl: 4}}
      secondaryAction={
        <IconButton edge="end" aria-label="delete" size={"small"} onClick={
          () => handleCopy(uid)
        }>
          <CopyIcon fontSize={'inherit'}/>
        </IconButton>
      }>
      <Box>
        <ListItemText
          primary={`${name} - ${config?.name}`}
          secondary={<Box display={"flex"} alignItems={"center"}>
              {uid}
              <IconButton
                color="primary"
                disableRipple
                size={"small"}
                onClick={() => setCollapseOpen(prevState => !prevState)}
                sx={{p: 0, ml: 1}}
              ><InfoOutlinedIcon fontSize={"inherit"}/></IconButton>
          </Box>
          }
        />

        <Collapse in={collapseOpen} timeout="auto">
          <List disablePadding dense>
            {settings?.models?.map(model => (
              <ListItem key={model.name}>
                <ListItemText primary={model?.name} secondary={'Token limit: ' + model?.token_limit}/>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>
    </ListItem>
  )
}

const IntegrationsPart = ({user}) => {
  const {data} = useGetModelsQuery(user.personal_project_id, {skip: !user.personal_project_id})
  return (
    <List component="div" disablePadding>
      {data?.map(i => <IntegrationItem {...i} key={i.uid}/>)}
    </List>
  )
}

const UserProfile = () => {
  const user = useSelector(state => state.user)
  useAuthorDetailsQuery()

  const [tokenListOpen, setTokenListOpen] = useState(false)
  const [integrationListOpen, setIntegrationListOpen] = useState(false)

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
          <TokenPart user={user}/>
        </Collapse>

        <ListItemButton onClick={handleIntegrationListOpen}>
          <ListItemText primary="My AI integrations"/>
          {integrationListOpen ? <ExpandLess/> : <ExpandMore/>}
        </ListItemButton>
        <Collapse in={integrationListOpen} timeout="auto" unmountOnExit>
          <IntegrationsPart user={user}/>
        </Collapse>
      </List>

      {/*<ListItem*/}
      {/*  secondaryAction={*/}
      {/*    <IconButton edge="end" aria-label="delete" size={"small"}*/}
      {/*                onClick={*/}
      {/*                  () => handleCopy(user.personal_project_id)*/}
      {/*                }>*/}
      {/*      <CopyIcon fontSize={'inherit'}/>*/}
      {/*    </IconButton>*/}
      {/*  }*/}
      {/*>*/}
      {/*  <ListItemText primary={*/}
      {/*    <Typography>Personal project id: {*/}
      {/*      <Typography color={'text.secondary'} component={'span'}>{user.personal_project_id}</Typography>*/}
      {/*    }</Typography>*/}
      {/*  }/>*/}
      {/*</ListItem>*/}

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