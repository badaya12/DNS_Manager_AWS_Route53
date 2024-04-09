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
    const concatenatedDomainName = domainName ? `${domainName}.${SelectedhostedZone.Name}` : `${SelectedhostedZone.Name}`;
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
                ResourceRecords: [{ Value: `${recordValue}` }]
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
    axios.post('/api/login', requestBody)
      .then(response => {
        // console.log(response.data); // Handle the response data
        navigate('/getRecords');
      })
      .catch(error => {
        console.error('There was a problem with the Axios request:', error);
        alert("Record Value Invalid")
      });
  };

  return (
    
    <div className='container'>
      <button className='go-back-button' onClick = {()=>{navigate('/getZone')}}>Go Back</button>
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
  <select id="recordType" value={recordType} onChange={(e) => setRecordType(e.target.value)}>
          <option value="">Select Record Type</option>
          <option value="MX">MX - Specifies mail servers</option>
          <option value="A">A - Routes traffic to an IPv4 address and some AWS resources</option>
          <option value="AAAA">AAAA - Routes traffic to an IPv6 address and some AWS resources</option>
          <option value="TXT">TXT — Used to verify email senders and for application-specific values</option>
          <option value="PTR">PTR - Maps an IP address to a domain name</option>
          <option value="SRV">SRV-Application-specific values that identify server</option>
          <option value="NAPTR">NAPTR — Used by DDDS applications</option>
          <option value="CAA">CAA — Restricts CAs that can create SSL/TLS certificates for the domain</option>
          <option value="DS">DS - Delegation Signer, used to establish a chain of trust for DNSSEC</option>
          {/* Add more options as needed */}
        </select>
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
