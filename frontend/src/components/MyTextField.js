import React from 'react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useField } from 'formik';

const MyTextField = ({ label, ref, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <FormControl isRequired>
        <FormLabel>{label}</FormLabel>
        <Input {...field} {...props} ref={ref} />
        {meta.touched && meta.error ? (
          <div style={{ color: 'red', fontSize: 13 }}>{meta.error}</div>
        ) : null}
      </FormControl>
    </div>
  );
};

export default MyTextField;
