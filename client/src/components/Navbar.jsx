import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setAccessKeyId, setSecretAccessKey, setRegion, setSelectedHostedZone } from './redux/reducers';
import { useSelector,useDispatch } from 'react-redux';
import './navbar.css';
export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessKeyId} = useSelector((state) => state.auth);
  const handleLogout = () => {
    // Dispatch actions to reset access key ID, secret access key, region, and hosted zone
    dispatch(setAccessKeyId(''));
    dispatch(setSecretAccessKey(''));
    dispatch(setRegion(''));
    dispatch(setSelectedHostedZone(null));
    // Navigate to home page
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-title">
        <h1>DNS-Manager</h1>
      </div>
      {accessKeyId && <div className="navbar-links">
        {/* Logout button with handleLogout function */}
        <button onClick={handleLogout}>Logout</button>
      </div>}
    </div>
  );
};
