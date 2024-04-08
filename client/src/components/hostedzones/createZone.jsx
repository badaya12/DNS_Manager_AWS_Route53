import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CreateZone = () => {
  const [domainName, setDomainName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false); // State to track if hosted zone is private or public
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { accessKeyId, secretAccessKey, region } = useSelector((state) => state.auth);

  const handleCreateZone = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3001/api/createZone', {
        accessKeyId,
        secretAccessKey,
        region,
        domainName,
        description,
        isPrivate // Include isPrivate in the request body
      });
      console.log(response.data);
      setSuccess(true);
    } catch (error) {
      console.error('Error creating hosted zone:', error);
      setError('Failed to create hosted zone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-zone">
      <h2>Create New Hosted Zone</h2>
      <div className="input-group">
        <label htmlFor="domainName">Domain Name:</label>
        <input
          type="text"
          id="domainName"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>
          Private Hosted Zone:
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
        </label>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {success && <p>Hosted zone created successfully!</p>}
      <button onClick={handleCreateZone}>Create Hosted Zone</button>
    </div>
  );
};

export default CreateZone;
