/* eslint-disable */
import BasicAccordion, {AccordionShowMode} from "@/components/BasicAccordion.jsx";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import StyledInputEnhancer from "@/components/StyledInputEnhancer.jsx";
import TagEditor from "@/pages/EditPrompt/Form/TagEditor.jsx";
import NormalRoundButton from "@/components/NormalRoundButton.jsx";
import {StyledCircleProgress} from "@/components/ChatBox/StyledComponents.jsx";
import React, {useEffect, useState} from "react";
import StyledButton from "@/components/Button.jsx";
import SingleSelect from "@/components/SingleSelect.jsx";
import {useDatasourceCreateMutation} from "@/api/datasources.js";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import RouteDefinitions from "@/routes.js";
import {isString} from "formik";

const storages = [
  {value: 1, label: 'Chroma'},
  {value: 2, label: 'PGVector'},
]
const embeddingModels = [
  {value: 1, label: 'model 1'},
  {value: 2, label: 'model 2'},
  {value: 3, label: 'model 3'},
  {value: 4, label: 'model 4'},
]

const DatasourceCreateForm = () => {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  const [description, setDescription] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

  const [tags, setTags] = useState([])

  const [storage, setStorage] = useState('')
  const [embeddingModel, setEmbeddingModel] = useState('')

  const {personal_project_id: privateProjectId} = useSelector(state => state.user)
  const navigate = useNavigate()

  const onChangeName = e => setName(e.target.value)
  const onChangeDescription = e => setDescription(e.target.value)
  const onChangeTags = tags => setTags(tags)

  const handleSelectModel = (value) => {
    console.log(value)
    setEmbeddingModel(value)
  }

  const handleCreate = async () => {
    console.log({name, description, tags})
    await createRequest({
      name, description, storage,
      projectId: privateProjectId,
      embedding_model: embeddingModel,
      versions: [
        {
          name: 'latest',
          tags
        }
      ]
    })
  }
  const handleCancel = () => {
    navigate(-1)
  }
  const [createRequest, {error, data, isLoading}] = useDatasourceCreateMutation()

  useEffect(() => {
    if (error) {
      // todo: handle generic errors
      isString(error.data) ?
        console.error(error) :
        error.data?.forEach(i => {
          const {ctx, loc, msg, type} = i
          switch (loc[0]) {
            case 'name':
              setNameError(msg)
              break
            case 'description':
              setDescriptionError(msg)
              break
            default:
              console.warn('Unhandled error', i)
          }
        })
    } else {
      setNameError('')
      setDescriptionError('')
    }
  }, [error])

  useEffect(() => {
    if (data) {
      const {id} = data
      data && navigate(`${RouteDefinitions.MyLibrary}${RouteDefinitions.DataSources}/${id}`)
    }
  }, [data]);


  return (
    <BasicAccordion
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'General',
          content: (
            <Box>
              <StyledInputEnhancer
                autoComplete="off"
                id='name'
                label={'Name'}
                required
                value={name}
                error={!!nameError}
                helperText={nameError}
                onChange={onChangeName}
                // onBlur={onNameBlur}
              />
              <StyledInputEnhancer
                autoComplete="off"
                // showexpandicon='true'
                id='datasource-desc'
                label={'Description'}
                multiline
                maxRows={10}
                onChange={onChangeDescription}
                value={description}
                // onBlur={onDescriptionBlur}
                error={!!descriptionError}
                helperText={descriptionError}
              />
              <TagEditor
                id='tags'
                label='Tags'
                tagList={[]}
                stateTags={tags}
                onChangeTags={onChangeTags}
              />
              <Box mt={2}>
                {/*<SingleSelect*/}
                {/*  onValueChange={handleSelectModel}*/}
                {/*  value={embeddingModel}*/}
                {/*  displayEmpty*/}
                {/*  options={embeddingModels}*/}
                {/*  // sx={selectSX}*/}
                {/*  // disabled={disabled}*/}
                {/*/>*/}
                <FormControl fullWidth>
                  <InputLabel>Model</InputLabel>
                  <Select
                    variant={'standard'}
                    value={embeddingModel}
                    onChange={e => handleSelectModel(e.target.value)}
                    label="Model"
                    fullWidth
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    {embeddingModels.map(i =>
                      <MenuItem value={i.value} key={i.value}>{i.label}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Box>

              <Box mt={2}>
                <SingleSelect
                  onValueChange={value => setStorage(value)}
                  value={storage}
                  displayEmpty
                  options={storages}
                  // sx={selectSX}
                  // disabled={disabled}
                />
              </Box>

              <Box sx={{display: 'flex', flexDirection: 'row', marginTop: '20px'}}>
                <NormalRoundButton variant='contained' onClick={handleCreate}>
                  Create
                  {
                    isLoading && <StyledCircleProgress size={16}/>
                  }
                </NormalRoundButton>
                <StyledButton onClick={handleCancel}>
                  Cancel
                </StyledButton>
              </Box>
            </Box>
          ),
        }
      ]}/>
  )
}

export default DatasourceCreateForm