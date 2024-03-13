import { debounce, getFileFormat } from '@/common/utils';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import Toast from '@/components/Toast.jsx';
import { useTheme } from '@emotion/react';
import YAML from 'js-yaml';
import { useCallback, useEffect, useState } from 'react';

const FileReaderEnhancer = ({
  defaultValue,
  updateVariableList,
  onChange,
  ...props
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(defaultValue);
  const [highlightContext, setHighlightContext] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorMessageToast, setOpenErrorMessageToast] = useState(false);

  const handleInput = useCallback((event) => {
    event.preventDefault();
    setInputValue(event.target.value);
    debounce(() => {
      updateVariableList(event.target.value)
      onChange(event.target.value)
    }, 500)()
  }, [onChange, updateVariableList]);

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
          fileData = { context: JSON.stringify(yamlData) };
        }else {
          fileData = { context: dataString };
        }
        const { context } = fileData;
        setInputValue(context);
        onChange(context)
        updateVariableList(context)
      } catch (error) {
        setOpenErrorMessageToast(true);
        setErrorMessage('Error parsing File: Unsupported format');
      }
    };
  }, [onChange, updateVariableList]);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

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