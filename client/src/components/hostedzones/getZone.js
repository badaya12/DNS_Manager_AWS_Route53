import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector} from 'react-redux';
import HostedZonesTable from './HostedZoneTable';

const GetHostedZone = () => {
 
  const [hostedZones, setHostedZones] = useState([]);
  const { accessKeyId, secretAccessKey, region } = useSelector((state) => state.auth);

  const fetchHostedZones = async () => {
    try {
      const requestBody = {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
      };
      const response = await axios.get('http://localhost:3001/getZone', { params: requestBody });
      console.log(response.data.hostedZones);
      setHostedZones(response.data.hostedZones);

      // dispatch(setHostedZones(response.data.hostedZones));
    } catch (error) {
      console.error('There was a problem with the Axios request:', error);
    }
    console.log(hostedZones);
  };

  useEffect(() => {
    fetchHostedZones();
  }, []);

  

  return (
    <HostedZonesTable hostedZones={hostedZones} />
  );
  
};



export default GetHostedZone;