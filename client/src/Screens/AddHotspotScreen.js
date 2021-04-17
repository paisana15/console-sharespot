import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/layout';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/select';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { Field, Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/toast';
import { addHotspotToClient } from '../redux/action/AdminAction';
import { Helmet } from 'react-helmet';
import AlertMessage from '../components/Alert';

const AddHotspotScreen = () => {
  const toast = useToast();
  const dispatch = useDispatch();

  const [apiData, setApiData] = useState([]);
  const [clients, setClientss] = useState([]);
  const [apiError, setApiError] = useState('');

  const hotspotClientAdd = useSelector((state) => state.hotspotClientAdd);
  const { loading, success, error } = hotspotClientAdd;

  const allClientsGet = useSelector((state) => state.allClientsGet);
  const { clients: getClients } = allClientsGet;

  useEffect(() => {
    const abortController = new AbortController();
    async function fetchData() {
      try {
        const res = await axios.get(
          'https://api.helium.wtf/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/hotspots'
        );
        if (res.data) {
          setApiData(res?.data?.data);
        } else {
          throw new Error('API Failed!');
        }
      } catch (error) {
        setApiError('Can not fetch hotspots list! Helium API Error!');
      }
    }
    if (apiData && apiData?.length < 1) {
      fetchData();
    }
    setClientss(getClients);
    if (success) {
      toast({
        status: 'success',
        title: 'Success!',
        description: 'Hotspot Added!',
        duration: 3000,
        isClosable: true,
      });
    }
    if (error) {
      toast({
        status: 'error',
        title: 'Failed!',
        description: error,
        duration: 3000,
        isClosable: true,
      });
    }
    return () => {
      abortController.abort();
    };
  }, [success, error, toast, getClients, apiData]);
  const fieldValidationSchema = yup.object({
    client_id: yup.string().required('Client id required!'),
    hotspot_address: yup.string().required('Hotspot address required!'),
    relation_type: yup.string().required('Role required!'),
    percentage: yup.number().required('Percentage required!'),
    startDate: yup.string().required('Start date required!'),
  });

  return (
    <Box p='4'>
      <Helmet>
        <title>Add Hotspot | Admin Dashboard</title>
      </Helmet>
      <Text display='inline-block' fontSize='2xl' className='adminPageHeader'>
        Add Hotspot
      </Text>
      <Box mt='3'>
        <Formik
          initialValues={{
            client_id: '',
            hotspot_address: '',
            relation_type: '',
            percentage: '',
            startDate: '',
          }}
          validationSchema={fieldValidationSchema}
          onSubmit={(data) => {
            dispatch(addHotspotToClient(data));
          }}
        >
          {({
            handleSubmit,
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
                    <option key={idx} value={data?.client_id?._id}>
                      {data?.client_id?.firstname} {data?.client_id?.lastname}
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
                    <option key={idx} value={data?.name + ' ' + data?.address}>
                      {data?.name}
                    </option>
                  ))}
                </Field>
                {errors.hotspot_address && touched.hotspot_address && (
                  <div style={{ color: 'red', fontSize: 13 }}>
                    {errors.hotspot_address}
                  </div>
                )}
                {apiError && <AlertMessage status='error' error={apiError} />}
              </FormControl>

              <FormControl>
                <FormLabel>Role</FormLabel>
                <Field
                  as={Select}
                  name='relation_type'
                  value={values.relation_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value=''> --- </option>
                  <option value='host'>Host</option>
                  <option value='referrer'>Referrer</option>
                  <option value='partner'>Partner</option>
                </Field>
                {errors.relation_type && touched.relation_type && (
                  <div style={{ color: 'red', fontSize: 13 }}>
                    {errors.relation_type}
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
                mt='3'
                isLoading={loading}
                loadingText='Creating...'
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
