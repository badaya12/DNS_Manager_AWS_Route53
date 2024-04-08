import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import { RecordsTable } from './recordTable';

const GetRecords = () => {
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const { accessKeyId, secretAccessKey, region,SelectedhostedZone } = useSelector((state) => state.auth);

  const fetchRecords = async () => {
    try {
      const requestBody = {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region,
        hostedZoneId : SelectedhostedZone.Id
      };
      const response = await axios.get('http://localhost:3001/api/getRecords', { params: requestBody });
      console.log(response);
      setRecords(response.data.Records);
      console.log(records);
      // dispatch(setHostedZones(response.data.hostedZones));
    } catch (error) {
      console.error('There was a problem with the Axios request:', error);
    }
    
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  

  return (
    <div>
      <RecordsTable records={records} />
    </div>
  );


};



export default GetRecords;