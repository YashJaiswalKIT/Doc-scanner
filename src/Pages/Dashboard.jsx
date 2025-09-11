import React, { useEffect, useState } from "react";
import authService from "../appwrite/auth";
import service from "../appwrite/config";
import conf from "../conf/config";
import QRDisplay from "../components/QRDisplay";

const Dashboard = () => {
  const [showQR, setShowQR] = useState(false);
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      setUser(u);
      if (u) {
        fetchUserDocuments(u.$id);
        fetchAccessRequests(u.$id);
      }
    });
  }, []);
  const handleShareQR = async () => {
  const qrLink = `${window.location.origin}/request-access/${user?.$id}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Access My Documents",
        text: "Scan this QR or open the link to request access to my documents.",
        url: qrLink,
      });
    } catch (error) {
      console.error("Sharing failed:", error);
    }
  } else {
    try {
      await navigator.clipboard.writeText(qrLink);
      alert("QR link copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Failed to copy QR link.");
    }
  }
};


  const fetchUserDocuments = async (userId) => {
    try {
      const res = await service.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );
      const userDocs = res.documents.filter((doc) => doc.userId === userId);
      setDocs(userDocs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessRequests = async (userId) => {
    try {
      const res = await service.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.accessRequestCollectionId
      );
      // const userRequests = res.documents.filter(
      //   (r) => r.userId === userId && r.status === "pending"
      // );
      const userRequests = res.documents.filter((r) => r.userId === userId);

      setRequests(userRequests);
    } catch (error) {
      console.error("Failed to fetch access requests:", error);
    }
  };

  // const updateRequestStatus = async (docId, requestEmail, newStatus, timestamp) => {
  //   try {
  //     const doc = docs.find((d) => d.$id === docId);
  //     if (!doc || doc.userId !== user.$id) {
  //       alert("Unauthorized update attempt");
  //       return;
  //     }

  //     const updatedRequests = (doc.accessRequests || []).map((req) =>
  //       req.email === requestEmail && req.timestamp === timestamp
  //         ? { ...req, status: newStatus }
  //         : req
  //     );

  //     await service.databases.updateDocument(
  //       conf.appwriteDatabaseId,
  //       conf.appwriteCollectionId,
  //       docId,
  //       { accessRequests: updatedRequests }
  //     );

  //     setDocs((prev) =>
  //       prev.map((d) =>
  //         d.$id === docId ? { ...d, accessRequests: updatedRequests } : d
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Failed to update request status:", error);
  //   }
  // };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Dashboard</h2>
      {user ? (
        <>
          <p className="text-gray-700 mb-4">
            Welcome, {user.name || user.email}!
          </p>
          <button
            onClick={() => setShowQR(true)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Show My QR
          </button>
          <button
          onClick={handleShareQR}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-green-700"
          >
    Share My QR
  </button>

          {showQR && <QRDisplay userId={user?.$id} />}

          {/* Document List */}
          {loading ? (
            <p>Loading documents...</p>
          ) : docs.length === 0 ? (
            <p>No documents uploaded yet.</p>
          ) : (
            <ul className="space-y-6">
              {docs.map((doc) => (
                <li key={doc.$id} className="p-4 border rounded">
                  <div className="font-semibold text-lg text-gray-800">
                    📄 {doc.filename}
                  </div>
                  <div className="text-sm text-gray-500">
                    File ID: {doc.fileId}
                  </div>
                  <div className="text-xs text-gray-400">
                    Uploaded: {new Date(doc.$createdAt).toLocaleString()}
                  </div>
                  <a
                    href={service.getFileView(doc.fileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm mt-1 inline-block"
                  >
                    View/Download
                  </a>
                </li>
              ))}
            </ul>
          )}

          
{requests.length > 0 && (
  <div className="mt-10">
    <h3 className="text-xl font-semibold mb-3 text-gray-800">
      Access Requests
    </h3>
    <ul className="space-y-4">
      {requests.map((r) => (
        <li key={r.$id} className="border p-4 rounded shadow-sm bg-gray-50">
          <p>
            <strong>{r.name}</strong> requested access to your documents.
          </p>
          <p className="text-sm text-gray-600">📧 {r.email}</p>
          <p className="text-sm text-gray-600">📞 {r.phone}</p>
          <p className="text-sm text-gray-600">🏠 {r.address}</p>
          <p className="text-sm text-gray-600">
            ⏰ {new Date(r.timestamp).toLocaleString()}
          </p>
          <p className="text-sm">
            <strong>Status:</strong>{" "}
            <span
              className={
                r.status === "approved"
                  ? "text-green-600"
                  : r.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {r.status}
            </span>
          </p>
          {r.status === "pending" && (
            <a
              href={`/approve/${r.$id}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm mt-1 inline-block"
            >
              Review & Approve
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
)}

        </>
      ) : (
        <p className="text-gray-500">Loading user...</p>
      )}
    </div>
  );
};

export default Dashboard;
