import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ParsedDataTable from './parsedDataTable';
import './Parser.css'
import { useNavigate } from 'react-router-dom';
const Parser = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const { accessKeyId, secretAccessKey, region, SelectedhostedZone } = useSelector((state) => state.auth);
  const [parsedEntries,setParsedEntries] = useState({})
  
  const parseInput = (e) => {
    setInputText(e.target.value)
    const lines = e.target.value.trim().split('\n');
    let parsedData = {};

    lines.forEach(line => {
      const [domainName, ttl, type, ...recordValueParts] = line.split(/\s+/);

      if (domainName && ttl && type &&  recordValueParts.length > 0) {
        const recordValue = recordValueParts.join(' '); 
        const key = `${domainName}_${type}`;
        const existingRecord = parsedData[key];

        if (existingRecord) {
          if (!existingRecord['ResourceRecords'].some(record => record.Value === recordValue)) {
            parsedData[key]['ResourceRecords'] = [...existingRecord['ResourceRecords'], {Value : recordValue}];
          }
        } else {
          parsedData[key] = {
            Name: `${domainName}.${SelectedhostedZone.Name}`,
            Type: type,
            TTL: ttl,
            ResourceRecords: [{Value : recordValue}]
          };
        }
        // setParsedEntries(parsedData)
        
      }
    });

    console.log(parsedData);
    setParsedEntries(parsedData)
    
    // Here you can update the state or perform any other actions with the parsed data
  };

  const handleOnSubmit = ()=>{
    
    const parsedArray = Object.values(parsedEntries);
    console.log(parsedArray);
    const changesArray = parsedArray.map(record => ({
        Action: 'CREATE',
        ResourceRecordSet: record
      }));

    

      axios.post('/api/login', 
      {
        params:{
            ChangeBatch :{
                Changes : changesArray
            },
            HostedZoneId: SelectedhostedZone.Id
        },
        accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region
      })
      .then(response => {
        console.log(response.data); // Handle the response data
        alert("SuccessFully Uploaded all the records");
        navigate('/getRecords');
      })
      .catch(error => {
        console.error('There was a problem with the Axios request:', error);
        alert("InValid Records");
      });

  }

  const handleChange = (e) => {
    const text = e.target.value;
        setInputText(text);
        parseInput(text);
    // parseInput();
  };

  return (
    <div className="container">
      <textarea className="textarea"
        value={inputText}
        onChange={parseInput}
        placeholder="Enter data in format: domainName ttl type recordValue"
      />
      <button className="button" onClick={handleOnSubmit}>Create Records</button>
      <div className="table-container">
      <ParsedDataTable parsedEntries={parsedEntries} /> 
      </div>
    </div>
  );
};

export default Parser;
