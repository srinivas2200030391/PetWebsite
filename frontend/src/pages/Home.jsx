import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Carsoule from "../components/Carsoule";
import Cart from "./Cart";
import salesimg from '../assets/salesimg.jpg';
import boardingimg from '../assets/boardingimg.jpeg';
import matingimg from '../assets/matingimg.jpeg';
import serviceimg from '../assets/serviceimg.jpg';
import aboutimg from '../assets/aboutimg.jpg';

const Home = () => {
  const [setCartCount] = useState(0);
  const userId = 1; 
  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
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
        <div className="max-w-[900px] gap-5 grid grid-cols-12 grid-rows-2 px-8">
          <Link to="/Petshop" className="col-span-12 sm:col-span-4 h-[300px] transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="h-[250px] sm:h-[300px] relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src={salesimg}
                style={{ aspectRatio: '16/9' }}
              />
                <div className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center px-4 backdrop-blur-sm">
                  <p className="text-white uppercase font-black tracking-wide text-sm leading-relaxed font-[' Winky Rough']">
                    Pet Store
                  </p>
                </div>
            </div>
          </Link>
          <Link to="/boardingshopfilter" className="col-span-12 sm:col-span-4 h-[300px] transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="col-span-12 sm:col-span-4 h-[300px] relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src={boardingimg}
                style={{ aspectRatio: '1/1' }}
              />
              <div className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center px-4 backdrop-blur-sm">
                  <p className="text-white uppercase font-black tracking-wide text-sm leading-relaxed font-[' Winky Rough']">
                    Boarding
                  </p>
                </div>
            </div>
          </Link>
          <Link to="/matingpage" className="col-span-12 sm:col-span-4 h-[300px] transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="col-span-12 sm:col-span-4 h-[300px] relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src={matingimg} 
                style={{ aspectRatio: '4/3' }}
              />
              <div className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center px-4 backdrop-blur-sm">
                  <p className="text-white uppercase font-black tracking-wide text-sm leading-relaxed font-[' Winky Rough']">
                    Match fixing 
                  </p>
                </div>
            </div>
          </Link>
          <Link to="/petservices" className="col-span-12 sm:col-span-4 h-[300px] transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="w-full h-[300px] col-span-12 sm:col-span-5 relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                alt="Card background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src={serviceimg}
                style={{ aspectRatio: '16/9' }}
              />
               <div className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center px-4 backdrop-blur-sm">
                  <p className="text-white uppercase font-black tracking-wide text-sm leading-relaxed font-[' Winky Rough']">
                    Pet Services
                  </p>
                </div>
            </div>
          </Link>
          <Link to="/aboutpets" className="h-[300px] col-span-4 sm:col-span-7 transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div className="w-full h-[300px] col-span-4 sm:col-span-7 relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img
                alt="Relaxing app background"
                className="z-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                src={aboutimg}
                style={{ aspectRatio: '16/9' }}
              />
             <div className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex items-center px-4 backdrop-blur-sm">
                  <p className="text-white uppercase font-black tracking-wide text-sm leading-relaxed font-[' Winky Rough']">
                    Know about your pet
                  </p>
                </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;