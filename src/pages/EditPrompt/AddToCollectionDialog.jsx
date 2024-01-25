import { typographyVariants } from '@/MainTheme';
import { useCollectionListQuery, usePatchCollectionMutation } from '@/api/collections';
import { buildErrorMessage } from '@/common/utils';
import Button from '@/components/Button';
import SearchIcon from '@/components/Icons/SearchIcon';
import { StatusDot } from '@/components/StatusDot';
import { StyledDialog } from '@/components/StyledDialog';
import Toast from '@/components/Toast';
import {
  CircularProgress,
  FormControl,
  Input,
  InputAdornment,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';

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

const StyledMenuList = styled(MenuList)(() => ({
  width: '100%',
  height: '306px',
  overflow: 'scroll',
  paddingTop: 0,
  '::-webkit-scrollbar': {
    display: 'none'
  }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  ...getCommonStyle(theme),
  display: 'flex',
  justifyContent: 'space-between',
}));

const AddToCollectionDialog = ({ open, setOpen, prompt }) => {
  const closeDialog = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const [page, setPage] = React.useState(0);
  const { data, error, refetch, isFetching } = useCollectionListQuery({
    projectId: privateProjectId,
    page,
    params: {
      prompt_id: prompt?.id,
      prompt_owner_id: prompt?.owner_id
    }
  }, {
    skip: !privateProjectId || !open || !prompt
  });
  const isMoreToLoad = React.useMemo(() => {
    return data?.rows?.length < data?.total
  }, [data])
  const checkScroll = React.useCallback((e) => {
    if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
      if (isMoreToLoad) {
        setPage(page + 1);
      }
    }
  }, [isMoreToLoad, page]);

  const [patchCollection, {
    isLoading: isPatching,
    isSuccess: isPatchSuccess,
    error: patchingError
  }] = usePatchCollectionMutation();

  const [options, setOptions] = React.useState([]);
  const sortedOptions = React.useMemo(() => {
    const added = options.filter(option => option?.includes_prompt);
    const notAdded = options.filter(option => !option?.includes_prompt);
    return [...added, ...notAdded];
  }, [options]);
  const [patchingId, setPatchingId] = React.useState(-1);
  const addedCollectionIds = React.useMemo(() => options.filter(
    option => option?.includes_prompt
  ).map(option => option.id), [options]);
  const getActionType = React.useCallback((collectionId) => {
    if (addedCollectionIds && addedCollectionIds.includes(collectionId)) {
      return PatchCollectionOperations.REMOVE;
    }
    return PatchCollectionOperations.ADD;
  }, [addedCollectionIds]);
  const doPatchCollection = React.useCallback((collectionId) => {
    const operation = getActionType(collectionId)
    setPatchingId(collectionId);
    const { id, owner_id } = prompt;
    patchCollection({
      projectId: privateProjectId,
      collectionId,
      body: {
        operation,
        prompt: {
          id,
          owner_id,
        }
      }
    })
  }, [getActionType, prompt, patchCollection, privateProjectId]);

  React.useEffect(() => {
    if (data) {
      setOptions(data.rows)
    }
  }, [data])

  React.useEffect(() => {
    if (isPatchSuccess) {
      refetch();
      setPatchingId(-1);
    }
  }, [refetch, isPatchSuccess])

  const [inputText, setInputText] = React.useState('');
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
      <StyledMenuList onScroll={checkScroll}>
        {sortedOptions.map(({ id, name, description, status }) => (
          <StyledMenuItem
            key={id}
          >
            <div style={{ display: 'flex', alignItems: 'top' }}>
              <div style={{ paddingRight: '0.5rem', paddingLeft: '4px' }}><StatusDot status={status} size='10px' /></div>
              <div>
                <Typography variant="labelMedium" component='div'>
                  {name}
                </Typography>
                <Typography variant='bodySmall' component='div'>
                  {description}
                </Typography>
              </div>
            </div>
            {
              ((isFetching || isPatching) && (patchingId === id)) ?
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
        {
          isFetching && <CircularProgress sx={{ margin: '1rem 2rem' }} />
        }
      </StyledMenuList>
      <Toast
        open={Boolean(error || patchingError)}
        severity={'error'}
        message={buildErrorMessage(error || patchingError)}
      />
    </StyledDialog>
  );
};

export default AddToCollectionDialog;