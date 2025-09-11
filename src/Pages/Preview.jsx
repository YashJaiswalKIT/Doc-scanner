import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import service from "../appwrite/config";
import OTPInput from "../components/UI/OTPInput";
import { sendOTP } from "../utils/sendOTP"; 

import conf from "../conf/config";
const Preview = () => {
  const { id } = useParams(); 
  const [document, setDocument] = useState(null);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("otp"); 
  const [error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const doc = await service.getDocument(id);
        setDocument(doc);
      } catch (err) {
        // console.error("Document not found", err);
        setError("Document not found or deleted.");
      }
    };

    fetchDocument();
  }, [id]);
const sendOtpToOwner = async (userId, generated) => {
  try {
    const res = await service.databases.getDocument(
      conf.appwriteDatabaseId,
      conf.accessRequestCollectionId,
      userId
    );

    const { email, phone } = res;

    if (!email || !phone) {
      
      // console.error("Missing owner email/phone");
      return;
    }

    await sendOTP(email, phone, generated); // ✅ centralized backend call
  } catch (err) {
    // console.error("Error sending OTP to owner", err);
  }
};


  const handleRequestAccess = async () => {
    if (!email) return setError("Please enter a valid email.");
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newRequest = {
      email,
      otp: otpCode,
      status: "pending",
    };
    const updatedRequests = [...(document.accessRequest || []), newRequest];
    try {
      await service.updateDocument(id, {
        accessRequest: updatedRequests,
      });
      await sendOtpToOwner(document.userId, otpCode);
      setStep("waiting")
    } catch (err) {
      setError("Failed to send access request.");
    }
  };

  const handleVerify = async () => {
  if (!document) return;
  const requests = document.accessRequest || [];

  const match = requests.find(
    (req) => req.email === email && req.otp === otp
  );

  if (match) {
    if (match.status === "approved") {
      setStep("approved");
      const url = service.getFileView(document.fileId);
      setFileUrl(url.href || url);

      // Save accessor email and time
      const newLog = [
        ...(document.accessLog || []),
        { email, time: new Date().toISOString() }
      ];
      await service.updateAccessLog(id, newLog);
    } else if (match.status === "rejected") {
      setStep("denied");
    } else {
      setError("Your request is still pending approval.");
    }
  } else {
    setError("Invalid OTP or email.");
  }
};


  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center mt-10 text-blue-600 font-medium">
        Loading document...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
        Request Document Access
      </h2>
      <p className="mb-2 text-gray-700">
        <span className="font-medium">Filename:</span> {document.filename}
      </p>

      {step === "request" && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleRequestAccess}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Request OTP
          </button>
        </>
      )}

      {step === "waiting" && (
        <>
          <p className="text-gray-600 mb-2">Enter the OTP sent to your email.</p>
          <OTPInput value={otp} onChange={setOtp} />
          <button
            onClick={handleVerify}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit OTP
          </button>
        </>
      )}

      {step === "approved" && (
        <div className="mt-6">
          <p className="text-green-600 mb-2">✅ Access Approved</p>
          <iframe
            src={fileUrl}
            title="Document Viewer"
            className="w-full h-[500px] border rounded-lg"
          ></iframe>
        </div>
      )}

      {step === "denied" && (
        <p className="text-red-600 mt-4">❌ Your access was denied by the owner.</p>
      )}
    </div>
  );
};

export default Preview;


