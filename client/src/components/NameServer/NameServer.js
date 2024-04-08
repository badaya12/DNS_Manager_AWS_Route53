import React, { useState } from 'react';
// import AWS from 'aws-sdk';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Import Axios
import "./NameServer.css";
import { useNavigate } from 'react-router-dom';
// import Parser from './parseJson';
const NameServer = () => {
  const { accessKeyId, secretAccessKey, region ,SelectedhostedZone} = useSelector((state) => state.auth); // Access secretKeyId from Redux store
  // const [hostedZones, setHostedZones] = useState([]);
  // const [selectedZoneId, setSelectedZoneId] = useState('');
  const [domainName, setDomainName] = useState('');
  const [recordType, setRecordType] = useState('');
  const [recordValue, setRecordValue] = useState([]);
  const [ttl, setTTL] = useState('');
  const navigate = useNavigate();

  const handleImportZoneFile = ()=>{
    navigate('/Parser')
  }
  const handleCreateRecordSet = () => {
    // Construct the request body
    const concatenatedDomainName = SelectedhostedZone ? `${domainName}.${SelectedhostedZone.Name}` : '';
    const requestBody = {
      params: {
        ChangeBatch: {
          Changes: [
            {
              Action: 'CREATE',
              ResourceRecordSet: {
                Name: concatenatedDomainName,
                Type: recordType,
                TTL: parseInt(ttl),
                ResourceRecords: [{ Value: recordValue }]
              }
            }
          ]
        },
        HostedZoneId: SelectedhostedZone.Id // Use the selected zone ID
      },
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region
    };

    console.log(secretAccessKey);
    // Make a POST request using Axios with the specified URL
    axios.post('http://localhost:3001/login', requestBody)
      .then(response => {
        console.log(response.data); // Handle the response data
      })
      .catch(error => {
        console.error('There was a problem with the Axios request:', error);
      });
  };

  return (
    
    <div className='container'>
          {SelectedhostedZone && <span className="selected-zone-label">{SelectedhostedZone.Name}</span>}
  <div className="input-group">
    <input
      type="text"
      id="domainName"
      placeholder="Sub-Domain Name"
      value={domainName}
      onChange={(e) => setDomainName(e.target.value)}
    />

  </div>
  <input
    type="text"
    placeholder="Record Type (e.g., A, AAAA, CNAME)"
    value={recordType}
    onChange={(e) => setRecordType(e.target.value)}
  />
  <textarea
    placeholder="Record Value (one value per line)"
    value={recordValue.join('\n')} // Join array elements with newline character
    onChange={(e) => setRecordValue(e.target.value.split('\n'))} // Split input value by newline character
  />
  <input
    type="text"
    placeholder="TTL (Time to Live in seconds)"
    value={ttl}
    onChange={(e) => setTTL(e.target.value)}
  />
  <button onClick={handleCreateRecordSet} className="submit-button">Create DNS Record Set</button>
  <button onClick={handleImportZoneFile} className="import-button">Import Zone File</button>
</div>

  );
};

export default NameServer;
