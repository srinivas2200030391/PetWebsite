import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./assets/Navbar";
import Footer from "./pages/Footer";
import Intro from "./pages/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Petshop from "./pages/Petshop";
import Products from "./pages/Products";
import ProductOverview from "./assets/ProductOverView";
import MatingPage from "./pages/Mating/MatingPage";
import MatingPageFilter from "./pages/Mating/MatingPageFilter";
import MatingPets from "./pages/Mating/MatingPets";
import Form from "./pages/Form";
import PetSaleForm from "./assets/PetSaleForm";
import MatingForm from "./assets/MatingForm";
import BoardingPage from "./pages/boarding/BoardingPage";
import BoardingShops from "./pages/boarding/BoardingShops";
import BoardingShopFilter from "./pages/boarding/BoardingShopFilter";
import CustomButton from "./assets/CustomButton";
import { useAuthStore } from "./store/useAuthstore";
import { Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, ischeckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (ischeckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen">
      {authUser && <Navbar />}
      <Routes>
        <Route path="/home/*" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/custombutton" element={<CustomButton />} />
        <Route path="/petshop" element={<Petshop />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productoverview" element={<ProductOverview />} />
        <Route path="/matingpage" element={<MatingPage />} />
        <Route path="/matingpagefilter" element={<MatingPageFilter />} />
        <Route path="/matingpets" element={<MatingPets />} />
        <Route path="/form" element={<Form />} />
        <Route path="/petsaleform" element={<PetSaleForm />} />
        <Route path="/matingform" element={<MatingForm />} />
        <Route path="/boardingpage" element={<BoardingPage />} />
        <Route path="/boardingshops" element={<BoardingShops />} />
        <Route path="/boardingshopfilter" element={<BoardingShopFilter />} />

        <Route path="/" element={!authUser ? <Intro /> : <Navigate to="/home" />} />
        <Route path="/intro" element={!authUser ? <Intro /> : <Navigate to="/home" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/home" />} />

        <Route path="*" element={<Navigate to={authUser ? "/home" : "/login"} />} />
      </Routes>
      <Toaster />
      {authUser && <Footer />}
    </div>
  );
};

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}