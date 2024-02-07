import React, { useState, useCallback } from 'react';
import { Grid } from '@mui/material'
import GeneralInformationInput, { InputMode } from '@/components/GeneralInformationInput';
import { useDispatch, useSelector } from 'react-redux';
import { DATA_SOURCE_PAYLOAD_KEY } from '@/common/constants';
import { actions } from '@/slices/datasources';

export const StyledGridContainer = styled(Grid)(({ theme }) => ({
  padding: 0,
  [theme.breakpoints.down('lg')]: {
    overflowY: 'scroll',
    height: 'calc(100vh - 8.6rem)',
    '::-webkit-scrollbar': {
      display: 'none'
    }
  }
}));

export const GridItem = styled(Grid)(() => ({
  padding: '0 0.75rem 0 0',
}));

const BuildTabContent = () => {
  const dispatch = useDispatch();
  const nameError = false;
  const nameHelperText = '';
  const [inputMode, setInputMode] = useState(InputMode.Create);
  const { currentDataSource } = useSelector(state => state.datasources)
  const [name, setName] = useState(currentDataSource.name);
  const [description, setDescription] = useState(currentDataSource.description)
  const [stateTags, setStateTags] = useState(currentDataSource.tags)
  const onBlur = useCallback(
    (keyName) => () => {
      const value = keyName === DATA_SOURCE_PAYLOAD_KEY.name ? name : description;
      dispatch(actions.updateCurrentDataSource({
        key: keyName,
        value
      }))
    },
    [description, dispatch, name])

  const onChange = useCallback(
    (keyName) => (event) => {
      if (keyName === DATA_SOURCE_PAYLOAD_KEY.name) {
        setName(event.target.value);
      } else if (keyName === DATA_SOURCE_PAYLOAD_KEY.description) {
        setDescription(event.target.value);
      }
    },
    [],
  );

  const onChangeTags = useCallback(
    (tags) => {
      setStateTags(tags);
      dispatch(actions.updateCurrentDataSource({
        key: DATA_SOURCE_PAYLOAD_KEY.tags,
        value: tags
      }))
    },
    [dispatch],
  )

  const onCreate = useCallback(
    () => {
      setInputMode(InputMode.ReadOnly);
    },
    [],
  )

  return (
    <StyledGridContainer container>
      <GridItem item xs={12} lg={6}>
        <GeneralInformationInput
          name={name}
          nameError={nameError}
          nameHelperText={nameHelperText}
          isNameRequired
          onChangeName={onChange(DATA_SOURCE_PAYLOAD_KEY.name)}
          onNameBlur={onBlur(DATA_SOURCE_PAYLOAD_KEY.name)}
          description={description}
          isDescriptionRequired
          onChangeDescription={onChange(DATA_SOURCE_PAYLOAD_KEY.description)}
          onDescriptionBlur={onBlur(DATA_SOURCE_PAYLOAD_KEY.description)}
          descriptionError={false}
          descriptionHelperText={''}
          tagList={[]}
          stateTags={stateTags}
          onChangeTags={onChangeTags}
          onCreate={onCreate}
          mode={inputMode}
          canSaveSeparately
          canEdit
        />
      </GridItem>
      <GridItem item xs={12} lg={6}>
      </GridItem>
    </StyledGridContainer>
  )
}

export default BuildTabContent