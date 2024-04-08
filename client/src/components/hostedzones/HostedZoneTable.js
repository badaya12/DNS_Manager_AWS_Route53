import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch ,useSelector} from 'react-redux';
import { setSelectedHostedZone } from '../redux/reducers';
import './HostedZoneTable.css'; // Import CSS file
import { useNavigate } from 'react-router-dom';

const HostedZonesTable = ({ hostedZones }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedZone, setSelectedZone] = useState(null);
    const { accessKeyId, secretAccessKey, region } = useSelector((state) => state.auth);
    const handleHostedZoneClick = (zone) => {
        console.log(zone);
        dispatch(setSelectedHostedZone(zone)); // Dispatch action to set selected hosted zone
        navigate('/getRecords');
    };
    const handleHostedZoneSelect = (zone) => {
        console.log(zone);
        setSelectedZone(zone.Id === selectedZone ? null : zone.Id); // Toggle selection
        // dispatch(setSelectedHostedZone(zone)); // Dispatch action to set selected hosted zone
    };
    const handleDeleteSelected = async () => {
        if (!selectedZone) {
            console.log('No zone selected for deletion');
            return;
        }
        const data = { 
            hostedZoneId:selectedZone, 
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: region
        }
        try {
            await axios.delete('http://localhost:3001/deleteHostedZone',{data:data});
            console.log('Selected hosted zone deleted successfully');
            setSelectedZone(null);
            // Optionally, you can update the UI or perform any additional actions after deletion
        } catch (error) {
            console.error('Error deleting selected hosted zone:', error);
            // Handle error
        }
    };

    return (
        <div>
            <h2>Hosted Zones Table</h2>
            <button onClick={handleDeleteSelected}>Delete Selected</button>
            <table className="hosted-zones-table"> {/* Add class for styling */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Public</th>
                        <th>Description</th>
                        <th>Record Count</th>
                    </tr>
                </thead>
                <tbody>
                    {hostedZones.map(zone => (
                        <tr key={zone.Id}>
                            <td>
                                <input
                                    type="radio"
                                    name="selectedZone"
                                    onChange={() => handleHostedZoneSelect(zone)}
                                    checked={zone.Id === selectedZone}
                                />
                            </td>
                            <td className="zone-name" onClick={() => handleHostedZoneClick(zone)}> {/* Add class for styling */}
                                {zone.Name}
                            </td>
                            <td>{zone.Config.PrivateZone ? "Private" : "Public"}</td>
                            <td>{zone.Config.Comment}</td>
                            <td>{zone.ResourceRecordSetCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HostedZonesTable;
