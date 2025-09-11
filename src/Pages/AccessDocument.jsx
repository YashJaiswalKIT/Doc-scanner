import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import service from "../appwrite/config";
import conf from "../conf/config";

const AccessDocument = () => {
  const { requestId } = useParams();
  const [requestData, setRequestData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestAndDocs = async () => {
      try {
        // Step 1: Get the access request document
        const req = await service.databases.getDocument(
          conf.appwriteDatabaseId,
          conf.accessRequestCollectionId,
          requestId
        );

        setRequestData(req);

        // Step 2: Get all documents from the database
        const allDocs = await service.databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId
        );

        // Step 3: Filter only those documents which were approved
        const approvedDocs = allDocs.documents.filter((doc) =>
          req.accessDocuments?.includes(doc.$id)
        );

        setDocuments(approvedDocs);
      } catch (err) {
        console.error("Error loading documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestAndDocs();
  }, [requestId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Approved Documents
      </h2>

      {documents.length === 0 ? (
        <p className="text-center text-gray-500">
          No documents approved for you.
        </p>
      ) : (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li
              key={doc.$id}
              className="p-4 border rounded flex justify-between items-center"
            >
              <span className="font-medium">{doc.filename}</span>

              <a
                href={`https://cloud.appwrite.io/v1/storage/buckets/${conf.appwriteBucketId}/files/${doc.fileId}/view?project=${conf.appwriteProjectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:underline"
              >
                {requestData.permission === "download" ? "Download" : "View"}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccessDocument;
