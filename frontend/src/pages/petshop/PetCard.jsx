import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartIcon as HeartOutlineIcon, EyeIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"; 
import PropTypes from "prop-types";
import ZoomableImage from "../../components/ZoomableImage";

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.3
    },
  },
};

// Card Image Carousel with swipe functionality
const CardImageCarousel = ({ images, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Ensure images is an array
  const displayImages = Array.isArray(images) && images.length > 0 
    ? images 
    : [];

  if (displayImages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1));
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation(); // Prevent the click from propagating when swiping
    
    const minSwipeDistance = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe left, go to next image
        nextImage();
      } else {
        // Swipe right, go to previous image
        prevImage();
      }
    } else {
      // If it's a tap (not a swipe), trigger the onClick handler
      if (onClick) onClick(displayImages, currentIndex);
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => onClick && onClick(displayImages, currentIndex)}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <img
            src={displayImages[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      
      {displayImages.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentIndex ? "bg-white w-3" : "bg-white/60"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PetCard = ({ pet = { images: [], price: '0' }, onAddToWishlist, onViewDetails, wishlist = [] }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const isWishlisted = wishlist?.includes(pet._id) || false;

  const petImages = Array.isArray(pet.images) && pet.images.length > 0
    ? pet.images
    : pet.imageUrl
      ? [pet.imageUrl]
      : []; // Default to empty array, CardImageCarousel will handle placeholder

  const hasMultipleImages = petImages.length > 1;

  const formattedPrice = !isNaN(parseFloat(pet.price))
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(pet.price))
    : `₹ ${pet.price || 'N/A'}`;

  const isAvailable = pet.status === "Available";
  
  const statusStyles = isAvailable 
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-red-100 text-red-700 border-red-200";

  // Handle image click to open gallery
  const handleImageClick = (images, index) => {
    setGalleryIndex(index);
    setShowGallery(true);
  };

  return (
    <motion.div
      variants={itemAnimation}
      className="h-full flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      layout // For smooth animations if list reorders
    >
      <div className="relative aspect-[4/3]">
        <CardImageCarousel 
          images={petImages} 
          onClick={handleImageClick}
        />
        <AnimatePresence>
          {isHovering && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 p-4"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(pet);
                }}
                className="p-3 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-indigo-600 transition-colors shadow-md min-h-[44px] min-w-[44px]"
                aria-label="View Details"
              >
                <EyeIcon className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWishlist(pet._id);
                }}
                className={`p-3 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md min-h-[44px] min-w-[44px] ${isWishlisted ? "text-red-500 hover:text-red-600" : "text-gray-700 hover:text-red-500"}`}
                aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {isWishlisted ? <HeartSolidIcon className="h-6 w-6" /> : <HeartOutlineIcon className="h-6 w-6" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate" title={pet.breed || pet.name || "Unnamed Pet"}>
          {pet.breed || pet.name || "Unnamed Pet"}
        </h3>
        
        <p className="text-xl font-bold text-indigo-600 my-1.5">
          {formattedPrice}
        </p>

        {pet.details && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow min-h-[40px]" title={pet.details}>
            {pet.details}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {[pet.age && `${pet.age} ${pet.ageUnit || "old"}`, pet.gender, pet.petQuality].filter(Boolean).map((tag, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onViewDetails(pet);
            }}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 min-h-[44px]"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ZoomableImage
        src={petImages[0] || ''}
        galleryImages={petImages}
        initialIndex={galleryIndex}
        showZoomIcon={false}
        aspectRatio={false}
        className="hidden" // Hide the component, we just want to use its modal
        isModalOpen={showGallery}
        onModalClose={() => setShowGallery(false)}
      />
    </motion.div>
  );
};

CardImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func
};

PetCard.propTypes = {
  pet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    breed: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    details: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    imageUrl: PropTypes.string,
    status: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ageUnit: PropTypes.string,
    gender: PropTypes.string,
    petQuality: PropTypes.string,
  }).isRequired,
  onAddToWishlist: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  wishlist: PropTypes.arrayOf(PropTypes.string),
};

export default PetCard;

