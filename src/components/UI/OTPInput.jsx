// src/components/UI/OTPInput.jsx
import React, { useRef } from "react";

const OTPInput = ({ length = 6, onChange }) => {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const otpValues = inputs.current.map((input) => input.value).join("");
    onChange(otpValues);

    if (value && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !inputs.current[index].value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 border border-gray-300 text-center text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputs.current[index] = el)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
