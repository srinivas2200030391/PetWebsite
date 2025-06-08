import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartIcon as HeartOutlineIcon, EyeIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"; 
import PropTypes from "prop-types";
import ImageCarousel from "../petshop/ImageCarousel";

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

const MatingPetCard = ({ pet = { photosAndVideos: [] }, onAddToWishlist, onViewDetails, wishlist = [] }) => {
  const [isHovering, setIsHovering] = useState(false);
  const isWishlisted = wishlist?.includes(pet._id) || false;

  const petImages = Array.isArray(pet.photosAndVideos) && pet.photosAndVideos.length > 0
    ? pet.photosAndVideos
    : [];

  const hasMultipleImages = petImages.length > 1;

  const isAvailable = pet.availability === "available";
  
  const statusStyles = isAvailable 
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-red-100 text-red-700 border-red-200";

  return (
    <motion.div
      variants={itemAnimation}
      whileHover={{ scale: 1.03, y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="h-full flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      layout
    >
      <div className="relative aspect-[4/3] group">
        <ImageCarousel 
          images={petImages} 
          onClick={() => onViewDetails(pet)}
        />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist(pet._id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md z-20 
            transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 
            ${isWishlisted ? "text-red-500" : "text-gray-700 hover:text-red-500"}`}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isWishlisted ? <HeartSolidIcon className="h-6 w-6" /> : <HeartOutlineIcon className="h-6 w-6" />}
        </button>

        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 hidden md:flex items-center justify-center pointer-events-none"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(pet);
                }}
                className="pointer-events-auto p-3 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-indigo-600 transition-colors shadow-md"
                aria-label="View Details"
              >
                <EyeIcon className="h-6 w-6" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate" title={pet.breedName || "Unnamed Pet"}>
          {pet.breedName || "Unnamed Pet"}
        </h3>
        
        {pet.breedLineage && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow min-h-[40px]" title={pet.breedLineage}>
            {pet.breedLineage}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {[pet.age && `${pet.age} years`, pet.gender, pet.petQuality, pet.location].filter(Boolean).map((tag, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewDetails(pet)}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors min-h-[44px]"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

MatingPetCard.propTypes = {
  pet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    breedName: PropTypes.string,
    breedLineage: PropTypes.string,
    photosAndVideos: PropTypes.arrayOf(PropTypes.string),
    availability: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.string,
    petQuality: PropTypes.string,
    location: PropTypes.string,
  }),
  onAddToWishlist: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  wishlist: PropTypes.array,
};

export default MatingPetCard; 