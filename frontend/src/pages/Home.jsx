import  { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Carsoule from "../components/Carsoule";
import PetStore from "./petshop/PetStore";
import Cart from "./Cart";

const Home = () => {
  const [ setCartCount] = useState(0);
  const userId = 1; // Assuming this is the user ID you want to use

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content with navigation */}
      <div className="container mx-auto px-4">
        {/* Navigation tabs for Store and Cart */}
        {/*<div className="flex justify-center my-6">
          <div className="flex space-x-4 bg-white rounded-lg shadow-sm p-1">
            <Link
              to="/home"
              className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              Home
            </Link>
            <Link
              to="/home/store"
              className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              Store
            </Link>
            <Link
              to="/home/cart"
              className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors relative">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>*/}

        {/* Routes for Store and Cart components */}
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route
            path="/store"
            element={
              <PetStore userId={userId} updateCartCount={updateCartCount} />
            }
          />
          <Route
            path="/cart"
            element={<Cart userId={userId} updateCartCount={updateCartCount} />}
          />
        </Routes>
      </div>
    </div>
  );
};

// Home Dashboard component that shows the cards from your Example component
const HomeDashboard = () => {
  return (
    <div className="flex flex-col gap-10 py-8 pt-20">
      <Carsoule />
      <div className="flex items-center justify-center">
        <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
          <Link to="/Petshop" className="col-span-12 sm:col-span-4 h-[300px]">
            <div className="col-span-12 sm:col-span-4 h-[300px] relative rounded-lg overflow-hidden shadow-md">
            <div className="absolute z-10 top-4 left-4 flex-col items-start bg-black/40 p-4 rounded-lg">
                <p className="text-xs text-white uppercase font-bold">
                  get your pet
                </p>
                <h4 className="text-white  font-medium text-lg ">
                  make a new family member
                </h4>
              </div>
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src="https://th.bing.com/th/id/OIP.vwvnhsGDlYUe0aAGkmZ01QHaE9?w=201&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
              />
            </div>
          </Link>
          <Link to="/boardingshopfilter" className="col-span-12 sm:col-span-4 h-[300px]">
            <div className="col-span-12 sm:col-span-4 h-[300px] relative rounded-lg overflow-hidden shadow-md">
            <div className="absolute z-10 top-4 left-4 flex-col items-start bg-black/40 p-4 rounded-lg">
                <p className="text-xs text-white/60 uppercase font-bold">
                  Boarding
                </p>
                <h4 className="text-white font-medium text-lg">
                  Contribute to the planet
                </h4>
              </div>
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src="https://th.bing.com/th/id/OIP.xYSNjDohKFLQ772jMNKyJwHaH5?w=141&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
              />
            </div>
          </Link>
          <Link to="" className="col-span-12 sm:col-span-4 h-[300px]">
          <div className="col-span-12 sm:col-span-4 h-[300px] relative rounded-lg overflow-hidden shadow-md">
            <div className="absolute z-10 top-4 left-4 flex-col items-start bg-black/40 p-4 rounded-lg">
              <p className="text-xs text-white/60 uppercase font-bold bg-">
                Mating
              </p>
              <h4 className="text-white font-medium text-lg">
                Find your pet&apos;s soulmate
              </h4>
            </div>
            <img
              alt="Card background"
              className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
              src="https://th.bing.com/th/id/OIP.lwQpnNeH45lJijCQPCh5zwHaFW?w=244&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
            />
          </div>
          </Link>
          <Link to="" className="col-span-12 sm:col-span-4 h-[300px]">
          <div className="w-full h-[300px] col-span-12 sm:col-span-5 relative rounded-lg overflow-hidden shadow-md">
          <div className="absolute z-10 top-4 left-4 flex-col items-start bg-black/40 p-4 rounded-lg">
              <p className="text-xs text-white/60 uppercase font-bold">Services</p>
              <h4 className="text-white  font-medium text-2xl">more for your pet</h4>
            </div>
            <img
              alt="Card background"
              className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
              src="https://heroui.com/images/card-example-6.jpeg"
            />
          </div>
          </Link> 
          <Link to="/aboutpets" className="h-[300px] col-span-4 sm:col-span-7">
          <div className="w-full h-[300px] col-span-4 sm:col-span-7 relative rounded-lg overflow-hidden shadow-md">
          <div className="absolute z-10 top-4 left-4 flex-col items-start bg-black/40 p-4 rounded-lg">
          <p className="text-xs text-white uppercase font-bold">
                Know about your pet
              </p>
              <h4 className="text-white font-medium text-xl">
                Checkout Here
              </h4>
            </div>
            <img
              alt="Relaxing app background"
              className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
              src="https://th.bing.com/th/id/OIP.So4l2emDpPInq3Cb2lWddgHaE8?w=274&h=183&c=7&r=0&o=5&dpr=2&pid=1.7"
            />
            <div className="absolute bg-black/40 bottom-0 z-10 border-t border-gray-600 w-full p-4 flex justify-between items-center">
              <div className="flex gap-2 items-center">
            <div className="absolute z-10 top-4 left-4 flex-col items-sta ">
                  <p className="text-xs text-white/60">LEARN</p>
                  <p className="text-xs text-white/60">
                   More about your pet
                  </p>
                </div>
              </div>
              <button className="bg-white text-black px-3 py-1 rounded-full text-xs">
                Click here
              </button>
            </div>
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;