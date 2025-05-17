import {
  Card,
  CardBody,
  Typography,
  Button,
  Carousel,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "./../../config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPinIcon, StarIcon, PlusIcon, PhotoIcon } from "@heroicons/react/24/solid";

export default function BoardingShops() {
  const [boardingShops, setBoardingShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchBoardingShops();
  }, []);
  
  useEffect(() => {
    // Get query parameters
    const queryParams = new URLSearchParams(location.search);
    const locationParam = queryParams.get("location");
    const searchParam = queryParams.get("search");
    const typeParam = queryParams.get("type");
    
    if (boardingShops.length > 0) {
      let filtered = [...boardingShops];
      
      // Apply location filter
      if (locationParam) {
        filtered = filtered.filter(shop => 
          shop.location?.toLowerCase().includes(locationParam.toLowerCase())
        );
      }
      
      // Apply search filter
      if (searchParam) {
        const search = searchParam.toLowerCase();
        filtered = filtered.filter(shop => 
          shop.shopName.toLowerCase().includes(search) || 
          shop.shopDescription.toLowerCase().includes(search)
        );
      }
      
      // Apply pet type filter
      if (typeParam && typeParam !== 'all') {
        filtered = filtered.filter(shop => 
          shop.petTypes?.includes(typeParam)
        );
      }
      
      setFilteredShops(filtered);
    } else {
      setFilteredShops([]);
    }
  }, [location.search, boardingShops]);

  const fetchBoardingShops = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.baseURL}/api/boarding`);
      console.log("Boarding shops data:", response.data);
      
      if (response.data && response.data.data) {
        setBoardingShops(response.data.data);
        setFilteredShops(response.data.data);
      } else {
        setBoardingShops([]);
        setFilteredShops([]);
      }
    } catch (error) {
      console.error("Error fetching boarding shops:", error);
      setBoardingShops([]);
      setFilteredShops([]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading ? (
        <div className="text-center py-16">
          <Typography variant="h5" className="mb-3">Loading boarding centers...</Typography>
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl shadow-inner">
          <Typography variant="h5" className="mb-3">No boarding centers found</Typography>
          <Typography className="mb-6 text-gray-600">Try changing your search or filter criteria or add a new boarding center</Typography>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              color="orange" 
              className="flex items-center justify-center gap-2"
              onClick={() => navigate('/boarding')}
            >
              Reset Filters
            </Button>
            <Link to="/add-boarding">
              <Button 
                color="blue-gray" 
                className="flex items-center justify-center gap-2"
              >
                <PlusIcon className="h-4 w-4" /> Add New Boarding Center
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <LightCard key={shop._id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}

// Light and clean card component
function LightCard({ shop }) {
  const [isHovering, setIsHovering] = useState(false);
  
  // Calculate average price from price table
  const calculateAveragePrice = () => {
    if (!shop.priceTable || shop.priceTable.length === 0) {
      return "Price not specified";
    }
    
    const minPrice = Math.min(...shop.priceTable.map(item => Number(item.price)));
    return `₹${minPrice}`;
  };
  
  return (
    <Card 
      className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-0"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        {shop.images && shop.images.length > 0 ? (
          <SimpleCarousel 
            images={shop.images} 
            title={shop.shopName} 
            isActive={isHovering} 
            height="h-52"
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-100 h-52">
            <div className="text-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <Typography className="text-gray-500">No images available</Typography>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex justify-between items-center">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
              <MapPinIcon className="h-3 w-3 text-gray-600 mr-1" />
              <Typography className="text-xs font-medium text-gray-700">{shop.location || "Location not specified"}</Typography>
            </div>
            {/* No ratings in the backend, so omitting the rating display */}
          </div>
        </div>
      </div>
      
      <CardBody className="px-4 py-4">
        <div className="flex justify-between items-center mb-2">
          <Typography variant="h6" className="font-medium text-gray-800">
            {shop.shopName}
          </Typography>
          <Typography className="font-semibold text-orange-500">
            {calculateAveragePrice()}
          </Typography>
        </div>
        
        <Typography className="text-xs text-gray-600 mb-3 line-clamp-2">
          {shop.shopDescription || "No description available"}
        </Typography>
        
        <div className="mb-4 relative overflow-hidden h-6">
          {shop.amenities && shop.amenities.length > 0 ? (
            <InfiniteScrollingAmenities amenities={shop.amenities} />
          ) : (
            <Typography className="text-xs text-gray-500 italic">
              No amenities specified
            </Typography>
          )}
        </div>
        
        <Link to={`/boardingcenter/${shop._id}`} className="block w-full">
          <Button
            fullWidth
            variant="text"
            className="normal-case text-orange-500 hover:text-orange-600 border border-orange-200 hover:border-orange-300 hover:bg-orange-50 shadow-none rounded-lg"
          >
            View Details
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
}

// Infinite scrolling amenities component
function InfiniteScrollingAmenities({ amenities }) {
  const [isHovered, setIsHovered] = useState(false);
  const duplicatedAmenities = [...amenities, ...amenities, ...amenities];
  
  // Calculate animation duration based on number of items and text length
  // This creates a smooth and consistent speed regardless of content amount
  const calculateDuration = () => {
    const totalLength = amenities.reduce((acc, curr) => acc + curr.length, 0);
    // Base duration plus extra time for longer texts
    return Math.max(15, 8 + totalLength * 0.08);
  };
  
  const animationDuration = calculateDuration();
  
  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Create two copies of the amenities for seamless looping */}
      <div 
        className={`inline-flex gap-3 animate-scroll whitespace-nowrap ${isHovered ? 'animate-paused' : ''}`}
        style={{ 
          animationDuration: `${animationDuration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationName: 'scroll',
          animationPlayState: isHovered ? 'paused' : 'running'
        }}
      >
        {duplicatedAmenities.map((amenity, index) => (
          <span 
            key={index}
            className="inline-flex items-center text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1"></span>
            {amenity}
          </span>
        ))}
      </div>
      
      {/* Add fade effect on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10"></div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${100 / 3}%);
          }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
        .animate-paused {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

// Simple carousel with hover functionality
function SimpleCarousel({ images, title, isActive, height = "h-full" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  
  // Handle auto-scrolling based on hover state
  useEffect(() => {
    if (isActive && !intervalId) {
      const id = setInterval(() => {
        setActiveIndex((current) => (current + 1) % images.length);
      }, 2000);
      setIntervalId(id);
    } else if (!isActive && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, images.length, intervalId]);
  
  return (
    <div className={`${height} w-full`}>
      <Carousel
        autoplay={false}
        loop
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className={`absolute bottom-3 left-2/4 z-10 flex -translate-x-2/4 gap-1.5 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 w-3 cursor-pointer rounded-full transition-all ${
                  activeIndex === i ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
        className="h-full w-full"
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      >
        {images.map((image, index) => (
          <div key={index} className="h-full">
            <img
              src={image}
              alt={`${title} - image ${index + 1}`}
              className={`h-full w-full object-cover transition-transform duration-700 ${isActive ? 'scale-182' : 'scale-100'}`}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
