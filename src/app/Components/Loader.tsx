import React from "react";
import "./Loader.css";

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <img src="/heroes.gif" alt="Loading..." className="loader-gif" />
    </div>
  );
};

export default Loader;
