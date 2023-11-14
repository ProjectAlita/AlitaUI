import { PROMPT_PAYLOAD_KEY } from "@/common/constants.js";
import { contextResolver, getFileFormat } from "@/common/utils";
import { actions as promptSliceActions } from "@/reducers/prompts";
import YAML from "js-yaml";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyledInputEnhancer } from "./Common";

const FileReaderEnhancer = (props) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [highlightContext, setHighlightContext] = useState(false);
  const { currentPrompt: { variables } } = useSelector((state) => state.prompts);

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
    reader.onload = () => {
      try {
        let fileData = null;
        const fileFormat = getFileFormat(fileName);
        const dataString = reader.result;
        if (fileFormat === "yaml") {
          const yamlData = YAML.load(dataString);
          fileData = yamlData;
        } else {
          const jsonData = JSON.parse(dataString);
          fileData = jsonData;
        }
        const { context } = fileData;
        setInputValue(context);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error parsing File:", error);
      }
    };
    reader.readAsText(file);
  }, []);

  useEffect(() => {
    const finalVariables = [...variables];
    const newVariables = contextResolver(inputValue).map((variable) => {
      return {
        key: variable,
        value: "",
      };
    });

    let foundNew = false
    for (let i = 0; i < newVariables.length; i++) {
      const variable = newVariables[i];
      if (!variables.find(element => element.key === variable.key)) {
        foundNew = true;
        finalVariables.push(variable)
      }
    }

    if (foundNew) {
      const leftVariables = finalVariables.filter((variable) => {
        return inputValue.includes(`{{${variable.key}}}`);
      });
      if (leftVariables.length) {
        dispatch(
          promptSliceActions.updateCurrentPromptData({
            key: PROMPT_PAYLOAD_KEY.variables,
            data: leftVariables,
          })
        );
      }
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
      value={inputValue}
      style={{ backgroundColor: highlightContext ? "#3d3d3d" : "" }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onInput={handleInput}
      {...props}
    />
  );
};

export default FileReaderEnhancer;