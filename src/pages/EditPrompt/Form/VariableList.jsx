
import { PROMPT_PAYLOAD_KEY } from '@/common/constants.js';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';

const Variable = ({id, label, value, ...props}) => {
  const dispatch = useDispatch();
  const [variableValue, setVariableValue] = useState(value);
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

  return (
    <StyledInputEnhancer
      label={label}
      id={id}
      value={variableValue}
      onInput={handleInput}
      onBlur={onBlur}
      {...props}
    />
  )
}

const VariableList = (props) => {
  const { currentPrompt } = useSelector((state) => state.prompts);
  const variables = useMemo(() => currentPrompt.variables, [currentPrompt.variables])

  return (
    <div>
      {variables.map(({ key, value }) => {
        return (
          <Variable
            key={key}
            label={key}
            id={key}
            value={value}
            {...props}
          />
        );
      })}
    </div>
  );
};

export default VariableList;