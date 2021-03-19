import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/layout';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/select';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { Field, Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddHotspotScreen = () => {
  const [apiData, setApiData] = useState([]);

  const allClientsGet = useSelector((state) => state.allClientsGet);
  const { clients } = allClientsGet;

  useEffect(() => {
    const request =
      'https://api.helium.io/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/hotspots';

    function fetchData() {
      axios
        .all([axios.get(request)])
        .then(
          axios.spread((...res) => {
            if (res) {
              setApiData(res[0].data.data);
            } else {
              throw new Error('Fetch to fail data!');
            }
          })
        )
        .catch((error) => {
          console.log(error);
        });
    }
    fetchData();
  }, []);
  const fieldValidationSchema = yup.object({
    client_id: yup.string().required('Client id required!'),
    hotspot_address: yup.string().required('Hotspot required!'),
    role: yup.string().required('Role required!'),
    percentage: yup.number().required('Percentage required!'),
    startDate: yup.string().required('Start date required!'),
  });

  return (
    <Box p='4'>
      <Text display='inline-block' fontSize='2xl' className='adminPageHeader'>
        Add Hotspot
      </Text>
      <Box mt='3'>
        <Formik
          initialValues={{
            client_id: '',
            hotspot_address: '',
            role: '',
            percentage: '',
            startDate: '',
          }}
          validationSchema={fieldValidationSchema}
          onSubmit={(data, { setSubmitting }) => {
            console.log(data);
            setSubmitting(false);
          }}
        >
          {({
            handleSubmit,
            isSubmitting,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Select Client</FormLabel>
                <Field
                  as={Select}
                  name='client_id'
                  value={values.client_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option> --- </option>
                  {clients?.map((data, idx) => (
                    <option key={idx} value={data?._id}>
                      {data?.firstname} {data?.lastname}
                    </option>
                  ))}
                </Field>
                {errors.client_id && touched.client_id && (
                  <div style={{ color: 'red', fontSize: 13 }}>
                    {errors.client_id}
                  </div>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Select Hotspot</FormLabel>
                <Field
                  as={Select}
                  name='hotspot_address'
                  value={values.hotspot_address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option> --- </option>
                  {apiData.map((data, idx) => (
                    <option key={idx} value={data?.address}>
                      {data?.name}
                    </option>
                  ))}
                </Field>
                {errors.hotspot_address && touched.hotspot_address && (
                  <div style={{ color: 'red', fontSize: 13 }}>
                    {errors.hotspot_address}
                  </div>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Role</FormLabel>
                <Field
                  as={Select}
                  name='role'
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value='host'>Host</option>
                  <option value='referrer'>Referrer</option>
                </Field>
                {errors.role && touched.role && (
                  <div style={{ color: 'red', fontSize: 13 }}>
                    {errors.role}
                  </div>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Percentage</FormLabel>
                <Input
                  name='percentage'
                  value={values.percentage}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.percentage && touched.percentage && (
                  <div style={{ color: 'red', fontSize: 13 }}>
                    {errors.percentage}
                  </div>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input
                  name='startDate'
                  value={values.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type='date'
                />
                {errors.startDate && touched.startDate && (
                  <div style={{ color: 'red', fontSize: 13 }}>
                    {errors.startDate}
                  </div>
                )}
              </FormControl>
              <Button
                type='submit'
                disabled={isSubmitting}
                mt='2'
                colorScheme='purple'
              >
                Create Agreement
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default AddHotspotScreen;
