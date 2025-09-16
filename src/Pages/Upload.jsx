import React, { useState } from "react";
import service from "../appwrite/config"; // 👈 yeh service class hai
import { useNavigate } from "react-router-dom";

const Upload = ({ user }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
  e.preventDefault();
  if (!user) {
    alert("Login first!");
    navigate("/login");
    return;
  }
  if (!file) {
    setError("Please select a file.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const uploaded = await service.uploadFile(file, user.$id);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await service.addDocument({
      userId: user.$id,
      fileId: uploaded.$id,
      filename: uploaded.name,
      email: user.email,   // ✅ this will be used in ScanUserQR
      otpCode,
      accessLog: [],
      accessRequest: []
    });

    alert("File uploaded and document created successfully!");
    navigate("/dashboard");
  } catch (err) {
    console.error("Upload error:", err);
    setError("Failed to upload file.");
  } finally {
    setLoading(false);
  }
};

  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Upload Your Document</h2>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
