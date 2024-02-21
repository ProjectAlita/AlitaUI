/* eslint react/jsx-no-bind: 0 */
import { Box, Grid, Typography } from "@mui/material";
import StyledTabs from "@/components/StyledTabs.jsx";
import RocketIcon from "@/components/Icons/RocketIcon.jsx";
import ChatForm from "@/pages/DataSources/Components/ChatForm.jsx";
import DataSets from "@/pages/DataSources/Components/DataSets.jsx";
import { useLazyDatasourceDetailsQuery } from "@/api/datasources.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { ContentContainer, PromptDetailSkeleton, StyledGridContainer, StyledInput } from "@/pages/EditPrompt/Common.jsx";
import TagEditor from "@/pages/EditPrompt/Form/TagEditor.jsx";
import BasicAccordion, { AccordionShowMode } from "@/components/BasicAccordion.jsx";
import { storages } from './Components/DatasourceCreateForm';
import DataSourceDetailToolbar from './Components/DataSourceDetailToolbar';

const EditDatasource = () => {
  const { datasourceId } = useParams()
  const { personal_project_id: privateProjectId } = useSelector(state => state.user)
  const [fetchFn, { data: datasourceData, isFetching }] = useLazyDatasourceDetailsQuery()
  const storageName = useMemo(() => storages.find(item => item.value == datasourceData?.storage)?.label, [datasourceData?.storage])
  useEffect(() => {
    privateProjectId && datasourceId && fetchFn({ projectId: privateProjectId, datasourceId }, true)
  }, [privateProjectId, datasourceId, fetchFn])

  return (
    <Grid container sx={{ padding: '0.5rem 0rem', position: 'fixed', marginTop: '0.7rem' }}>
      <Grid item xs={12} >
        <StyledTabs
          key={datasourceData?.name}
          tabSX={{ paddingX: '24px'}}
          tabs={[{
            label: 'Run',
            icon: <RocketIcon />,
            tabBarItems: <div />,
            rightToolbar: isFetching ? null : <DataSourceDetailToolbar name={datasourceData?.name} />,
            content:
              isFetching ? <PromptDetailSkeleton /> : 
                <StyledGridContainer container spacing={'32px'} sx={{ paddingTop: '24px', paddingX: '24px' }}>
                <Grid item xs={12} lg={6}>
                  <ContentContainer>
                    <BasicAccordion
                      showMode={AccordionShowMode.LeftMode}
                      items={[
                        {
                          title: 'General',
                          content: (
                            <>
                              <Box><Typography variant='headingMedium'>{datasourceData?.name}</Typography></Box>
                              <Box mt={1}><Typography variant='bodySmall'>{datasourceData?.description}</Typography></Box>
                              <Box my={1}>
                                <Typography variant='bodySmall'>Embedding model: </Typography>
                                <Typography variant='headingSmall'>{datasourceData?.embedding_model_settings?.model_name}</Typography>
                                <Typography variant='bodySmall' ml={2}>Storage: </Typography>
                                <Typography variant='headingSmall'>{storageName}</Typography>
                              </Box>
                              <TagEditor
                                label='Tags'
                                tagList={datasourceData?.version_details?.tags || []}
                                stateTags={datasourceData?.version_details?.tags || []}
                                disabled={true}
                                onChangeTags={() => {}}
                              />
                            </>
                          ),
                        },
                        {
                          title: 'Context',
                          content: (
                            <>
                              <StyledInput
                                // sx={{paddingTop: '4px'}}
                                variant='standard'
                                fullWidth
                                // required
                                // name='context'
                                label='Context'
                                // value={context}
                                // onChange={formik.handleChange}
                                // onBlur={formik.handleBlur}
                                // error={!!errors?.name && touched?.name}
                                // helperText={touched?.name ? errors?.name : ''}
                              />
                            </>
                          ),
                        }
                      ]}/>
                    <DataSets 
                      datasetItems={datasourceData?.version_details?.datasets || []} 
                      datasourceId={datasourceId}
                      versionId={datasourceData?.version_details?.id}
                    />
                  </ContentContainer>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <ContentContainer>
                    <ChatForm/>
                  </ContentContainer>
                </Grid>
              </StyledGridContainer>,
          }, {
            label: 'Test',
            tabBarItems: null,
            content: <></>,
            display: 'none',
          }]}
        />
      </Grid>
    </Grid>
  )
}
export default EditDatasource