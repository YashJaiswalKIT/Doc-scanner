import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import service from "../appwrite/config";
import conf from "../conf/config";
const VerifyOTP = () => {
  const { userId} = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestDoc, setRequestDoc] = useState(null);

  useEffect(() => {
    // Fetch the OTP from the database
    const fetchRequest = async () => {
      try {
        const res = await service.databases.getDocument(
          conf.appwriteDatabaseId,
          conf.accessRequestCollectionId,
          userId
        );
        setRequestDoc(res);
      } catch (err) {
        console.error("Failed to fetch request", err);
        setError("Invalid or expired link.");
      }
    };

    fetchRequest();
  }, [userId]);

  const handleVerify = async () => {
    setSubmitting(true);
    setError("");

    if (!requestDoc) {
      setError("No request data found.");
      setSubmitting(false);
      return;
    }

    const now = new Date();
    const expiry = new Date(requestDoc.otpExpiresAt);

    if (now > expiry) {
      setError("OTP has expired. Please try again.");
      setSubmitting(false);
      return;
    }

    if (otp !== requestDoc.otpCode) {
      setError("Incorrect OTP. Please try again.");
      setSubmitting(false);
      return;
    }

    try {
      // Mark OTP as verified
      await service.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.accessRequestCollectionId,
        userId,
        {
          otpVerified: true,
        }
      );

      navigate(`/access-approval/${userId}`); // Proceed to approval page
    } catch (err) {
      console.error("Verification failed", err);
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Verify OTP</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleVerify}
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {submitting ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
};

export default VerifyOTP;
