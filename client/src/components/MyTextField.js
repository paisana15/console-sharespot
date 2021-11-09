import React from 'react';
import { FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useField } from 'formik';
import { Box } from '@chakra-ui/layout';

const MyTextField = ({ label, ref, placeholder, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Box mb='3'>
      <FormLabel style={{ width: '60%' }}>{label}</FormLabel>
      <Input placeholder={placeholder} {...field} {...props} ref={ref} />
      {meta.touched && meta.error ? (
        <div style={{ color: 'red', fontSize: 13 }}>{meta.error}</div>
      ) : null}
    </Box>
  );
};

export default MyTextField;
