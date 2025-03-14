import 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Image from './image';
import { CarouselEx } from './assets/Carsoule';
import Intro from './pages/Hero';
import Login from './pages/Login';
import CustomButton from './assets/CustomButton';
import Signup from './pages/Signup';
import Navbar from './assets/Navbar';
import { useState } from 'react';
import Home from './pages/Home'
import Footer from './pages/Footer'



function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [ setIsAuthenticated] = useState(false);

  const handleSignOut = () => {
    setIsAuthenticated(false); 
    navigate('/intro');
  };

  const isPublicPage = location.pathname === '/intro' || location.pathname === '/login'  || location.pathname === '/signup' || location.pathname === '/';

  return (
    <div className="min-h-screen">
      {isPublicPage ? (
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      ) : (
        <div className="pt-16">
          <Navbar onSignOut={handleSignOut} />
          <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/images" element={<Image />} />
        <Route path="/carousel" element={<CarouselEx />} />
        <Route path="/custombuttom" element={<CustomButton />} />
          </Routes>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}