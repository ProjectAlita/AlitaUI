import { Typography } from '@mui/material';
import { PROMPT_PAYLOAD_KEY, PromptStatus, TIME_FORMAT } from '@/common/constants.js';

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

  if (extension === 'yaml' || extension === 'yml') {
    return 'yaml';
  }
  return extension
};

export const contextResolver = (context = '') => {
  const variables = context.match(/{{\s*[a-zA-Z_][a-zA-Z0-9_]*\s*}}/g);
  if (!variables) return [];
  const extractedVariables = extractPlaceholders(variables);
  return extractedVariables.sort();
};

export const extractPlaceholders = (variablesWithPlaceholder = []) => {
  const placeholders = variablesWithPlaceholder.map((str) =>
    str.replace(/{{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*}}/, '$1')
  );
  return Array.from(new Set(placeholders));
};

export const listMapper = (list = [], payloadkey = '') => {
  const map = {};

  if (payloadkey === PROMPT_PAYLOAD_KEY.variables) {
    list.forEach(item => {
      map[item.key] = { value: item.value, id: item.id }
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
  if (err?.data?.message) {
    return err?.data?.message;
  }
  if (err?.data?.error) {
    return err?.data?.error;
  }
  const location = (err?.data || [])[0]?.loc
  const msg = (err?.data || [])[0]?.msg
  if (location && msg) {
    return msg + ' at ' + (location || []).join(', ');
  } else {
    return typeof err === 'string' ? err : err?.data;
  }
};


export const filterProps = (...customProps) => ({
  shouldForwardProp: prop => !customProps.includes(prop)
});

export const getStatusColor = (status, theme) => {
  switch (status) {
    case PromptStatus.Draft:
      return theme.palette.status.draft;
    case PromptStatus.OnModeration:
      return theme.palette.status.onModeration;
    case PromptStatus.Published:
      return theme.palette.status.published;
    case PromptStatus.Rejected:
      return theme.palette.status.rejected;
    default:
      return theme.palette.status.userApproval;
  }
}

const convertToDDMMYYYY = (dateString) => {
  const dateObj = new Date(dateString);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString();
  return `${day}.${month}.${year}`;
}

export const timeFormatter = (timeStamp = '', format) => {
  switch (format) {
    case TIME_FORMAT.DDMMYYYY:
      return convertToDDMMYYYY(timeStamp)
    default:
      return 'unknow date'
  }
}

export const deduplicateVersionByAuthor = (versions = []) => {
  if(Array.isArray(versions)){
    return Array.from(new Set(versions.map(version => `${version?.author?.name||''}|${version?.author?.avatar||''}|${version?.author?.id||''}`)))
  }
  return [];
}

export const downloadJSONFile = (data, filename = '') => {
  const blobData = new Blob([JSON.stringify(data?.data || {})], { type: "application/json" });
  const url = URL.createObjectURL(blobData);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const filterByElements = (collection = [], elements = []) => {
  const filteredCollection =  collection.filter(prompt => {
    const { tags } = prompt;
    return tags.some(tag => {
        const {name} = tag;
        return elements.includes(name);
    })
  })

  return filteredCollection.length? filteredCollection: collection
}

export default renderStatusComponent;
