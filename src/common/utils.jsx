import { Typography } from '@mui/material';
import { PROMPT_PAYLOAD_KEY, PromptStatus, SortFields, TIME_FORMAT } from '@/common/constants.js';

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
  if (err?.originalStatus === 404) {
    return "The requested resource was not found!";
  }
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
  if (!dateString) {
    return '';
  }
  const dateObj = new Date(dateString);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString();
  return `${day}.${month}.${year}`;
}

const convertToMMMDD = (dateString) => {
  if (!dateString) {
    return '';
  }
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateObj = new Date(dateString);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = monthNames[dateObj.getMonth()];
  return `${month}, ${day}`;
}

export const timeFormatter = (timeStamp = '', format) => {
  switch (format) {
    case TIME_FORMAT.DDMMYYYY:
      return convertToDDMMYYYY(timeStamp);
    case TIME_FORMAT.MMMDD:
      return convertToMMMDD(timeStamp);
    default:
      return 'unknow date'
  }
}

export const deduplicateVersionByAuthor = (versions = []) => {
  if (Array.isArray(versions)) {
    return Array.from(new Set(versions.map(version => `${version?.author?.name || ''}|${version?.author?.avatar || ''}|${version?.author?.id || ''}`)))
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



export const downloadFile = ({
  url,
  filename,
  handleError = () => { }
}) => {
  if (!url) return;

  fetch(url, {
    method: 'GET',
    // headers: new Headers({
    //   'Content-Type': 'application/octet-stream',
    // }),
  })
    .then(response => response.blob())
    .then(blob => {
      // Create a new URL for the blob object
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to download the blob
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = filename || 'file';

      // Append the anchor to the body, click it, and then remove it
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Revoke the blob URL after the download
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(error => handleError(error));
}

export const filterByElements = (collection = [], elements = []) => {
  const filteredCollection = collection.filter(prompt => {
    const { tags } = prompt;
    return tags.some(tag => {
      const { name } = tag;
      return elements.includes(name);
    })
  })

  return filteredCollection.length ? filteredCollection : collection
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function descendingComparatorAuthors(a, b) {
  const accessor = (x) => Object.prototype.hasOwnProperty.call(x, SortFields.Authors) ?
    (x?.authors[0]?.name ?? '') :
    (x?.author?.name ?? '');
  if (accessor(b) < accessor(a)) {
    return -1;
  }
  if (accessor(b) > accessor(a)) {
    return 1;
  }

  return 0;
}

export function getComparator(order, orderBy) {
  if (orderBy === SortFields.Authors) {
    return order === 'desc'
      ? (a, b) => descendingComparatorAuthors(a, b)
      : (a, b) => -descendingComparatorAuthors(a, b);
  }
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
export function escapeString(string) {
  const symbolsRegExp = /[.*+\-?^${}()|[\]\\]/g;
  return string.replace(symbolsRegExp, '\\$&');
}

export function splitStringByKeyword(string, keyword) {
  const resultArray = [];
  if (keyword) {
    const regexp = new RegExp(`(${escapeString(keyword)})`, 'gi');
    const splittedStrings = string ? string.split(regexp) : [];
    for (let index = 0; index < splittedStrings.length; index++) {
      const element = splittedStrings[index];
      resultArray.push({
        text: element,
        highlight: regexp.test(element),
      });
    }
  } else {
    resultArray.push({
      text: string,
      highlight: false,
    });
  }

  return resultArray;
}

export const removeDuplicateObjects = (objects = []) => {
  const uniqueData = [];
  const idsSet = new Set();

  objects.forEach(item => {
    if (!idsSet.has(item.id)) {
      idsSet.add(item.id);
      uniqueData.push(item);
    }
  });

  return uniqueData;
}

export const sortByCreatedAt = (a, b) => {
  if (a.created_at < b.created_at) {
    return 1;
  } else if (a.created_at > b.created_at) {
    return -1;
  } else {
    return 0;
  }
}

const DAY_IN_MILLISECONDS = 24 * 3600 * 1000;
export const calculateExpiryInDays = (expiration) => {
  const currentTime = new Date().getTime();
  const expiryTime = new Date(expiration).getTime();
  const duration = expiryTime - currentTime;
  if (duration > DAY_IN_MILLISECONDS) {
    return Math.round(duration / DAY_IN_MILLISECONDS);
  } else if (duration > 0) {
    return 1;
  }
  return 0;
}

const copyToClipboard = text => {
  const textField = document.createElement('textarea')
  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()
}

export const handleCopy = text => {
  navigator ? navigator.clipboard.writeText(text) : copyToClipboard(text)
}

export function capitalizeFirstChar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function handleDeploymentName(name) {
  return name.split('_').filter(word => !!word).map(word => {
    if (word.toLowerCase() === 'ai') {
      return 'AI'
    } else {
      return capitalizeFirstChar(word);
    }
  }).join(' ');
}

export const accessObjectProperty = (object, path) => {
  return path.split('.').reduce((o, i) => o[i], object)
}

export const stringToList = (valueString, delimiter = ',') => {
  if (valueString && typeof valueString === 'string') {
    return valueString.split(delimiter).filter(item => !!item.length).map(item => item.trim());
  } else if (Array.isArray(valueString)) {
    return Array.isArray;
  }
  return []
}


export function deepCloneObject(obj) {
  // null, 0, false
  if (!obj) {
    return obj;
  }
  // Array
  if (Array.isArray(obj)) {
    return obj.map(val => deepCloneObject(val));
  }
  // Object
  if (typeof obj === 'object') {
    const result = {};
    Object.keys(obj).forEach(key => {
      result[key] = deepCloneObject(obj[key]);
    });
    return result;
  }
  // Anything else
  return obj;
}

export const updateObjectByPath = (object, path, value) => {
  const pathParts = path.split('.');
  const theNewObject = deepCloneObject(object);
  let obj = theNewObject;
  pathParts.forEach((part, index) => {
    if (obj[part]) {
      if (index < pathParts.length - 1) {
        obj = obj[part];
      } else {
        if ((typeof obj[part] === 'object' || !obj[part]) && typeof value === 'object') {
          obj[part] = {
            ...(obj[part] || {}),
            ...value,
          };
        } else {
          obj[part] = value;
        }
      }
    } else if (index < pathParts.length - 1) {
      obj[part] = {}
      obj = obj[part]
    } else {
      if ((typeof obj[part] === 'object' || !obj[part]) && typeof value === 'object') {
        obj[part] = {
          ...(obj[part] || {}),
          ...value,
        };
      } else {
        obj[part] = value;
      }
    }
  });
  return theNewObject;
};

export const openAPIExtract = (openAPIJson) => {
  if (openAPIJson) {
    const result = [];
    const paths = openAPIJson.paths || {};
    const names = Object.keys(paths);
    for (let index = 0; index < names.length; index++) {
      const method = Object.keys(paths[names[index]])[0]
      result.push({
        name: paths[names[index]][method].operationId || paths[names[index]][method].name,
        path: names[index],
        method,
        description: paths[names[index]][method].description || paths[names[index]][method].summary,

      })
    }
    return result
  }
  return []
};

export default renderStatusComponent;
