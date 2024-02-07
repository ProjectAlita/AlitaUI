import { actions } from '@/slices/prompts';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import EditPromptTabs from './EditPrompt/EditPromptTabs';
import { PromptView } from '@/common/constants';

export default function CreatePrompt() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(actions.setValidationError({}));
    return () => {
      dispatch(actions.setValidationError({}));
    }
  }, [dispatch]);

  return <EditPromptTabs mode={PromptView.CREATE} />;
}
