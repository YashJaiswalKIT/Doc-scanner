import { Link } from "react-router-dom";

const Header = ({ user, handleLogout }) => {
  
  return (
    
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-blue-600">DocVault</Link>

      <nav className="flex items-center gap-5">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/about" className="hover:text-blue-500">About</Link>

        {user ? (
          <>
            <Link to="/upload" className="hover:text-blue-500">Upload</Link>
            <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-500">Login</Link>
            <Link to="/signup" className="hover:text-blue-500">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

