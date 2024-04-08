import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './recordTable.css';
import { useNavigate } from 'react-router-dom';

export const RecordsTable = ({ records }) => {
  const navigate = useNavigate();
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const { accessKeyId, secretAccessKey, region, SelectedhostedZone } = useSelector((state) => state.auth);

  const handleCheckboxChange = (record) => {
    const isSelected = selectedRecords.some(
      (r) => r.Name === record.Name && r.Type === record.Type
    );
    if (isSelected) {
      setSelectedRecords(selectedRecords.filter(
        (r) => r.Name !== record.Name && r.Type !== record.Type
      ));
    } else {
      setSelectedRecords([...selectedRecords, record]);
    }
  };

  const handleDeleteSelected = () => {
    // Assuming deleteRecords is the API endpoint for deleting records
    if (selectedRecords.length === 0) {
      alert('Please select records for deletion.'); // Display prompt if no records are selected
      return;
    }
    console.log(selectedRecords);
    const data = {
      records: selectedRecords,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
      hostedZoneId: SelectedhostedZone.Id
    }
    axios.delete('/api/deleteRecord', { data: data })
      .then((response) => {
        console.log('Records deleted successfully');
        setSelectedRecords([]);
        // navigate('/getRecords');
        window.location.reload();
        // Handle any additional logic after deletion, such as updating UI
      })
      .catch((error) => {
        console.error('Error deleting records:', error);
      });
  };

  // Filter records based on selected type
  const filteredRecords = selectedType ? records.filter(record => record.Type === selectedType) : records;

  return (
    <div className="records-table-container">
      <div className="table-header">
        <h2>Records Table</h2>
        <button className="delete-button" onClick={handleDeleteSelected}>Delete</button>
        <button className='create-button' onClick={() => { navigate('/server') }}>Create  </button>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Filter by Type</option>
          {Array.from(new Set(records.map(record => record.Type))).map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <table className="records-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>TTL</th>
            <th>Type</th>
            <th>Resource Records</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  className='checkbox'
                  checked={selectedRecords.some((r) => r.Name === record.Name)}
                  onChange={() => handleCheckboxChange(record)}
                />
              </td>
              <td>{record.Name}</td>
              <td>{record.TTL}</td>
              <td>{record.Type}</td>
              <td>
                <ul>
                  {record.ResourceRecords.map((resourceRecord, rrIndex) => (
                    <li key={rrIndex}>{resourceRecord.Value}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
