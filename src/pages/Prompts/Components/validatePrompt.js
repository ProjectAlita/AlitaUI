
const variableRegExp = /{{\s*[a-zA-Z_][a-zA-Z0-9_]*\s*}}/g;
const doubleBraceRegExp = /{{.*?}}/g;

const patternResolver = (string = '', patten) => {
  const variables = string.match(patten);
  if (!variables) return [];
  const extractedContent = extractContents(variables);
  return extractedContent.sort();
};

const extractContents = (contentWithPlaceholder = [], pattern) => {
  const placeholders = contentWithPlaceholder.map((str) =>
    str.replace(pattern, '$1')
  );
  return Array.from(new Set(placeholders));
};

export const extractInvalidVariables = (string = '') => {
  const doubleBraceExpressions = patternResolver(string, doubleBraceRegExp);
  const variables = patternResolver(string, variableRegExp);
  const invalidVariables = doubleBraceExpressions.filter(item => !variables.includes(item));
  return invalidVariables.filter((item, index) => invalidVariables.indexOf(item) === index);
}

export const validateVariableSyntax = (string = '') => {
  const invalidVariables = extractInvalidVariables(string);
  return {
    error: !!invalidVariables?.length,
    helperText: invalidVariables?.length ? `Wrong syntax for variables: ${invalidVariables?.join(', ')}` : ''
  };
}

const validatePrompt = (currentPrompt) => {
  const { messages = [], prompt: context = ''} = currentPrompt;
  const invalidVariablesInContext = extractInvalidVariables(context || '');
  const invalidVariables = (messages || []).reduce((accumulator, item) => {
    const invalidVariablesInMessage = extractInvalidVariables(item.content || '');
    const newInvalidVariablesInMessage = invalidVariablesInMessage.filter(invalidVariable => !accumulator.includes(invalidVariable));
    return [
      ...accumulator,
      ...newInvalidVariablesInMessage,
    ];
  }, invalidVariablesInContext);
  return invalidVariables
}

export default validatePrompt;