import { getEncoding } from 'js-tiktoken';
import { reverse } from 'lodash';
import { useCallback, useMemo, useState } from 'react';

const MAX_PERCENTAGE_OF_QUESTION = 0.9;
const encoding = getEncoding('cl100k_base');


// tokenLimit * 0.1 for response
export const getMaxAvailableTokens = (modelTokens) => Math.floor(modelTokens * MAX_PERCENTAGE_OF_QUESTION)

export const ModelTokenLimits = {
  'gpt-3.5-turbo': 4096,
  'gpt-35-turbo': 4096,
  'gpt-3.5-turbo16k': 16384,
  'gpt-4': 8192,
  'gpt-4-0613': 8192,
  'gpt-4-32k': 32768,
  'gpt-4-32k-0613': 32768,
  'text-bison@001': 8192,
  'text-bison': 8192,
  'code-bison@001': 6144,
  'amazon.titan-tg1-large': 4096,
  'anthropic.claude-v2': 100000,
  'ai21.j2-jumbo-instruct': 8192,
  'stability.stable-diffusion-xl': 77,
  'gpt-world': 8192,
  'epam10k-semantic-search': 24000,
  default: 4096,
}

function getMaxTokens(aiModel = 'default') {
  const modelMaxTokens = ModelTokenLimits[aiModel]
  return modelMaxTokens;
}

function getTokens(content) {
  return encoding.encode(content).length;
}

function getFormattedHistory(leftTokens, originalChatHistory) {
  const reversedChatHistory = reverse([...originalChatHistory])
  const chatHistory = []
  let tokenizable = ''
  for (let i = 0; i < reversedChatHistory.length; i++) {
    const message = reversedChatHistory[i]
    if (message.role === 'user') {
      tokenizable += `user says: ${message.message || ''} `
      if (getTokens(tokenizable) <= leftTokens) {
        chatHistory.push(message)
      } else {
        break
      }
    } else if (message.role === 'assistant') {
      tokenizable += `ai: ${message.payload}`
      if (getTokens(tokenizable) <= leftTokens) {
        chatHistory.push(message)
      } else {
        break
      }
    }
  }
  return chatHistory
}

export const calculateChatHistory = (messages, modelName, question) => {
  let chatHistory = [];

  const tokenLimit = getMaxTokens(modelName);
  const maxAvailableTokens = getMaxAvailableTokens(tokenLimit);
  const questionTokens = getTokens(question);
  if (questionTokens < maxAvailableTokens) {
    chatHistory = getFormattedHistory(maxAvailableTokens - questionTokens, messages);
  }

  return chatHistory;
}


export const useCtrlEnterKeyEventsHandler = (onCtrlEnterDown, onEnterDown) => {
  const keysPressed = useMemo(() => ({}), [])
  const [isInComposition, setIsInComposition] = useState(false)
  const onKeyDown = useCallback(
    (event) => {
      if (isInComposition) {
        return
      }
      keysPressed[event.key] = true
      if (keysPressed['Control'] && event.key === 'Enter') {
        onCtrlEnterDown()
      } else if (!keysPressed['Control'] && event.key === 'Enter') {
        onEnterDown()
      }
    },
    [isInComposition, keysPressed, onCtrlEnterDown, onEnterDown],
  )

  const onKeyUp = useCallback(
    (event) => {
      delete keysPressed[event.key]
    },
    [keysPressed],
  )

  const onCompositionStart = useCallback(() => {
    setIsInComposition(true)
  }, [])
  const onCompositionEnd = useCallback(() => {
    setIsInComposition(false)
  }, [])

  return { onKeyDown, onKeyUp, onCompositionStart, onCompositionEnd }
}
