import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import service from "../appwrite/config";
import conf from "../conf/config";

const RequestSubmitted = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await service.databases.getDocument(
          conf.appwriteDatabaseId,
          conf.accessRequestCollectionId,
          requestId
        );

        setStatus(res.status);

        if (res.status === "approved") {
          // Wait 2 sec and redirect to view page
          setTimeout(() => navigate(`/view/${requestId}`), 2000);
        }

        if (res.status === "rejected") {
          clearInterval(interval); // stop checking
          setChecking(false);
        }
      } catch (err) {
        // console.error("Error checking status:", err);
        clearInterval(interval);
      }
    }, 3000); // check every 3s

    return () => clearInterval(interval);
  }, [requestId, navigate]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 text-center bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Request Submitted</h2>

      {status === "pending" && checking &&(
        <>
          <p className="text-gray-700">Please wait while the owner approves your access...</p>
          <p className="mt-4 text-sm text-gray-500">Checking status...</p>
        </>
      )}
      

      {status === "approved" && (
        <p className="text-green-600 font-semibold text-lg">✅ Approved! Redirecting...</p>
      )}

      {status === "rejected" && (
        <p className="text-red-600 font-semibold text-lg">❌ Rejected by the owner.</p>
      )}

      <p className="mt-4 text-gray-500 text-sm">Request ID: {requestId}</p>
    </div>
  );
};

export default RequestSubmitted;
