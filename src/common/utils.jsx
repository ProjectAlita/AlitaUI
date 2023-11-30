import { Typography } from '@mui/material';
import { PROMPT_PAYLOAD_KEY } from '@/common/constants.js';

export const renderStatusComponent = ({
  isLoading,
  isSuccess,
  isError,
  successContent,
}) => {
  if (isLoading) {
    return <Typography variant={'body2'}>...</Typography>;
  }

  if (isError) {
    return <Typography variant={'body2'}>Failed to load.</Typography>;
  }

  if (isSuccess) {
    return <div>{successContent}</div>;
  }

  return null;
};

export const getFileFormat = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();

  if (extension === 'json') {
    return 'json';
  } else if (extension === 'yaml' || extension === 'yml') {
    return 'yaml';
  } else {
    throw new Error(`Unsupported file format for ${fileName}`);
  }
};

export const contextResolver = (context = '') => {
  const variables = context.match(/{{\s*\S+?\s*}}/g);
  if (!variables) return [];
  const extractedVariables = extractPlaceholders(variables);
  return extractedVariables;
};

export const extractPlaceholders = (variablesWithPlaceholder = []) => {
  const placeholders = variablesWithPlaceholder.map((str) =>
    str.replace(/{{\s*(\S+)\s*}}/, '$1')
  );
  return Array.from(new Set(placeholders));
};

export const listMapper = (list = [], payloadkey = '') => {
  const map = {};

 if(payloadkey === PROMPT_PAYLOAD_KEY.variables){
  list.forEach(item => {
    map[item.key] = {value: item.value, id: item.id}
  })
 }

  return map;
};

export const getInitials = (name) => {
  if (typeof name !== 'string') {
    throw new TypeError('Name must be a string');
  }

  const names = name.split(' ');

  let firstName = names[0];
  let lastName = names[names.length - 1];
  if (names.length === 1) {
    firstName = name;
    lastName = '';
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return initials;
};

export const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

export const debounce = (fn, delay) => {
  let timer = null;

  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
};

export const buildErrorMessage = (err) => {
  const location = (err?.data || [])[0]?.loc
  const msg = (err?.data || [])[0]?.msg

  return msg + ' at ' + (location || []).join(', ');
};


export const filterProps = (...customProps) => ({
  shouldForwardProp: prop => !customProps.includes(prop)
});

export default renderStatusComponent;
