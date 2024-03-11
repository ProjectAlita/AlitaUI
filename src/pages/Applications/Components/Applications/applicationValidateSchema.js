import * as yup from 'yup';

const getValidateSchema = () => {
  return yup.object({
    name: yup
      .string('Enter application name')
      .required('Name is required'),
    description: yup
      .string('Enter application description')
      .required('Description is required'),
    embedding_model: yup
      .string('Select embedding model')
      .required('Embedding model is required'),
    storage: yup
      .string('Select vector storage')
      .required('Vector storage is required'),
  });
}

export default getValidateSchema;