
import { PROMPT_PAYLOAD_KEY } from '@/common/constants.js';
import { actions as promptSliceActions } from '@/slices/prompts';
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material'
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import { useTheme } from '@emotion/react';

const Variable = ({ id, label, value, isFirstRender, ...props }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [variableValue, setVariableValue] = useState(value);
  const firstRender = useRef(true);
  const [showActiveIndicator, setShowActiveIndicator] = useState(false);
  const handleInput = useCallback((event) => {
    event.preventDefault();
    setVariableValue(event.target.value);
  }, []);

  const onBlur = useCallback(
    () => {
      if (value !== variableValue) {
        dispatch(
          promptSliceActions.updateSpecificVariable({
            key: PROMPT_PAYLOAD_KEY.variables,
            updateKey: label,
            data: variableValue,
          })
        );
      }
    },
    [dispatch, label, value, variableValue],
  )

  useEffect(() => {
    if (firstRender.current && !isFirstRender) {
      setShowActiveIndicator(true);
      setTimeout(() => {
        setShowActiveIndicator(false);
      }, 5000);
    }
    firstRender.current = false;
  }, [isFirstRender])

  return (
    <Box sx={{ position: 'relative' }} >
      <StyledInputEnhancer
        label={label}
        id={id}
        value={variableValue}
        onInput={handleInput}
        onBlur={onBlur}
        {...props}
      />
      {showActiveIndicator && <Box sx={{
        position: 'absolute',
        left: '-10px',
        top: 'calc(50% - 12px)',
        borderRadius: '3px;',
        background: theme.palette.status.published,
        width: '4px;',
        height: ' 24px;',
        flexShrink: '0;',
      }} />}
    </Box>
  )
}

const VariableList = (props) => {
  const { currentPrompt } = useSelector((state) => state.prompts);
  const variables = useMemo(() => currentPrompt.variables, [currentPrompt.variables])
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, [])

  return (
    <div>
      {variables.map(({ key, value }) => {
        return (
          <Variable
            key={key}
            label={key}
            id={key}
            value={value}
            isFirstRender={isFirstRender.current}
            {...props}
          />
        );
      })}
    </div>
  );
};

export default VariableList;