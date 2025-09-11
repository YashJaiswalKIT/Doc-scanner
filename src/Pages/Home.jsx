import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';

const Home=()=> {
  return(
<div className="min-h-screen">
      
      <section className="bg-blue-50 py-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            Share Documents Securely with QR Code + OTP
          </h1>
          <p className="text-gray-700 mb-6">
            Upload your important documents, generate a single QR code, and control access with OTP verification.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/upload">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">
                Upload Document
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="px-6 py-2 rounded-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
<section className="bg-gray-50 py-16 px-4">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-blue-800 mb-4">About Us</h2>
    <p className="text-gray-700 mb-6">
      We are a team passionate about privacy-first solutions. This platform is built to give users full control over document sharing with modern technologies like QR and OTP.
    </p>
    <Link to="/about">
      <Button variant="outline" className="rounded-full px-6 py-2">
        Learn More
      </Button>
    </Link>
  </div>
</section>

<section className="bg-white py-16 px-4">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">When to Use This Platform?</h2>
    <div className="space-y-6 border-l-4 border-blue-500 pl-6">
      <div>
        <h3 className="text-xl font-semibold text-blue-700">✅ Job Interviews</h3>
        <p className="text-gray-600">Share ID proofs, certificates without emailing files.</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-blue-700">✅ College Admissions</h3>
        <p className="text-gray-600">Securely share transcripts or academic records.</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-blue-700">✅ Tenant Verification</h3>
        <p className="text-gray-600">Send KYC documents to landlords in a secure way.</p>
      </div>
    </div>
  </div>
</section>
{/* FAQs */}
<section className="bg-blue-50 py-16 px-4">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Frequently Asked Questions</h2>
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-blue-700">🔒 How secure is this platform?</h4>
        <p className="text-gray-700">All files are stored securely. Access is OTP-gated and time-limited.</p>
      </div>
      <div>
        <h4 className="font-semibold text-blue-700">📎 Can I control which documents to show?</h4>
        <p className="text-gray-700">Yes, after OTP validation, you choose the documents to allow access.</p>
      </div>
      <div>
        <h4 className="font-semibold text-blue-700">📆 How long does the OTP stay valid?</h4>
        <p className="text-gray-700">OTP is valid for 40 seconds. After that, the request must be re-sent.</p>
      </div>
    </div>
  </div>
</section>
</div>

  );
  
};

export default Home
