
import { PROMPT_PAYLOAD_KEY } from '@/common/constants.js';
import { actions as promptSliceActions } from '@/reducers/prompts';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyledInputEnhancer } from './Common';
import { debounce } from '@/common/utils';

const VariableList = (props) => {
  const dispatch = useDispatch();
  const { currentPrompt: { variables } } = useSelector((state) => state.prompts);

  const handleInput = useCallback(updateKey => (event) => {
    event.preventDefault();
    debounce(() => {
      const value = event.target.value;
      dispatch(
        promptSliceActions.updateSpecificVariable({
          key: PROMPT_PAYLOAD_KEY.variables,
          updateKey,
          data: value,
        })
      );
    }, 500)()
    return;
  }, [dispatch]);

  return (
    <div>
      {variables.map(({ key }, index) => {
        return (
          <StyledInputEnhancer
            key={`${key}-${index}`}
            label={key}
            id={key}
            onInput={handleInput(key)}
            {...props}
          />
        );
      })}
    </div>
  );
};

export default VariableList;