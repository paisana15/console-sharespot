import React from 'react';
import { FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useField } from 'formik';
import { Stack } from '@chakra-ui/layout';

const MyTextField = ({ label, ref, placeholder, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Stack mb='3' direction={['column', 'row']}>
      <FormLabel style={{ width: '60%' }}>{label}</FormLabel>
      <Input placeholder={placeholder} {...field} {...props} ref={ref} />
      {meta.touched && meta.error ? (
        <div style={{ color: 'red', fontSize: 13 }}>{meta.error}</div>
      ) : null}
    </Stack>
  );
};

export default MyTextField;
