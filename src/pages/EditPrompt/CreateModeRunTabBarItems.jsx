import { useCreatePromptMutation } from '@/api/prompts';
import { ContentType, ViewMode } from '@/common/constants';
import { stateDataToPrompt } from '@/common/promptApiUtils.js';
import { buildErrorMessage } from '@/common/utils';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import Toast from '@/components/Toast';
import useCardNavigate from '@/components/useCardNavigate';
import { useNavBlocker , useHasPromptChange } from '@/pages/hooks';
import { actions as promptSliceActions } from '@/slices/prompts';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SaveButton,
  TabBarItems,
} from './Common';
import DiscardButton from './DiscardButton';

export default function CreateModeRunTabBarItems() {
  const dispatch = useDispatch();
  const { currentPrompt } = useSelector((state) => state.prompts);
  const { personal_project_id: projectId } = useSelector(state => state.user);

  const [createPrompt, { isLoading: isSaving, data, isError, error }] = useCreatePromptMutation();
  const [isFormSubmit, setIsFormSubmit] = React.useState(false);

  const hasCurrentPromptBeenChanged = useHasPromptChange();
  useNavBlocker({
    blockCondition: !isFormSubmit && hasCurrentPromptBeenChanged
  })

  const doCreate = React.useCallback(async () => {
    const { name } = currentPrompt;
    if (!name) {
      dispatch(promptSliceActions.setValidationError({
        name: 'Name is required',
      }))
      return
    }
    await createPrompt({
      ...stateDataToPrompt(currentPrompt),
      projectId,
    });

  }, [currentPrompt, createPrompt, projectId, dispatch]);

  const navigateToPromptDetail = useCardNavigate({
    viewMode: ViewMode.Owner,
    id: data?.id,
    type: ContentType.MyLibraryPrompts,
    name: data?.name,
    replace: true
  });

  React.useEffect(() => {
    if (data?.id) {
      setIsFormSubmit(true);
      setTimeout(navigateToPromptDetail, 100);
    }
  }, [data, navigateToPromptDetail]);

  return (
    <>
      <TabBarItems>
        <SaveButton disabled={isSaving || !hasCurrentPromptBeenChanged} variant="contained" onClick={doCreate}>
          Save
          {isSaving && <StyledCircleProgress size={20} />}
        </SaveButton>
        <DiscardButton />
      </TabBarItems>
      <Toast
        open={isError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>);
}