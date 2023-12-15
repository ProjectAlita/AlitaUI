import { useCollectionListQuery, usePatchCollectionMutation } from '@/api/collections';
import { buildErrorMessage } from '@/common/utils';
import Button from '@/components/Button';
import SearchIcon from '@/components/Icons/SearchIcon';
import { StyledDialog } from '@/components/StyledDialog';
import Toast from '@/components/Toast';
import { useCollectionProjectId } from '@/pages/hooks';
import {
  FormControl,
  Input,
  InputAdornment,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import * as React from 'react';
import { useSelector } from 'react-redux';
import useRefDialog from './useRefDialog';
import { typographyVariants } from '@/MainTheme'

const PatchCollectionOperations = {
  ADD: 'add',
  REMOVE: 'remove',
} 

const DialogTitleDiv = styled('div')(({ theme }) => ({
  width: '100%',
  padding: '16px',
  borderBottom: '1px solid ' + theme.palette.border.lines,
}));

const getCommonStyle = (theme) => ({
  width: '100%',
  padding: '12px 20px',
  borderBottom: '1px solid ' + theme.palette.border.lines,
})

const SearchInputContainer = styled(FormControl)(({ theme }) => ({
  ...getCommonStyle(theme),
}));
const SearchInput = styled(Input)(() => ({
  ...typographyVariants.bodyMedium,
}))

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  ...getCommonStyle(theme),
  display: 'flex',
  justifyContent: 'space-between',
}));

const AddToCollectionDialog = React.forwardRef((_props, ref) => {
  const { open, closeDialog } = useRefDialog(ref);

  const { currentPrompt } = useSelector((state) => state.prompts);
  const collectionProjectId = useCollectionProjectId();
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = React.useState(0);
  const { data, error } = useCollectionListQuery({ 
    projectId: collectionProjectId,
    page 
  }, { 
    skip: !collectionProjectId 
  });
  const [patchCollection, {
    isLoading: isPatching,
    error: patchingError
  }] = usePatchCollectionMutation();

  const [patchingId, setPatchingId] = React.useState(-1);
  const [addedCollectionIds, setAddedCollectionIds] = React.useState([]);
  const getActionType = React.useCallback((collectionId) => {
    if (addedCollectionIds.includes(collectionId)) {
      return PatchCollectionOperations.REMOVE;
    }
    return PatchCollectionOperations.ADD;
  }, [addedCollectionIds]);
  const doPatchCollection = React.useCallback((collectionId) => {
    const operation = getActionType(collectionId)
    setPatchingId(collectionId);
    setAddedCollectionIds(prev => [...prev, collectionId]);
    const { id, owner_id } = currentPrompt;
    patchCollection({
      projectId: collectionProjectId,
      collectionId,
      body: {
        operation,
        prompt: {
          id,
          owner_id,
        }
      }
    })
  }, [getActionType, currentPrompt, patchCollection, collectionProjectId]);

  React.useEffect(() => {
    if (data) {
      setOptions(data.rows)
    }
  }, [data])

  const [inputText, setInputText] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const handleChange = React.useCallback((e) => {
    const {
      target: { value },
    } = e;
    setInputText(value);
    setOptions(
      data.rows.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
    )
  }, [data])

  return (
    <StyledDialog
      open={open}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitleDiv>
        <Typography variant='headingSmall'>
          Add to collections
        </Typography>
      </DialogTitleDiv>
      <SearchInputContainer>
        <SearchInput
          disableUnderline
          variant="standard"
          placeholder="Search for ..."
          value={inputText}
          onChange={handleChange}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </SearchInputContainer>
      <MenuList sx={{ width: '100%', height: '306px', overflow: 'scroll', pt: 0 }}>
        {options.map(({ id, name, description }) => (
          <StyledMenuItem
            key={id}
          >
            <div >
              <Typography variant="labelMedium" component='div'>
                {name}
              </Typography>
              <Typography variant='bodySmall' component='div'>
                {description}
              </Typography>
            </div>
            {
              isPatching && (patchingId === id) ?
                <CircularProgress size={20} sx={{ marginRight: '2rem' }} /> :
                <Button
                  variant='contained'
                  color='secondary'
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => doPatchCollection(id)}
                  sx={{ textTransform: 'capitalize' }}
                  disabled={isPatching && (patchingId === id)}
                >
                  {getActionType(id)}
                </Button>
            }

          </StyledMenuItem>
        ))}
      </MenuList>
      <Toast
        open={Boolean(error || patchingError)}
        severity={'error'}
        message={buildErrorMessage(error || patchingError)}
      />
    </StyledDialog>
  );
});

AddToCollectionDialog.displayName = 'AddToCollectionDialog';

export default AddToCollectionDialog;