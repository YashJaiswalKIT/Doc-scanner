import React, { useState } from "react";
import authService from "../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../utils/sendOTP";

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!user.email) {
      return setError("Email is required to send OTP.");
    }

    try {
      await sendOTP(user.email); 
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP. Please check your email.");
    }
  };

 const handleOtpSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("https://doc-scanner-backend.onrender.com/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, otp: String(otp) }),
    });

    const data = await response.json();
    console.log("🔍 Verify OTP response:", data);

    if (!response.ok || !data.success) {
      throw new Error(data.message || "OTP verification failed");
    }

    await authService.createAccount(user);
    navigate("/dashboard");
  } catch (err) {
    setError(err.message || "Signup failed");
  }
};

  try {
    const response = await fetch("https://doc-scanner-backend.onrender.com/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, otp: String(otp) }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "OTP verification failed");

    await authService.createAccount(user); 
    navigate("/dashboard");
  } catch (err) {
    setError(err.message || "Signup failed");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
        {step === 1 ? "Sign Up" : "Verify OTP"}
      </h2>

      {error && <p className="text-red-600 text-center mb-2">{error}</p>}

      {step === 1 ? (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={user.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <p className="text-gray-700 mb-2 text-center">
            Enter the OTP sent to your email
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Verify OTP & Create Account
          </button>
        </form>
      )}
    </div>
  );
};

export default Signup;
