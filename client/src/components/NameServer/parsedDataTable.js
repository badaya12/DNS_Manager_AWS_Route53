import React from 'react';
import './parsedDataTable.css'
const ParsedDataTable = ({ parsedEntries }) => {
  return (
    <div>
      <h3>Parsed Data</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>TTL</th>
            <th>Type</th>
            <th>Resource Records</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(parsedEntries).map((entry, index) => (
            <tr key={index}>
              <td>{entry.Name}</td>
              <td>{entry.TTL}</td>
              <td>{entry.Type}</td>
              <td>
                <ul>
                  {entry.ResourceRecords.map((record, i) => (
                    <li key={i}>{record.Value}</li>
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

export default ParsedDataTable;
