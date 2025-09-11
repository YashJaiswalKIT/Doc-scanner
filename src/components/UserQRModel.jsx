import React from "react";
import {QRCodeCanvas} from "qrcode.react";

const UserQRModal = ({ userId, onClose }) => {
  const url = `http://192.168.36.67:3000/scan/${userId}`;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4">Your QR Code</h3>
        <QRCodeCanvas value={url} size={200} />
        <p className="mt-2 text-sm text-gray-600 break-all">{url}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserQRModal;
