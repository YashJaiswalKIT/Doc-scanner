import React, { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import service from "../appwrite/config";
import conf from "../conf/config";
import { ID,Permission,Role } from "appwrite";
import { sendOTP } from "../utils/sendOTP";

const AccessRequestForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSendOtp = async () => {
  try {
    const { otp } = await sendOTP(form.email);
    // console.log("OTP received from backend:", otp);
    setServerOtp(otp);
    setOtpSent(true);
    alert("OTP sent to your email.");
  } catch (err) {
    // console.error("Failed to send OTP", err);
    alert("Could not send OTP to your email.");
  }
};


  const handleVerifyOtp = () => {
  // console.log("Entered OTP:", emailOtp);
  // console.log("Stored OTP (serverOtp):", serverOtp);

  if (!emailOtp || !serverOtp) {
    alert("OTP not sent or missing.");
    return;
  }

  if (emailOtp.trim() === serverOtp.toString().trim()) {
    setOtpVerified(true);
    alert("Email verified successfully.");
  } else {
    alert("Invalid OTP. Try again.");
  }
};



 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!otpVerified) {
    alert("Please verify your email first.");
    return;
  }

  setSubmitting(true);

  try {
    const payload = {
      ...form,
      userId,  
      otpCode: serverOtp,
      documentId: "some-doc-id-here",   
      status: "pending",
      otpVerified: true,
      permission: "read",
      timestamp: new Date().toISOString(),
    };

    console.log("Payload to Appwrite:", payload);

    const newRequest = await service.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.accessRequestCollectionId,
      ID.unique(),
      payload,
      [
  
   Permission.write(Role.any()),   
  Permission.read(Role.any())  
]

    );

    console.log("Request submitted:", newRequest);

    navigate(`/request-submitted/${newRequest.$id}`);    // Accessor sees waiting page

  } catch (err) {
    console.error("Submission failed:", err);
    alert("Something went wrong while saving request.\n" + err.message);
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        Request Document Access
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          required
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {!otpVerified && (
          <>
            <button
              type="button"
              onClick={handleSendOtp}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Send OTP to Email
            </button>

            {otpSent && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="w-full p-2 border rounded mt-2"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="bg-green-600 text-white px-3 py-1 rounded mt-2"
                >
                  Verify OTP
                </button>
              </>
            )}
          </>
        )}

        <input
          type="tel"
          name="phone"
          required
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="address"
          required
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={submitting || !otpVerified}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default AccessRequestForm;
