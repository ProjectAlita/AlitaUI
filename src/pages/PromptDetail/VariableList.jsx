
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import { PROMPT_PAYLOAD_KEY } from "@/common/constants.js";
import { actions as promptSliceActions } from "@/reducers/prompts";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyledInputEnhancer } from "./Common"

const VariableList = (props) => {
    const dispatch = useDispatch();
    const { currentPrompt } = useSelector((state) => state.prompts);
    const variables = [].concat(currentPrompt[PROMPT_PAYLOAD_KEY.variables]);
  
    const handleInput = useCallback((event, updateKey) => {
      event.preventDefault();
      const value = event.target.value;
      dispatch(
        promptSliceActions.updateSpecificVariable({
          key: PROMPT_PAYLOAD_KEY.variables,
          updateKey,
          data: value,
        })
      );
      return;
    });
  
    return (
      <div>
        {variables.map(({ key }) => {
          return (
            <StyledInputEnhancer
              key={key}
              label={key}
              onInput={(event) => handleInput(event, key)}
              {...props}
            />
          );
        })}
      </div>
    );
  };

  export default VariableList;