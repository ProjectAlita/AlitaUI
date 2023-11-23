import {
  LATEST_VERSION_NAME,
} from '@/common/constants.js';
import AlertDialog from '@/components/AlertDialog';
import Button from '@/components/Button';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import * as React from 'react';
import { useCallback, useState } from 'react';
import {
  SaveButton,
  TabBarItems,
} from './Common';
import InputVersionDialog from './InputVersionDialog';
import VersionSelect from './VersionSelect';
import { useDispatch } from 'react-redux';
import { actions as promptSliceActions } from '@/reducers/prompts';

export default function RunTabBarItems({
  currentVersionName = '',
  isCreateMode,
  isSaving,
  isSavingNewVersion,
  onCreateNewVersion,
  onSave,
  versions = [],
}) {
  const dispatch = useDispatch();
  const [openAlert, setOpenAlert] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [showInputVersion, setShowInputVersion] = useState(false);

  const onCancel = useCallback(() => {
    setOpenAlert(true);
  }, []);

  const onSaveVersion = React.useCallback(
    () => {
      setShowInputVersion(true);
    },
    [],
  );

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
    },
    [],
  );

  const onConfirmDelete = useCallback(
    () => {
      onCloseAlert();
      if(isCreateMode) {
        dispatch(
          promptSliceActions.resetCurrentPromptData()
        )
        return 
      }
      dispatch(
        promptSliceActions.useCurrentPromtDataSnapshot()
      )
    },
    [dispatch, isCreateMode, onCloseAlert],
  );

  const onCancelShowInputVersion = useCallback(
    () => {
      setShowInputVersion(false);
    },
    [],
  );

  const onConfirmVersion = useCallback(
    () => {
      setShowInputVersion(false);
      onCreateNewVersion(newVersion);
    },
    [newVersion, onCreateNewVersion],
  );

  const onInputVersion = useCallback((event) => {
    const { target } = event;
    setNewVersion(target?.value);
  }, []);


  return <><TabBarItems>
    <VersionSelect currentVersionName={currentVersionName} versions={versions} />
    {
      (!currentVersionName || currentVersionName === LATEST_VERSION_NAME)
      &&
      <SaveButton disabled={isSaving} variant="contained" color="secondary" onClick={onSave}>
        Save
        {isSaving && <StyledCircleProgress />}
      </SaveButton>
    }
    <Button variant='contained' color='secondary' onClick={onCancel}>
      Discard
    </Button>
    {
      !!versions.length &&
      <Button disabled={isSavingNewVersion} variant='contained' color='secondary' onClick={onSaveVersion}>
        Save As Version
        {isSavingNewVersion && <StyledCircleProgress />}
      </Button>
    }
  </TabBarItems>
    <AlertDialog
      title='Warning'
      alertContent="Are you sure to drop the changes?"
      open={openAlert}
      onClose={onCloseAlert}
      onCancel={onCloseAlert}
      onConfirm={onConfirmDelete}
    />
    <InputVersionDialog
      open={showInputVersion}
      onCancel={onCancelShowInputVersion}
      onConfirm={onConfirmVersion}
      onChange={onInputVersion}
    />
  </>
}