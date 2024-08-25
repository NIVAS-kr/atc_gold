import React from 'react';
import DashboardCombined from './DashboardCombined';
import Devicerolecomposition from './Devicerolecompoition/Devicerolecomposition';
import Enableactive from './enableactive/Enableactive';
import Networkcoverage from './Network/Networkcoverage';


import "./DashboardCurrent.css";

const DashboardCurrent = () => {
  return (
    <div>
    
    <div className="dashboard-container">
       {/* Add the Navbar component here */}
      <div className="dashboard-item">
        <DashboardCombined />
      </div>
      <div className="dashboard-item">
        <Devicerolecomposition />
      </div>
      <div className="enable-item">
        <Enableactive />
      </div>
      <div className="network-item">
      <Networkcoverage/>

      </div>
     
    </div>
    </div>
  );
}

export default DashboardCurrent;
