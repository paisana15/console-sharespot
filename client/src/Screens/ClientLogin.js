import React, { useEffect, useState } from 'react';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Button, Heading, useColorMode, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { clientLogin } from '../redux/action/ClientAction';
import NavbarLogin from '../components/NavbarLogin';
import AlertMessage from '../components/Alert';
import { useHistory } from 'react-router';
// import AlertCircleIcon from 'mdi-react/AlertCircleIcon';
// import HelpCircleIcon from 'mdi-react/HelpCircleOutlineIcon';
import HelpIcon from 'mdi-react/HelpIcon';

const ClientLogin = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const history = useHistory();

  const loginClient = useSelector((state) => state.loginClient);
  const { loading, isAuthenticated, error } = loginClient;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [helpInfo, setHelpInfo] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      toast({
        title: 'Successfully Signed in!',
        status: 'success',
        isClosable: true,
        duration: 5000,
      });
      history.push('/c');
    }
  }, [history, toast, isAuthenticated]);
  const submitHandler = (e) => {
    e.preventDefault();
    const credentials = { username, password };
    dispatch(clientLogin(credentials));
  };

  return (
    
    <div className='login-screen'>
      <NavbarLogin/>
      <div className='login-card'>
        <div className='d-flex justify-content-space-between'>
          <Heading
            className='title-underline'
            as='h5'
            size='lg'
            color={`${colorMode === 'dark' ? '#7e838c' : 'gray.700'}`}
          >
            Client Login
          </Heading>
          <button className='circle-help' onClick = {() => setHelpInfo(!helpInfo)}>
            <HelpIcon className='help-icon font-weight-bold' size={20} />
          </button>
        </div>
        {helpInfo && 
          <div className='d-flex flex-column position-relative'>
            <div className='container-reach text-center align-items-center p-3'>
              <div class='arrow-left'></div>
              <div className='d-flex flex-column'>
                <span>If you haven't received your</span>
                <span>credentials, please reach us.</span>
              </div>
              <br/>
              <span className='font-weight-bold'>support@sharespot.pt</span>
            </div>
          </div>
        }
        <form onSubmit={submitHandler}>
          <FormControl id='first-name' isRequired>
            <Input
              className='input-field'
              onChange={(e) => setUsername(e.target.value)}
              placeholder='user'
            />
          </FormControl>

          <FormControl isRequired>
            <Input
            className='input-field'
              onChange={(e) => setPassword(e.target.value)}
              pr='4.5rem'
              type='password'
              placeholder='password'
            />
          </FormControl>
          <div className='row container-login justify-content-space-between pb-3'>
            <div className='row'>
              <div className='round'>
                <input type='checkbox' id='checkbox' />
                <label htmlFor='checkbox'></label>
              </div>
              <span>save login information</span>
            </div>
            <div>
            <span className='font-weight-lighter'>
              recover password
            </span>
            </div>
          </div>
          <Button
            className='primary-btn ml-auto mr-auto'
            type='submit'
            isLoading={loading}
            loadingText='Signing in...'
            mt='5'
          >
            Sign in
          </Button>
        </form>
        <Box mt='3'>
          {error && <AlertMessage status='error' error={error} />}
        </Box>
      </div>
      <span className='sharespot-bottom font-weight-bold'>sharespot.pt</span>
    </div>
  );
};

export default ClientLogin;
