/* eslint react/jsx-no-bind: 0 */
import {Box, Grid, Typography} from "@mui/material";
import StyledTabs from "@/components/StyledTabs.jsx";
import RocketIcon from "@/components/Icons/RocketIcon.jsx";
import ChatForm from "@/pages/DataSources/Components/ChatForm.jsx";
import DataSets from "@/pages/DataSources/Components/DataSets.jsx";
import {useLazyDatasourceDetailsQuery} from "@/api/datasources.js";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {ContentContainer, StyledGridContainer} from "@/pages/EditPrompt/Common.jsx";
import TagEditor from "@/pages/EditPrompt/Form/TagEditor.jsx";
import BasicAccordion, {AccordionShowMode} from "@/components/BasicAccordion.jsx";

const EditDatasource = () => {
  const {datasourceId} = useParams()
  const {personal_project_id: privateProjectId} = useSelector(state => state.user)
  const [fetchFn, {data: datasourceData, isFetching}] = useLazyDatasourceDetailsQuery()
  useEffect(() => {
    privateProjectId && datasourceId && fetchFn({projectId: privateProjectId, datasourceId}, true)
  }, [privateProjectId, datasourceId, fetchFn])
  if (isFetching) {
    return ''
  }
  return (
    <Grid container>
      <Grid item xs={12} px={2}>
        <StyledTabs
          tabs={[{
            label: 'Run',
            icon: <RocketIcon/>,
            tabBarItems: <div/>,
            rightToolbar: <div/>,
            content:
              <StyledGridContainer container spacing={2}>
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
                                <Typography variant='headingSmall'>{datasourceData?.embedding_model}</Typography>
                                <Typography variant='bodySmall' ml={2}>Storage: </Typography>
                                <Typography variant='headingSmall'>{datasourceData?.storage}</Typography>
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
                        }
                      ]}/>
                    <DataSets datasetItems={datasourceData?.version_details?.datasets || []}/>
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