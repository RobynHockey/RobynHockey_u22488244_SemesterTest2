// import React from "react";
// import "./Header.css";
// import logo from "/logoverispatial.png"

// const Header = () => {
//   return (
//     <header className="header">
//       <div className="header-left">
//       <img src="/FinalDashboard/logoverispatial.png" alt="Logo" />
//         <h1 className="header-title">VeriSpatial Dashboard</h1>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from "react";
import "./Header.css";
import logo from "/logoverispatial.png";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="VeriSpatial Logo" className="header-logo" />
        <h1 className="header-title">VeriSpatial Dashboard</h1>
      </div>
    </header>
  );
};

export default Header;
