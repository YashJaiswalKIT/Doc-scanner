// src/components/UI/FileInput.jsx
import React from "react";

const FileInput = ({ label, name, onChange, required = false }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name} className="text-sm font-medium">{label}</label>}
      <input
        type="file"
        name={name}
        onChange={onChange}
        required={required}
        className="border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />
    </div>
  );
};

export default FileInput;
