import FileUploadControl from "@/components/FileUploadControl";
import { useFormikContext } from "formik";
import { useCallback } from "react";


export default function FileFields() {
  const { values, setFieldValue } = useFormikContext();
  const handleFileChange = useCallback((value) => {
    setFieldValue('file', value)
  }, [setFieldValue]);

  return (
    <FileUploadControl
      label={'File'}
      placeholder={'Upload your ZIP file'}
      file={values.file}
      onChangeFile={handleFileChange}
      accept={'application/zip'}
    />
  );
}