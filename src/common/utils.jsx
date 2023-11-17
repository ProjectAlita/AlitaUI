import { Typography } from "@mui/material";
import { PROMPT_PAYLOAD_KEY } from '@/common/constants.js';

export const renderStatusComponent = ({
  isLoading,
  isSuccess,
  isError,
  successContent,
}) => {
  if (isLoading) {
    return <Typography variant={"body2"}>...</Typography>;
  }

  if (isError) {
    return <Typography variant={"body2"}>Failed to load.</Typography>;
  }

  if (isSuccess) {
    return <div>{successContent}</div>;
  }

  return null;
};


export const getFileFormat = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  
  if (extension === "json") {
    return "json";
  } else if (extension === "yaml" || extension === "yml") {
    return "yaml";
  } else {
    throw new Error(`Unsupported file format for ${fileName}`);
  }
};

export const contextResolver = (context = "") => {
  const variables = context.match(/{{\s*\S+\s*}}/g);
  if(!variables) return []
  const extractedVariables = extractPlaceholders(variables)
  return extractedVariables;
}

export const extractPlaceholders = (variablesWithPlaceholder = []) => {
  const placeholders = variablesWithPlaceholder.map(str => str.replace(/{{\s*(\S+)\s*}}/, '$1'));
  return Array.from(new Set(placeholders));
}

export const listMapper = (list = [], payloadkey = '') => {
  const map = {};

 if(payloadkey === PROMPT_PAYLOAD_KEY.variables){
  list.forEach(item => {
    map[item.key] = item.value
  })
 }

  return map;
}

export default renderStatusComponent;