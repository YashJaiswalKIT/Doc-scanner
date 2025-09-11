// src/components/UI/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
