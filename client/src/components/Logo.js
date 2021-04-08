import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Logo = () => {
  return (
    <div>
        <Link to='/'>
          <img height='150' width='150' src={logo} alt='Sharespot Logo'/>
        </Link>
    </div>
  );
};

export default Logo;
