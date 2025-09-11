import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import service from '../appwrite/config';
import authService from '../appwrite/auth';
import conf from '../conf/config';

const AccessApproval = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const navigate = useNavigate();

  const COLLECTION_ID = conf.accessRequestCollectionId;
  const DATABASE_ID = conf.appwriteDatabaseId;

  // Step 1: Fetch request + check if owner
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await service.databases.getDocument(DATABASE_ID, COLLECTION_ID, requestId);
        const user = await authService.getCurrentUser();
        if (res.userId !== user.$id) {
          alert("You are not authorized to view this request.");
          return navigate('/dashboard');
        }
        setRequest(res);
      } catch (err) {
        console.error('Failed to fetch request:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId,COLLECTION_ID,DATABASE_ID, navigate]);

  // Step 2: Fetch owner documents
  useEffect(() => {
    const fetchOwnerDocs = async () => {
      try {
        const allDocs = await service.databases.listDocuments(
          DATABASE_ID,
          conf.appwriteCollectionId
        );
        const ownerDocs = allDocs.documents.filter(
          (doc) => doc.userId === request.userId
        );
        setDocuments(ownerDocs);
      } catch (err) {
        console.error("Failed to fetch owner's documents:", err);
      }
    };

    if (request) fetchOwnerDocs();
  }, [request,DATABASE_ID]);

  const handleDocSelection = (docId) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter(id => id !== docId));
    } else {
      setSelectedDocs([...selectedDocs, docId]);
    }
  };

  const handleApproval = async (permission) => {
    if (selectedDocs.length === 0) {
      alert("Please select at least one document to give access.");
      return;
    }

    try {
      await service.databases.updateDocument(DATABASE_ID, COLLECTION_ID, requestId, {
        status: 'approved',
        permission,
        accessDocuments: selectedDocs,
      });
      alert(`Access ${permission === 'read' ? 'granted (read only)' : 'granted with download'}!`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleReject = async () => {
    try {
      await service.databases.updateDocument(DATABASE_ID, COLLECTION_ID, requestId, {
        status: 'rejected',
      });
      alert('Access request rejected.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!request) return <div className="p-4 text-center text-red-600">Request not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Access Request</h2>

      <div className="space-y-2">
        <p><strong>Name:</strong> {request.name}</p>
        <p><strong>Email:</strong> {request.email}</p>
        <p><strong>Phone:</strong> {request.phone}</p>
        <p><strong>Address:</strong> {request.address}</p>
        <p><strong>Timestamp:</strong> {new Date(request.$createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> {request.status}</p>
      </div>

      {/* Show document selection if pending */}
      {request.status === 'pending' && (
        <>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Select documents to give access:</h3>
            {documents.length > 0 ? (
              <div className="space-y-1 max-h-40 overflow-y-auto border p-2 rounded">
                {documents.map((doc) => (
                  <label key={doc.$id} className="block">
                    <input
                      type="checkbox"
                      value={doc.$id}
                      checked={selectedDocs.includes(doc.$id)}
                      onChange={() => handleDocSelection(doc.$id)}
                      className="mr-2"
                    />
                    {doc.filename}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded by you.</p>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handleApproval('read')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Approve (Read Only)
            </button>
            <button
              onClick={() => handleApproval('download')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Approve (Download)
            </button>
            <button
              onClick={handleReject}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </>
      )}

      {request.status !== 'pending' && (
        <p className="mt-4 text-center text-gray-600">
          Request already {request.status}.
        </p>
      )}
    </div>
  );
};

export default AccessApproval;
