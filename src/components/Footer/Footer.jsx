const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 px-8 mt-10 border-t">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600">DocVault</h2>
          <p className="text-sm">Secure document access with QR & OTP</p>
        </div>

        {/* Links */}
        <div className="flex gap-6">
          <div>
            <h3 className="font-medium">Navigation</h3>
            <ul className="text-sm space-y-1 mt-2">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/about" className="hover:underline">About</a></li>
              <li><a href="/login" className="hover:underline">Login</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Legal</h3>
            <ul className="text-sm space-y-1 mt-2">
              <li><a  className="hover:underline">Privacy Policy</a></li>
              <li><a  className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-medium">Contact</h3>
          <p className="text-sm mt-2">📧 support@docvault.com</p>
          <p className="text-sm">📞 +91-8382044282</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} DocVault. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

