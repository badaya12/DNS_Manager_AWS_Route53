import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAccessKeyId, setSecretAccessKey, setRegion } from '../redux/reducers';
import './homePage.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const HomePage = () => {
  const dispatch = useDispatch();
  const [accessKeyIdInput, setAccessKeyIdInput] = useState('');
  const [secretAccessKeyInput, setSecretAccessKeyInput] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const navigate = useNavigate();

  const handleAccessKeyIdChange = (e) => {
    setAccessKeyIdInput(e.target.value);
  };

  const handleSecretAccessKeyChange = (e) => {
    setSecretAccessKeyInput(e.target.value);
  };

  const handleRegionChange = (e) => {
    setRegionInput(e.target.value);
  };

  const handleSubmit = () => {
    const requestData = {
      accessKeyId: accessKeyIdInput,
      secretAccessKey: secretAccessKeyInput,
      region: regionInput
    };

    axios.post('/api/authorize', requestData)
      .then((response) => {
        console.log('Authorization successful:', response.data);
        dispatch(setAccessKeyId(accessKeyIdInput));
        dispatch(setSecretAccessKey(secretAccessKeyInput));
        dispatch(setRegion(regionInput));
        navigate('/getZone');
        // Handle successful authorization, such as redirecting to another page
      })
      .catch((error) => {
        console.error('Authorization failed:', error);
        alert("Wrong Credentials");
        // Handle authorization failure, such as displaying an error message to the user
      });
    
    // Additional actions after setting credentials
  };

  return (
    <div className="homepage-container">
      <h1>Put in credentials</h1>
      <div className="input-container">
        <label className="label" htmlFor="accessKeyIdInput">Access Key ID:</label>
        <input
          className="input-field"
          type="text"
          id="accessKeyIdInput"
          value={accessKeyIdInput}
          onChange={handleAccessKeyIdChange}
          placeholder="Enter Access Key ID"
        />
      </div>
      <div className="input-container">
        <label className="label" htmlFor="secretAccessKeyInput">Secret Access Key:</label>
        <input
          className="input-field"
          type="text"
          id="secretAccessKeyInput"
          value={secretAccessKeyInput}
          onChange={handleSecretAccessKeyChange}
          placeholder="Enter Secret Access Key"
        />
      </div>
      <div className="input-container">
        <label className="label" htmlFor="RegionInput">Region Input:</label>
        <input
          className="input-field"
          type="text"
          id="RegionInput"
          value={regionInput}
          onChange={handleRegionChange}
          placeholder="Enter Region Input"
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default HomePage;

