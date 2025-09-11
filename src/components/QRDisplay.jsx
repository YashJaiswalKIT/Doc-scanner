import React from "react";
import {QRCodeCanvas} from "qrcode.react";

const QRDisplay = ({ userId }) => {
  const accessUrl = `http://192.168.36.67:3000/scan/${userId}`;
  console.log("QR URL:", accessUrl);
  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-600 mb-2">Scan to request document access:</p>
      <QRCodeCanvas value={accessUrl} size={160} />
    </div>
  );
};

export default QRDisplay;
