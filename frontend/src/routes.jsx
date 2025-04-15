// import { Route, Navigate } from "react-router-dom";
// import Home from "./pages/Home";
// import CustomButton from "./components/CustomButton";
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
// import AboutPets from "./pages/About/AboutPets";
// import Breeds from "./pages/About/Breeds";
// import BreedDetailPage from "./pages/About/BreedDetailPage";
// import Intro from "./pages/Intro";
// import Login from "./pages/Authenticating/Login";
// import Signup from "./pages/Authenticating/Signup";

// const AppRoutes = ({ authUser }) => {
//   return (
//     <>
//       <Route path="/home/*" element={<Home />} />
//       <Route path="/custombutton" element={<CustomButton />} />
//       <Route path="/petshop" element={<Petshop />} />
//       <Route path="/productoverview" element={<ProductOverview />} />
//       <Route path="/matingpage" element={<MatingPage />} />
//       <Route path="/matingpagefilter" element={<MatingPageFilter />} />
//       <Route path="/matingpets" element={<MatingPets />} />
//       <Route path="/form" element={<Form />} />
//       <Route path="/petsaleform" element={<PetSaleForm />} />
//       <Route path="/matingform" element={<MatingForm />} />
//       <Route path="/boardingpage" element={<BoardingPage />} />
//       <Route path="/boardingshops" element={<BoardingShops />} />
//       <Route path="/boardingshopfilter" element={<BoardingShopFilter />} />
//       <Route path="/aboutpets" element={<AboutPets />} />
//       <Route path="/breeds/:item" element={<Breeds />} />
//       <Route path="/pet/breeds/:item" element={<BreedDetailPage />} />

//       <Route
//         path="/"
//         element={!authUser ? <Intro /> : <Navigate to="/home" />}
//       />
//       <Route
//         path="/intro"
//         element={!authUser ? <Intro /> : <Navigate to="/home" />}
//       />
//       <Route
//         path="/login"
//         element={!authUser ? <Login /> : <Navigate to="/home" />}
//       />
//       <Route
//         path="/signup"
//         element={!authUser ? <Signup /> : <Navigate to="/home" />}
//       />

//       <Route path="*" element={<Navigate to={"/home"} />} />
//     </>
//   );
// };

// export default AppRoutes;