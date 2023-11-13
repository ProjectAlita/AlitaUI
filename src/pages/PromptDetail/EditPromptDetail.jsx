/* eslint-disable react-hooks/exhaustive-deps */
import { useGetModelsQuery } from "@/api/integrations";
import { PROMPT_PAYLOAD_KEY, SOURCE_PROJECT_ID } from "@/common/constants.js";
import { StyledGridContainer, LeftGridItem, RrightGridItem, StyledInputEnhancer, StyledAvatar, TabBarItems, SelectLabel } from "./Common"
import FileReaderEnhancer from "./FileReaderInput"
import VariableList from "./VariableList"
import BasicAccordion from "@/components/BasicAccordion";
import Button from "@/components/Button";
import ChatBox from "@/components/ChatBox/ChatBox";
import SettingIcon from "@/components/Icons/SettingIcon";
import SingleSelect from "@/components/SingleSelect";
import Slider from "@/components/Slider";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Messages from "./Messages";

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
            <SingleSelect options={[]} />
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
