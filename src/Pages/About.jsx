import { FaShieldAlt, FaClock, FaQrcode, FaUserLock } from "react-icons/fa";
import one from '../images/one.jpeg'
// import two from '../images/two.jpeg'
const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">About DocVault</h1>
        <p className="text-gray-600 text-lg">
          A secure, QR-based document sharing platform powered by OTP verification.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3209/3209342.png"
          alt="Document Security"
          className="w-52 mx-auto mt-6"
        />
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Key Features</h2>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 text-center">
          <div className="p-4 border rounded-lg shadow-sm hover:bg-blue-700 hover:text-white ">
            <FaQrcode className="text-3xl text-blue-600 mx-auto mb-2 " />
            <h3 className="font-semibold ">Single QR for All Docs</h3>
          </div>
          <div className="p-4 border rounded-lg shadow-sm hover:bg-blue-700 hover:text-white">
            <FaUserLock className="text-3xl text-blue-600 mx-auto mb-2 " />
            <h3 className="font-semibold ">OTP-Based Access</h3>
          </div>
          <div className="p-4 border rounded-lg shadow-sm hover:bg-blue-700 hover:text-white">
            <FaClock className="text-3xl text-blue-600 mx-auto mb-2 " />
            <h3 className="font-semibold ">Time-Limited Sharing</h3>
          </div>
          <div className="p-4 border rounded-lg shadow-sm hover:bg-blue-700 hover:text-white">
            <FaShieldAlt className="text-3xl text-blue-600 mx-auto mb-2 " />
            <h3 className="font-semibold ">Privacy First</h3>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">How It Works</h2>
        <ol className="relative border-l border-blue-300 space-y-8 pl-6">
          <li>
            <h3 className="font-bold text-blue-600">1. Upload Documents</h3>
            <p className="text-gray-600">Securely upload your important documents.</p>
          </li>
          <li>
            <h3 className="font-bold text-blue-600">2. Get a QR Code</h3>
            <p className="text-gray-600">One QR for all your documents.</p>
          </li>
          <li>
            <h3 className="font-bold text-blue-600">3. Share with Scanner</h3>
            <p className="text-gray-600">They scan → You get OTP → You approve selected docs.</p>
          </li>
          <li>
            <h3 className="font-bold text-blue-600">4. Access Logged</h3>
            <p className="text-gray-600">Each access is tracked on your dashboard.</p>
          </li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Meet the Team</h2> 
        <div className="flex justify-center gap-10 flex-wrap">
          <div className="text-center">
            <img
              // src="https://api.dicebear.com/7.x/thumbs/svg?seed=Yash"
              src={one}
              alt="Team Member"
              className="w-64 h-34 rounded-md mb-2"
            />
            <h4 className="font-semibold">Yash Jaiswal</h4>
            <p className="text-gray-500 text-sm">Full Stack Developer</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-blue-700">Is it safe to upload documents?</h3>
            <p className="text-gray-600">Yes. All documents are encrypted and access is OTP-controlled.</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700">Can someone access my docs without OTP?</h3>
            <p className="text-gray-600">No. You must approve document access via OTP every time.</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700">How long is the OTP valid?</h3>
            <p className="text-gray-600">Each OTP is valid for 40 seconds only.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

