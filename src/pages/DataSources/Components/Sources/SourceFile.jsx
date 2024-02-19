import FileUploadControl from "@/components/FileUploadControl.jsx";
import BasicAccordion from "@/components/BasicAccordion.jsx";
import {Box} from "@mui/material";

const SourceFile = () => {
  return (
    <>
      <FileUploadControl/>
      <BasicAccordion
        uppercase={false}
        items={[
          {
            title: 'Advanced settings',
            content: <Box>Advanced settings</Box>
          }
        ]}/>
    </>
  )
}
export default SourceFile