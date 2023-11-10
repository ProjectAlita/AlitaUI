import { useCreatePromptMutation } from '@/api/prompts';
import { SOURCE_PROJECT_ID, TOAST_DURATION } from '@/common/constants';
import { Alert, Snackbar } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditPromptTabs from './EditPromptTabs';

export default function CreatePrompt() {
  const navigate = useNavigate();
  const { currentPrompt } = useSelector((state) => state.prompts);
  const [openError, setOpenError] = React.useState(true);

  const [createPrompt, {isSuccess, data, isError, error}] = useCreatePromptMutation();

  React.useEffect(()=> {
    if (isError || isSuccess) {
      setOpenError(true);
    }
  }, [isError, isSuccess]);

  const doCreate = React.useCallback(async () => {
    const { name, description, prompt } = currentPrompt;
     await createPrompt({
      projectId: SOURCE_PROJECT_ID,
      type: 'chat',
      name, 
      description,
      prompt,
      model_settings: {
        model_name: 'gpt-3.5-turbo',
        temperature: 1.0,
        max_tokens: 117,
        top_p: 0.5
      }
    });
    
  }, [currentPrompt, createPrompt]);

  React.useEffect(()=> {
    const promptId = data?.id;
    if (promptId) {
      navigate('/prompt/'+ promptId);
    }
  }, [data, navigate]);

  const onCloseError = React.useCallback(
    () => {
      setOpenError(false);
    },
    [],
  );

  return <>
    <EditPromptTabs onSave={doCreate}/>
    <Snackbar open={openError} autoHideDuration={TOAST_DURATION} onClose={onCloseError}>
      <Alert onClose={onCloseError} severity={isError ? 'error' : 'info' } sx={{ width: '100%' }}>
        {isError ? error?.data?.message : 'Create prompt success'}
      </Alert>
    </Snackbar>
  </>;
}
