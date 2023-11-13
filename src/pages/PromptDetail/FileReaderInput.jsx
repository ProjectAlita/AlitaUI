/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { PROMPT_PAYLOAD_KEY } from "@/common/constants.js";
import { actions as promptSliceActions } from "@/reducers/prompts";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { getFileFormat, contextResolver } from "@/common/utils";
import { StyledInputEnhancer } from "./Common"
import YAML from "js-yaml";

const FileReaderEnhancer = (props) => {
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState("");
    const [highlightContext, setHighlightContext] = useState(false);
  
    const updateVariables = (context) => {
      dispatch(
        promptSliceActions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.variables,
          data: contextResolver(context).map((variable) => {
            return {
              key: variable,
              value: "",
            };
          }),
        })
      );
    };
  
    const handleInput = useCallback((event) => {
      event.preventDefault();
      setInputValue(event.target.value);
    });
  
    const handleDragOver = useCallback(() => {
      (event) => event.preventDefault();
      if (highlightContext) return;
      setHighlightContext(true);
    });
  
    const handleDragLeave = useCallback(() => {
      (event) => event.preventDefault();
      setHighlightContext(false);
    });
  
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
          updateVariables(context || "");
          setInputValue(context);
        } catch (error) {
          console.error("Error parsing File:", error);
        }
      };
  
      reader.readAsText(file);
    });
  
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