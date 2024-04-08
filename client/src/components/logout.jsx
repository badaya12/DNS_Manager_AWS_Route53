import React from 'react';
import { useDispatch } from 'react-redux';
// import  } from 'react-router-dom';
// import {useNavigate}
import { useNavigate } from 'react-router-dom';
import { setAccessKeyId, setSecretAccessKey, setRegion } from './redux/reducers';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear Redux variables
    dispatch(setAccessKeyId(''));
    dispatch(setSecretAccessKey(''));
    dispatch(setRegion(''));

    // Navigate to home page
    navigate('/')
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
