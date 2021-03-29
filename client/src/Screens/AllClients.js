import React, { useEffect } from 'react';
import { Box, Heading, Text } from '@chakra-ui/layout';
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/table';
import { Spacer, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClients, getMWSWCWbalances } from '../redux/action/AdminAction';
import Loader from '../components/Loader';
import AlertMessage from '../components/Alert';
import { Helmet } from 'react-helmet';

const AllClients = () => {
  const dispatch = useDispatch();

  const allClientsGet = useSelector((state) => state.allClientsGet);
  const { loading, clients, error } = allClientsGet;

  const MWSWCWget = useSelector((state) => state.MWSWCWget);
  const { loading: mwLoading, balances, error: mwError } = MWSWCWget;

  useEffect(() => {
    dispatch(getAllClients());
    dispatch(getMWSWCWbalances());
  }, [dispatch]);

  return (
    <Box p='4'>
      <Helmet>
        <title>All Clients | Admin Dashboard</title>
      </Helmet>
      <Box d={{ md: 'flex' }} color='white' mt='3'>
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='red.400'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
        >
          <Heading size='md'>Main + Second Wallet Balance</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {mwLoading ? (
              <Loader small />
            ) : (
              `HNT ${balances ? balances?.mw_balance?.toFixed(2) : '0'}`
            )}
          </Text>
        </Box>
        <Spacer />
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='green.400'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
        >
          <Heading size='md'>All Clients Balance</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {mwLoading ? (
              <Loader small />
            ) : (
              `HNT ${balances ? balances?.cw_balance?.toFixed(2) : '0'}`
            )}
          </Text>
        </Box>
        <Spacer />
        <Box
          boxShadow='base'
          textAlign='center'
          p='4'
          borderRadius='lg'
          bg='blue.400'
          w={{ base: '100%', md: '30%' }}
          mb={{ base: '3', sm: '3', md: '3' }}
        >
          <Heading size='md'>Available Balance (After Paid)</Heading>
          <Text style={{ fontWeight: 'bold' }} fontSize='3xl'>
            {mwLoading ? (
              <Loader small />
            ) : (
              `HNT ${
                balances
                  ? (
                      parseFloat(balances?.mw_balance) +
                      parseFloat(balances?.sw_balance) -
                      parseFloat(balances?.cw_balance)
                    ).toFixed(2)
                  : '0'
              }`
            )}
          </Text>
        </Box>
      </Box>
      {mwError && <AlertMessage status='error' error={mwError} />}
      <Box display={{ sm: 'flex' }} mb='3' alignItems='center'>
        <Text fontSize='2xl' className='adminPageHeader'>
          All Clients
        </Text>
        <Spacer />
        <Box>
          <Link to={`/h/add-new-client`}>
            <Button
              variant='outline'
              w={{ base: '100%', md: 'auto' }}
              size='sm'
              colorScheme='purple'
            >
              <i className='fas fa-user-plus' style={{ marginRight: 5 }}></i>{' '}
              Add New Client
            </Button>
          </Link>
        </Box>
      </Box>
      <Box>
        {loading ? (
          <Loader />
        ) : error ? (
          <AlertMessage status='error' error={error} />
        ) : clients && clients?.length > 0 ? (
          <Table shadow='lg' size='sm' variant='striped'>
            <TableCaption>
              All client list with their total hotspot.
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Client Name</Th>
                <Th isNumeric>Total Hotspot</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clients
                .sort((a, b) => (a?.firstname > b?.firstname ? 1 : -1))
                .map((client) => (
                  <Tr key={client?._id}>
                    <Td>
                      <Link to={`/h/client/${client?._id}`}>
                        {client?.firstname + ' ' + client?.lastname}
                      </Link>
                    </Td>
                    <Td isNumeric>{client?.total_hotspot}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        ) : (
          <AlertMessage status='error' error='No clients found!' />
        )}
      </Box>
    </Box>
  );
};

export default AllClients;
