import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NameServer from './components/NameServer/NameServer';
import HomePage from './components/homePage/homePage';
// import GetHostedZone from './components/Hooks/getZone';
import {  useSelector } from 'react-redux';
import GetHostedZone from './components/hostedzones/getZone';
import CreateZone from './components/hostedzones/createZone';
import GetRecords from './components/NameServer/getRecords';
import Parser from './components/NameServer/parseJson';
import Logout from './components/logout';
// import { Navbar } from './components/Navbar';
function App() {
  const { accessKeyId, secretAccessKey, region } = useSelector((state) => state.auth); // Access secretKeyId from Redux store
  return (
    <>    
      {/* <Navbar /> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {accessKeyId !== '' &&
          <Route path="/server" element={<NameServer />} />}
          {accessKeyId !== '' && <Route path="/getZone" element={<GetHostedZone />} />}
          {accessKeyId !== '' && <Route path="/createZone" element={<CreateZone />} />}
          {accessKeyId !== '' && <Route path="/getRecords" element={<GetRecords />} />}
          {accessKeyId !== '' && <Route path="/parser" element={<Parser />} />}
          {accessKeyId !== '' && <Route path="/logout" element={<Logout />} />}
        </Routes>
        
      </Router>
      </>
    
  );
}

export default App;
