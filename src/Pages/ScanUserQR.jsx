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
const [ownerEmail, setOwnerEmail] = useState("");
  /**
   * 📩 Send OTP to Owner's Email
   */
  const sendOtpToOwner = async () => {
    try {
      // Fetch all documents from Appwrite
      const res = await service.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );

      // Find owner's document by matching userId
      const ownerDocs = res.documents.filter(
        (doc) => doc.userId?.trim() === userId?.trim()
      );

      if (ownerDocs.length === 0) {
        setError("This user has not uploaded any documents yet.");
        return;
      }

      const ownerEmail = ownerDocs[0]?.email;
      if (!ownerEmail) {
        setError("Owner email not found in the document.");
        return;
      }

      // Call backend to send OTP
      const response = await fetch(
        "https://doc-scanner-backend.onrender.com/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: ownerEmail }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Failed to send OTP.");
      }

      console.log("✅ OTP sent to owner:", data.otp);

      // Save OTP locally to compare later
      setSent(true);
      setServerOtp(data.otp);
    } catch (err) {
      console.error("OTP send failed:", err);
      setError("Could not send OTP. Please try again.");
    }
  };

  /**
   * ✅ Verify entered OTP
   */
  const verifyOtp = () => {
    console.log("Entered OTP:", otp);
    console.log("Server OTP:", serverOtp);

    if (otp.trim() === serverOtp?.toString().trim()) {
      console.log("✅ OTP matched! Navigating...");
      navigate(`/access-form/${userId}`);
    } else {
      console.warn("❌ OTP mismatch");
      alert("Invalid OTP");
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
