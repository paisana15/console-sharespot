import React, { useEffect, useState } from 'react';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Button, Heading, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { clientLogin } from '../redux/action/ClientAction';
import NavbarLogin from '../components/NavbarLogin';
import AlertMessage from '../components/Alert';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import HelpIcon from 'mdi-react/HelpIcon';

const ClientLogin = () => {
  const dispatch = useDispatch();
  const toast = useToast();
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
            className='title-underline text-color-black'
            as='h5'
            size='lg'
          >
            Client Login
            <hr/>
          </Heading>
          <button className='circle-help' onClick = {() => setHelpInfo(!helpInfo)}>
            <HelpIcon className='help-icon font-weight-bold' size={20} />
          </button>
        </div>
        {helpInfo && 
          <div className='d-flex flex-column position-relative'>
            <div className='container-reach text-center align-items-center p-3 text-color-black'>
              <div className='arrow-left'></div>
              <div className='d-flex flex-column'>
                <span>If you haven't received your</span>
                <span>credentials, please reach us.</span>
              </div>
              <br/>
              <a href='mailto:support@sharespot.pt' target='_blank' rel='noopener noreferrer'>
                <span className='font-weight-bold'>support@sharespot.pt</span>
              </a>
            </div>
          </div>
        }
        <form onSubmit={submitHandler}>
          <FormControl id='first-name' isRequired>
            <Input
              className='input-field text-color-black'
              onChange={(e) => setUsername(e.target.value)}
              placeholder='user'
            />
          </FormControl>

          <FormControl isRequired>
            <Input
              className='input-field text-color-black'
              onChange={(e) => setPassword(e.target.value)}
              pr='4.5rem'
              type='password'
              placeholder='password'
            />
          </FormControl>
          <div className='d-sm-flex flex-sm-column d-md-flex flex-md-row container-login justify-content-space-between pb-3 mt-2 mt-md-0'>
            <div className='row'>
              <div className='round'>
                <input type='checkbox' id='checkbox' />
                <label htmlFor='checkbox'></label>
              </div>
              <span className='text-color-black'>save login information</span>
            </div>
            <Link className='underline-none ml-3 ml-md-0' to={`/recover-password`}>
              <Button className='font-weight-lighter font-italic mt-3 mt-md-0 text-color-black' colorScheme='transparent' variant='link'>recover password</Button>
            </Link>
          </div>
          <Button
            className='primary-btn ml-auto mr-auto mt-4 mt-md-3'
            type='submit'
            isLoading={loading}
            loadingText='Signing in...'
          >
            Sign in
          </Button>
        </form>
        <Box mt='3'>
          {error && <AlertMessage status='error' error={error} />}
        </Box>
      </div>
      <a href='https://sharespot.pt' target='_blank' rel='noopener noreferrer'>
          <span className='sharespot-bottom font-weight-bold'>sharespot.pt</span>
      </a>
    </div>
  );
};

export default ClientLogin;
