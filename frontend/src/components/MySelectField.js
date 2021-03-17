import React from 'react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useField, Field } from 'formik';

const MySelectField = () => {
  const [field, meta] = useField(props);
  return (
    <div>
      <FormControl isRequired>
        <FormLabel>{label}</FormLabel>
        <Field>
            
        </Field>
        {meta.touched && meta.error ? (
          <div style={{ color: 'red', fontSize: 13 }}>{meta.error}</div>
        ) : null}
      </FormControl>
    </div>
  );
};

export default MySelectField;
