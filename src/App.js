import React, { useEffect, useState } from "react";
import { Routes, Route,useNavigate } from "react-router-dom";
import './index.css';
import AccessDocument from "./Pages/AccessDocument";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Upload from "./Pages/Upload";
import Preview from "./Pages/Preview";
import AccessRequestForm from "./Pages/AccessRequestForm";
import Signup from "./Pages/SignUp";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import NotFound from "./Pages/NotFound";
import ScanUserQR from "./Pages/ScanUserQR";
import VerifyOTP from "./Pages/VerifyOTP";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import authService from "./appwrite/auth";
import AccessApproval from "./Pages/AccessApproval";
import RequestSubmitted from "./Pages/RequestSubmitted";


function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    authService.getCurrentUser().then((userData) => {
      setUser(userData);
      setLoading(false);
    });
  }, []);
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);             // Clear user state
    navigate("/login");        // Redirect to login
  };
  

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header user={user} handleLogout={handleLogout}/>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/upload" element={<Upload user={user} />} />
          <Route path="/preview/:id" element={<Preview />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/request-submitted/:requestId" element={<RequestSubmitted />} />
          <Route path="/view/:requestId" element={<AccessDocument />} />
          <Route path="/access-form/:userId" element={<AccessRequestForm />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/scan/:id" element={<ScanUserQR />} />
          <Route path="/approve/:requestId" element={<AccessApproval />} />
          <Route path="/verify-otp/:id" element={<VerifyOTP />} />
        </Routes>
        

      </main>
      <Footer />
    </div>
  );
}

export default App;
