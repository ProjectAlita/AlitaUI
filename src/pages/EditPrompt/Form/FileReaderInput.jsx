import { PROMPT_PAYLOAD_KEY, VariableSources } from '@/common/constants.js';
import { getFileFormat, debounce } from '@/common/utils';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useTheme } from '@emotion/react';
import YAML from 'js-yaml';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyledInputEnhancer } from '../Common';
import { useUpdateVariableList } from '../../hooks';
import Toast from '@/components/Toast.jsx';

const FileReaderEnhancer = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentPrompt: { prompt } } = useSelector((state) => state.prompts);
  const [inputValue, setInputValue] = useState(prompt);
  const [highlightContext, setHighlightContext] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorMessageToast, setOpenErrorMessageToast] = useState(false);
  const [updateVariableList] = useUpdateVariableList(VariableSources.Context)

  const handleInput = useCallback((event) => {
    event.preventDefault();
    setInputValue(event.target.value);
    debounce(() => {
      updateVariableList(event.target.value)
      dispatch(
        promptSliceActions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.context,
          data: event.target.value,
        })
      );
    }, 500)()
  }, [dispatch, updateVariableList]);

  const handleDragOver = useCallback(() => {
    (event) => event.preventDefault();
    if (highlightContext) return;
    setHighlightContext(true);
  }, [highlightContext]);

  const handleBlur = useCallback(() => {
    (event) => event.preventDefault();
  }, []);

  const handleDragLeave = useCallback(() => {
    (event) => event.preventDefault();
    setHighlightContext(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setHighlightContext(false);
    setOpenErrorMessageToast(false);
    const file = event.dataTransfer.files[0];
    const fileName = file?.name;
    const reader = new FileReader();
    if (file) {
      reader.readAsText(file);
    }
    reader.onload = () => {
      try {
        let fileData = null;
        const fileFormat = getFileFormat(fileName);
        const dataString = reader.result;
        if (fileFormat === 'yaml') {
          const yamlData = YAML.load(dataString);
          fileData = yamlData;
        } else {
          const jsonData = JSON.parse(dataString);
          fileData = jsonData;
        }
        const { context } = fileData;
        setInputValue(context);
        dispatch(
          promptSliceActions.updateCurrentPromptData({
            key: PROMPT_PAYLOAD_KEY.context,
            data: context,
          })
        );
        updateVariableList(context)
      } catch (error) {
        setOpenErrorMessageToast(true);
        setErrorMessage('Error parsing File: Unsupported format');
      }
    };
  }, [dispatch, updateVariableList]);

  useEffect(() => {
    setInputValue(prompt);
  }, [prompt]);
  
  return (
    <>
      <StyledInputEnhancer
        maxRows={15}
        value={inputValue}
        style={{ backgroundColor: highlightContext ? theme.palette.text.contextHighLight : '' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onInput={handleInput}
        onBlur={handleBlur}
        {...props}
      />
      <Toast
        open={openErrorMessageToast}
        severity={'error'}
        message={errorMessage}
      />
    </>
  );
};

export default FileReaderEnhancer;