import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import conf from "../conf/config";
import service from "../appwrite/config";

const ScanUserQR = () => {
  const { id: userId } = useParams(); // QR scanned: /scan/:id
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const navigate = useNavigate();

  const sendOtpToOwner = async () => {
    try {
      // console.log("📩 Starting OTP send...");
      // console.log("🔍 QR userId (from URL):", userId);

      
      const res = await service.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );

      

      // Filter documents by matching userId
      const ownerDocs = res.documents.filter(
        (doc) => doc.userId?.trim() === userId?.trim()
      );

      if (ownerDocs.length === 0) {
        console.warn("⚠️ No matching documents found for this user.");
        setError("This user has not uploaded any documents yet.");
        return;
      }

      const ownerEmail = ownerDocs[0]?.email;
      // console.log("✅ Matched owner's email:", ownerEmail);

      if (!ownerEmail) {
        setError("Owner email not found in the document.");
        return;
      }

      // Send OTP to owner's email
      const response = await fetch("https://doc-scanner-backend.onrender.com/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ownerEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Failed to send OTP.");
      }

      console.log("✅ OTP sent to owner:", data.otp);
      setSent(true);
      setServerOtp(data.otp); // Store OTP to compare later
    } catch (err) {
      // console.error("OTP send failed:", err);
      setError("Could not send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
  try {
    const response = await fetch("https://your-backend-url.vercel.app/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: ownerEmail, otp }), // ownerEmail = jiska QR scan hua
    });

    const data = await response.json();
    console.log("Verify Response:", data);

    if (data.success) {
      console.log("✅ OTP matched! Navigating...");
      navigate(`/access-form/${userId}`);
    } else {
      console.warn("❌ OTP mismatch:", data.message);
      alert("Invalid OTP");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    alert("Server error while verifying OTP");
  }
};



  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Request Access</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {!sent ? (
        <button
          onClick={sendOtpToOwner}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send OTP to Owner
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded mt-4"
          />
          <button
            onClick={verifyOtp}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
          >
            Verify & Continue
          </button>
        </>
      )}
    </div>
  );
};

export default ScanUserQR;
