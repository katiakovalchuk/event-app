import React from "react";
import { Circles } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div className="loader">
      <Circles color="#060b26" height={200} width={200} />
    </div>
  );
};

export default Spinner;
