// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./pages/Footer";
// import Intro from "./pages/HomeCards";
// import Login from "./pages/Authenticating/Login";
// import Signup from "./pages/Authenticating/Signup";
// import Home from "./pages/Home";
// import Petshop from "./pages/petshop/Petshop";
// import ProductOverview from "./pages/petshop/ProductOverView";
// import MatingPage from "./pages/Mating/MatingPage";
// import MatingPageFilter from "./pages/Mating/MatingPageFilter";
// import MatingPets from "./pages/Mating/MatingPets";
// import Form from "./components/AppointmentFrom";
// import PetSaleForm from "./components/PetSaleForm";
// import MatingForm from "./components/MatingForm";
// import BoardingPage from "./pages/boarding/BoardingPage";
// import BoardingShops from "./pages/boarding/BoardingShops";
// import BoardingShopFilter from "./pages/boarding/BoardingShopFilter";
// import CustomButton from "./components/CustomButton";
// import AboutPets from "./pages/About/AboutPets";
// import { Toaster } from "react-hot-toast";
// import DogBreeds from './pages/About/DogBreeds';

// const App = () => {
//   // Auth removed
// //  const authUser = true; // Force as always logged in (or set to false for always logged out)

//   return (
//     <div className="min-h-screen">
//       <Navbar />
//       <Routes>
//         <Route path="/home/*" element={<Home />} />
//         <Route path="/custombutton" element={<CustomButton />} />
//         <Route path="/petshop" element={<Petshop />} />
//         <Route path="/productoverview" element={<ProductOverview />} />
//         <Route path="/matingpage" element={<MatingPage />} />
//         <Route path="/matingpagefilter" element={<MatingPageFilter />} />
//         <Route path="/matingpets" element={<MatingPets />} />
//         <Route path="/form" element={<Form />} />
//         <Route path="/petsaleform" element={<PetSaleForm />} />
//         <Route path="/matingform" element={<MatingForm />} />
//         <Route path="/boardingpage" element={<BoardingPage />} />
//         <Route path="/boardingshops" element={<BoardingShops />} />
//         <Route path="/boardingshopfilter" element={<BoardingShopFilter />} />
//         <Route path="/aboutpets" element={<AboutPets />} />
//         <Route path="/dog-breeds/:item" element={<DogBreeds />} />
//         <Route path="/" element={<Intro />} />
//         <Route path="/intro" element={<Intro />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="*" element={<Navigate to="/home" />} />
//       </Routes>
//       <Toaster />
//       <Footer />
//     </div>
//   );
// };

// export default function AppWrapper() {
//   return (
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   );
// }

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";
import Intro from "./pages/HomeCards";
import Login from "./pages/Authenticating/Login";
import Signup from "./pages/Authenticating/Signup";
import Home from "./pages/Home";
import Petshop from "./pages/petshop/Petshop";
import Products from "./pages/petshop/Products";
import ProductOverview from "./pages/petshop/ProductOverView";
import MatingPage from "./pages/Mating/MatingPage";
import MatingPageFilter from "./pages/Mating/MatingPageFilter";
import MatingPets from "./pages/Mating/MatingPets";
import Form from "./components/AppointmentFrom";
import PetSaleForm from "./components/PetSaleForm";
import MatingForm from "./components/MatingForm";
import BoardingPage from "./pages/boarding/BoardingPage";
import BoardingShops from "./pages/boarding/BoardingShops";
import BoardingShopFilter from "./pages/boarding/BoardingShopFilter";
import CustomButton from "./components/CustomButton";
import AboutPets from "./pages/About/AboutPets";
import { useAuthStore } from "./pages/store/useAuthstore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import DogBreeds from "./pages/About/DogBreeds";

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
      {<Navbar />}
      <Routes>
        {/* <Route path="/home/*" element={authUser ? <Home /> : <Navigate to="/login" />} /> */}
        <Route path="/home/*" element={<Home />} />
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
        <Route path="/aboutpets" element={<AboutPets />} />
        <Route path="/breeds/:item" element={<DogBreeds />} />

        <Route
          path="/"
          element={!authUser ? <Intro /> : <Navigate to="/home" />}
        />
        <Route
          path="/intro"
          element={!authUser ? <Intro /> : <Navigate to="/home" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/home" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/home" />}
        />

        <Route path="*" element={<Navigate to={"/home"} />} />
        {/* <Route
          path="*"
          element={<Navigate to={authUser ? "/home" : "/login"} />}
        /> */}
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

//Disable authentication
