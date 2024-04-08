import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAccessKeyId, setSecretAccessKey, setRegion,setSelectedHostedZone } from './redux/reducers';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(setAccessKeyId(''));
    dispatch(setSecretAccessKey(''));
    dispatch(setRegion(''));
    dispatch(setSelectedHostedZone(null));
    // Navigate to home page
    navigate('/');
  },[]);

  return null;
};

export default Logout;
