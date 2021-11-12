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
import { updateHotspot } from '../../redux/action/AdminAction';
import { useParams } from 'react-router';
import moment from 'moment';
import { Helmet } from 'react-helmet';

const HotspotEditScreen = ({ hotspots }) => {
  const params = useParams();

  const toast = useToast();
  const dispatch = useDispatch();

  const [apiData, setApiData] = useState([]);
  const [clients, setClientss] = useState([]);
  const [hotspot, setHotspot] = useState({});

  const hotspotUpdate = useSelector((state) => state.hotspotUpdate);
  const { loading, success, error } = hotspotUpdate;

  const allClientsGet = useSelector((state) => state.allClientsGet);
  const { clients: getClients } = allClientsGet;

  useEffect(() => {
    hotspots.map((data) => data?._id === params?.hotspotId && setHotspot(data));
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
    setClientss(getClients);
    if (success) {
      toast({
        status: 'success',
        title: 'Success!',
        description: 'Hotspot Update!',
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
  }, [success, error, toast, getClients, params?.hotspotId, hotspots]);

  const fieldValidationSchema = yup.object({
    client_id: yup.string().required('Client id required!'),
    hotspot_address: yup.string().required('Hotspot address required!'),
    relation_type: yup.string().required('Role required!'),
    percentage: yup.number().required('Percentage required!'),
    startDate: yup.string().required('Start date required!'),
    endDate: yup.string().required('End date required!'),
  });

  return Object.keys(hotspot).length > 0 ? (
    <Box p='4'>
      <Helmet>
        <title>Hotspot Update | Admin Dashboard</title>
      </Helmet>
      <Text display='inline-block' fontSize='2xl' className='adminPageHeader'>
        Update Hotspot
      </Text>
      <Box mt='3'>
        <Formik
          initialValues={{
            client_id: hotspot?.client_id,
            hotspot_address: hotspot?.hotspot_name,
            relation_type: hotspot?.relation_type,
            percentage: hotspot?.percentage,
            startDate: moment(hotspot?.startDate).format('YYYY-MM-DD'),
            endDate: moment(hotspot?.endDate).format('YYYY-MM-DD'),
          }}
          validationSchema={fieldValidationSchema}
          onSubmit={(data) => {
            dispatch(updateHotspot(params?.hotspotId, data));
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
                  disabled
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
                  disabled
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
                  <option value='hold'>Hold</option>
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
              <FormControl>
                <FormLabel>End Date</FormLabel>
                <Input
                  name='endDate'
                  value={values.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type='date'
                />
                {errors.endDate && touched.endDate && (
                  <div style={{ color: 'red', fontSize: 13 }}>
                    {errors.endDate}
                  </div>
                )}
              </FormControl>
              <Button
                type='submit'
                mt='3'
                isLoading={loading}
                loadingText='Updating...'
                colorScheme='purple'
              >
                Update Agreement
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  ) : null;
};

export default HotspotEditScreen;
