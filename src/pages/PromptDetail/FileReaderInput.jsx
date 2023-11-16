import { PROMPT_PAGE_INPUT, PROMPT_PAYLOAD_KEY } from '@/common/constants.js';
import { contextResolver, getFileFormat } from '@/common/utils';
import { actions as promptSliceActions } from '@/reducers/prompts';
import YAML from 'js-yaml';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyledInputEnhancer } from './Common';
import { useUpdateVariableList } from './hooks';

const CONTEXT_HIGHLIGHT_COLOR = '#3d3d3d';

const areTwoVariableListNotTheSame = (variableList1, variableList2) => {
  for (let i = 0; i < variableList1.length; i++) {
    const variable = variableList1[i];
    if (!variableList2.find(element => element.key === variable.key)) {
      return true;
    }
  }
  for (let i = 0; i < variableList2.length; i++) {
    const variable = variableList2[i];
    if (!variableList1.find(element => element.key === variable.key)) {
      return true;
    }
  }
  return false; 
}

const FileReaderEnhancer = (props) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [highlightContext, setHighlightContext] = useState(false);
  const { currentPrompt: { variables } } = useSelector((state) => state.prompts);
  const [updateVariableList] = useUpdateVariableList()

  const handleInput = useCallback((event) => {
    event.preventDefault();
    setInputValue(event.target.value);
    dispatch(
      promptSliceActions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.context,
        data: event.target.value,
      })
    );
  }, [dispatch]);

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
    const file = event.dataTransfer.files[0];
    const fileName = file.name;
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
        updateVariableList(context)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error parsing File:', error);
      }
    };
  }, [updateVariableList]);

  useEffect(() => {
    const finalVariables = [...variables];
    const newVariables = contextResolver(inputValue).map((variable) => {
      return {
        key: variable,
        value: '',
      };
    });

    for (let i = 0; i < newVariables.length; i++) {
      const variable = newVariables[i];
      if (!variables.find(element => element.key === variable.key)) {
        finalVariables.push(variable)
      }
    }

    const leftVariables = finalVariables.filter((variable) => {
      return inputValue.includes(`{{${variable.key}}}`);
    });

    if (areTwoVariableListNotTheSame(leftVariables, variables)) {
      dispatch(
        promptSliceActions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.variables,
          data: leftVariables,
        })
      );
    }
  }, [dispatch, inputValue, variables]);

  useEffect(() => {
    dispatch(
      promptSliceActions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.context,
        data: inputValue,
      })
    );
  }, [dispatch, inputValue])

  return (
    <StyledInputEnhancer
      editswitcher='true'
      editswitchconfig={{
        inputHeight: PROMPT_PAGE_INPUT.ROWS.Three
      }}
      value={inputValue}
      style={{ backgroundColor: highlightContext ? CONTEXT_HIGHLIGHT_COLOR : '' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onInput={handleInput}
      onBlur={handleBlur}
      {...props}
    />
  );
};

export default FileReaderEnhancer;