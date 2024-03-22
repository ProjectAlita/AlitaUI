import * as yup from 'yup';

const ApplicationCreationValidateSchema = () => {
  return yup.object({
    name: yup
      .string('Enter application name')
      .required('Name is required'),
    description: yup
      .string('Enter application description')
      .required('Description is required'),
  });
}

export default ApplicationCreationValidateSchema;