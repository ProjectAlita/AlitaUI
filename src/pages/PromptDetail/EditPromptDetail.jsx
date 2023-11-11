/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import { useGetModelsQuery } from "@/api/integrations";
import { PROMPT_PAYLOAD_KEY, SOURCE_PROJECT_ID } from "@/common/constants.js";
import BasicAccordion from "@/components/BasicAccordion";
import Button from "@/components/Button";
import ChatBox from "@/components/ChatBox/ChatBox";
import SettingIcon from "@/components/Icons/SettingIcon";
import SingleSelect from "@/components/SingleSelect";
import Slider from "@/components/Slider";
import { actions as promptSliceActions } from "@/reducers/prompts";
import { Avatar, Grid, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFileFormat, contextResolver } from "@/common/utils";
import YAML from "js-yaml";
import Messages from "./Messages";

const StyledGridContainer = styled(Grid)(() => ({
  padding: 0,
}));

const LeftGridItem = styled(Grid)(() => ({
  position: "relative",
  padding: "0 0.75rem",
}));

const RrightGridItem = styled(Grid)(() => ({
  padding: "0 0.75rem",
}));

const StyledInput = styled(TextField)(() => ({
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

const StyledInputEnhancer = (props) => {
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
    }, []),
    onChange: useCallback((event) => {
      const { target } = event;
      setValue(target?.value);
    }),
  };
  return <StyledInput value={value} {...handlers} {...props} />;
};

const FileReaderEnhancer = (props) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [highlightContext, setHighlightContext] = useState(false);

  const updateVariables = (context) => {
    dispatch(
      promptSliceActions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.variables,
        data: contextResolver(context).map((variable) => {
          return {
            key: variable,
            value: "",
          };
        }),
      })
    );
  };

  const handleInput = useCallback((event) => {
    event.preventDefault();
    setInputValue(event.target.value);
  });

  const handleDragOver = useCallback(() => {
    (event) => event.preventDefault();
    if (highlightContext) return;
    setHighlightContext(true);
  });

  const handleDragLeave = useCallback(() => {
    (event) => event.preventDefault();
    setHighlightContext(false);
  });

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setHighlightContext(false);

    const file = event.dataTransfer.files[0];
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        let fileData = null;
        const fileFormat = getFileFormat(fileName);
        const dataString = reader.result;
        if (fileFormat === "yaml") {
          const yamlData = YAML.load(dataString);
          fileData = yamlData;
        } else {
          const jsonData = JSON.parse(dataString);
          fileData = jsonData;
        }
        const { context } = fileData;
        updateVariables(context || "");
        setInputValue(context);
      } catch (error) {
        console.error("Error parsing File:", error);
      }
    };

    reader.readAsText(file);
  });

  return (
    <StyledInputEnhancer
      value={inputValue}
      style={{ backgroundColor: highlightContext ? "#3d3d3d" : "" }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onInput={handleInput}
      {...props}
    />
  );
};

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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: "1.75rem",
  height: "1.75rem",
  display: "flex",
  flex: "0 0 1.75rem",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.secondary.main,
}));

const TabBarItems = styled("div")(() => ({
  position: "absolute",
  top: "-3.7rem",
  right: "0.5rem",
}));

const SelectLabel = styled(Typography)(() => ({
  display: "inline-block",
}));

const promptDetailLeft = [
  {
    title: "General",
    content: (
      <div>
        <StyledInputEnhancer
          payloadkey={PROMPT_PAYLOAD_KEY.name}
          id="prompt-name"
          label="Name"
          variant="standard"
          fullWidth
        />
        <StyledInputEnhancer
          payloadkey={PROMPT_PAYLOAD_KEY.description}
          id="prompt-desc"
          label="Description"
          multiline
          variant="standard"
          fullWidth
        />
        <StyledInputEnhancer
          payloadkey={PROMPT_PAYLOAD_KEY.tags}
          id="prompt-tags"
          label="Tags"
          multiline
          variant="standard"
          fullWidth
        />
      </div>
    ),
  },
  {
    title: "Context",
    content: (
      <div>
        <FileReaderEnhancer
          payloadkey={PROMPT_PAYLOAD_KEY.context}
          id="prompt-context"
          label="Context (??? hint or label)"
          multiline
          variant="standard"
          fullWidth
        />
      </div>
    ),
  },
];

const RightContent = () => {
  const { isSuccess, data } = useGetModelsQuery(SOURCE_PROJECT_ID);
  const [modelOptions, setModelOptions] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      setModelOptions(
        data &&
          data[0].settings?.models?.map(({ name }) => ({
            label: name,
            value: name,
          }))
      );
    }
  }, [data, isSuccess]);

  const {
    id,
    context = "",
    messages = [],
    variables = {},
    model_name = "gpt-3.5-turbo",
    temperature = 1,
    top_p = 0.5,
    max_tokens = 117,
  } = useSelector((state) => state.prompts.currentPrompt);

  return (
    <>
      <BasicAccordion
        items={[
          {
            title: "Variables",
            content: (
              <div>
                <VariableList
                  payloadkey={PROMPT_PAYLOAD_KEY.variables}
                  id="prompt-variables"
                  multiline
                  variant="standard"
                  fullWidth
                />
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  <div style={{ flex: 8, paddingRight: "1rem" }}>
                    <SingleSelect label={"Model"} options={modelOptions} />
                  </div>
                  <div style={{ flex: 6 }}>
                    <Slider
                      label="Temperature"
                      defaultValue={0.7}
                      range={[0, 1]}
                    />
                  </div>
                  <StyledAvatar>
                    <SettingIcon fontSize="1rem" />
                  </StyledAvatar>
                </div>
              </div>
            ),
          },
        ]}
      ></BasicAccordion>
      <ChatBox
        prompt_id={id}
        integration_uid="133f1010-fe15-46a5-ad5b-907332a0635e"
        model_name={model_name}
        temperature={temperature}
        context={context}
        chat_history={messages}
        max_tokens={max_tokens}
        top_p={top_p}
        variables={variables}
      />
    </>
  );
};

export default function EditPromptDetail({ onSave }) {
  const navigate = useNavigate();

  const onCancel = useCallback(() => {
    navigate("/");
  });

  return (
    <StyledGridContainer container>
      <LeftGridItem item xs={12} lg={6}>
        <TabBarItems>
          <SelectLabel variant="body2">Version</SelectLabel>
          <div
            style={{
              display: "inline-block",
              marginRight: "2rem",
              width: "4rem",
            }}
          >
            <SingleSelect options={[]} />{" "}
          </div>
          <Button variant="contained" color="secondary" onClick={onSave}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </TabBarItems>
        <BasicAccordion items={promptDetailLeft}></BasicAccordion>
        <Messages />
      </LeftGridItem>
      <RrightGridItem item xs={12} lg={6}>
        <RightContent />
      </RrightGridItem>
    </StyledGridContainer>
  );
}
