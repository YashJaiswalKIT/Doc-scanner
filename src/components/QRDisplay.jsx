import React from "react";
import {QRCodeCanvas} from "qrcode.react";

const QRDisplay = ({ userId }) => {
  const accessUrl = `https://doc-scanner-hxn2r2wxq-yashjaiswalkits-projects.vercel.app/scan/${userId}`;

  console.log("QR URL:", accessUrl);
  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-600 mb-2">Scan to request document access:</p>
      <QRCodeCanvas value={accessUrl} size={160} />
    </div>
  );
};

export default QRDisplay;
