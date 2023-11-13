import { PROMPT_PAYLOAD_KEY } from "@/common/constants.js";
import { contextResolver } from "@/common/utils";
import { actions as promptSliceActions } from "@/reducers/prompts";
import { Avatar, Grid, TextField, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const StyledGridContainer = styled(Grid)(() => ({
  padding: 0,
}));

export const VersionSelectContainer = styled('div')(() => ({
  display: "inline-block",
  marginRight: "2rem",
  width: "4rem",
}));

export const LeftGridItem = styled(Grid)(() => ({
  position: "relative",
  padding: "0 0.75rem",
}));

export const RightGridItem = styled(Grid)(() => ({
  padding: "0 0.75rem",
}));

export const StyledInput = styled(TextField)(() => ({
  marginBottom: "0.75rem",
  "& .MuiFormLabel-root": {
    fontSize: "0.875rem",
    lineHeight: "1.375rem",
    top: "-0.25rem",
    left: "0.75rem",
  },
  "& .MuiInputBase-root": {
    padding: "1rem 0.75rem",
    marginTop: "0",
  },
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: "1.75rem",
  height: "1.75rem",
  display: "flex",
  flex: "0 0 1.75rem",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.secondary.main,
}));

export const TabBarItems = styled("div")(() => ({
  position: "absolute",
  top: "-3.7rem",
  right: "0.5rem",
}));

export const SelectLabel = styled(Typography)(() => ({
  display: "inline-block",
}));

export const StyledInputEnhancer = (props) => {
    const dispatch = useDispatch();
    const { payloadkey, label } = props;
    const { currentPrompt } = useSelector((state) => state.prompts);
    let theValue = currentPrompt && currentPrompt[payloadkey];
    if (payloadkey === PROMPT_PAYLOAD_KEY.variables) {
      theValue = theValue.find((item) => item.key === label).value;
    }
    const [value, setValue] = useState(
      payloadkey === PROMPT_PAYLOAD_KEY.tags
        ? theValue?.map((tag) => tag?.tag).join(",")
        : theValue
    );
    const handlers = {
      onBlur: useCallback((event) => {
        if (payloadkey === PROMPT_PAYLOAD_KEY.variables) return;
        const { target } = event;
        const inputValue = target?.value;
        if (payloadkey === PROMPT_PAYLOAD_KEY.context) {
          dispatch(
            promptSliceActions.updateCurrentPromptData({
              key: PROMPT_PAYLOAD_KEY.variables,
              data: contextResolver(inputValue).map((variable) => {
                return {
                  key: variable,
                  value: "",
                };
              }),
            })
          );
        } else {
          dispatch(
            promptSliceActions.updateCurrentPromptData({
              key: payloadkey,
              data:
                payloadkey === PROMPT_PAYLOAD_KEY.tags
                  ? target?.value?.split(",")
                  : target?.value,
            })
          );
        }
      }, [dispatch, payloadkey]),
      onChange: useCallback((event) => {
        const { target } = event;
        setValue(target?.value);
      }, []),
    };
    return <StyledInput 
      variant="standard"
      fullWidth
      value={value} 
      {...handlers} 
      {...props} 
    />;
  };