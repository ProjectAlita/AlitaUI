import { actions } from '@/reducers/prompts';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import EditPromptTabs from './EditPromptTabs';

export default function CreatePrompt() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(actions.setValidationError({}));
    dispatch(actions.resetCurrentPromptData());
    return () => {
      dispatch(actions.setValidationError({}));
    }
  }, [dispatch]);

  return <EditPromptTabs isCreateMode />;
}
