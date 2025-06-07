import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon, ShieldCheckIcon, CheckCircleIcon, EyeIcon, TagIcon, CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { HeartIcon, FireIcon, StarIcon } from "@heroicons/react/20/solid";
import config from "../../config";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ZoomableImage from "../../components/ZoomableImage";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Image Carousel Component for Pet Cards with touch/swipe support
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Handle empty images array
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 text-sm sm:text-base">No image available</p>
      </div>
    );
  }

  // Limit to 4 images maximum
  const displayImages = images.slice(0, 4);

  const nextImage = (e) => {
    e?.stopPropagation(); // Prevent event bubbling to parent elements
    setCurrentIndex((prevIndex) =>
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e) => {
    e?.stopPropagation(); // Prevent event bubbling to parent elements
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index, e) => {
    e?.stopPropagation(); // Prevent event bubbling to parent elements
    setCurrentIndex(index);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    // Minimum swipe distance (px)
    const minSwipeDistance = 50;
    const swipeDistance = touchEndX.current - touchStartX.current;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe right -> previous image
        prevImage(e);
      } else {
        // Swipe left -> next image
        nextImage(e);
      }
    } else {
      // It's a tap, open zoom view
      handleImageClick(e);
    }
  };
  
  const handleImageClick = (e) => {
    e?.stopPropagation(); // Prevent bubbling to parent card
    setShowZoomedImage(true);
  };

  return (
    <div 
      className="relative w-full h-64 overflow-hidden rounded-lg cursor-zoom-in"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleImageClick}
    >
      {displayImages.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-300 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}>
          <img
            src={image}
            alt={`Pet image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {displayImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="hidden sm:block absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full min-h-[44px] min-w-[44px]"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={nextImage}
            className="hidden sm:block absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full min-h-[44px] min-w-[44px]"
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => selectImage(index, e)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Zoomable Image Gallery Modal */}
      <ZoomableImage
        src={displayImages[currentIndex]}
        galleryImages={displayImages}
        initialIndex={currentIndex}
        showZoomIcon={false}
        aspectRatio={false}
        className="hidden" // Hide the component, we just want to use its modal
        isModalOpen={showZoomedImage}
        onModalClose={() => setShowZoomedImage(false)}
      />
    </div>
  );
};

// Pet Details Modal
const PetDetailsModal = ({
  pet,
  isOpen,
  onClose,
  wishlist,
  userId,
  payments,
  petType,
}) => {
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Early check moved outside of the component body
  if (!pet) return null;

  const isWishlisted = wishlist?.includes(pet._id) || false;
  const paymentStatus = payments?.includes(pet._id) || false;

  // Get appropriate images based on pet type
  const petImages = petType === "mating" 
    ? (pet.photosAndVideos || []) 
    : (pet.images || [pet.imageUrl]);
    
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowZoomedImage(true);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
          <DialogPanel className="mx-auto w-full max-w-2xl rounded-xl bg-white p-4 sm:p-6 shadow-xl">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {petType === "mating" ? pet.breedName : (pet.name || pet.breed)}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 min-h-[44px] min-w-[44px]"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <ImageCarousel images={petImages} />
              </div>
              <div>
                <div className="space-y-3 sm:space-y-4">
                  {/* Different fields based on pet type */}
                  {petType === "mating" ? (
                    <>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500">Breed</h4>
                        <p className="text-sm sm:text-base font-medium">{pet.breedName}</p>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500">Age</h4>
                        <p className="text-sm sm:text-base font-medium">{pet.age} years old</p>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500">Gender</h4>
                        <p className="text-sm sm:text-base font-medium">{pet.gender}</p>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500">Quality</h4>
                        <p className="text-sm sm:text-base font-medium">{pet.petQuality}</p>
                      </div>
                      {pet.location && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-500">Location</h4>
                          <p className="text-sm sm:text-base font-medium">{pet.location}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500">Breed</h4>
                        <p className="text-sm sm:text-base font-medium">{pet.breed}</p>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500">Age</h4>
                        <p className="text-sm sm:text-base font-medium">{pet.age} {pet.ageUnit || "years old"}</p>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500">Gender</h4>
                        <p className="text-sm sm:text-base font-medium">{pet.gender}</p>
                      </div>
                      {pet.weight && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-500">Weight</h4>
                          <p className="text-sm sm:text-base font-medium">{pet.weight}</p>
                        </div>
                      )}
                      {pet.height && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-500">Height</h4>
                          <p className="text-sm sm:text-base font-medium">{pet.height}</p>
                        </div>
                      )}
                      {pet.lifeSpan && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-500">Lifespan</h4>
                          <p className="text-sm sm:text-base font-medium">{pet.lifeSpan}</p>
                        </div>
                      )}
                    </>
                  )}
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500">Price</h4>
                    {petType === "mating" ? (
                      <div className="flex items-center space-x-2">
                        <p className="text-base sm:text-lg line-through text-gray-400">₹99</p>
                        <p className="text-lg sm:text-xl font-bold text-indigo-600">₹9</p>
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">Special Offer</span>
                      </div>
                    ) : (
                      <p className="text-lg sm:text-xl font-bold text-indigo-600">₹{pet.price}</p>
                    )}
                  </div>
                </div>

                {pet.details && (
                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                      Details
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700">{pet.details}</p>
                  </div>
                )}

                {pet.characteristics && (
                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                      Characteristics
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700">{pet.characteristics}</p>
                  </div>
                )}

                {/* Contact Info section */}
                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 border-t pt-4 sm:pt-6">
                  <h4 className="text-base sm:text-lg font-semibold text-indigo-700">
                    Contact Information
                  </h4>
                  
                  {petType === "mating" ? (
                    <>
                      {pet.breederName && (
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-500">Breeder's Name</h5>
                          <p className="text-sm sm:text-base text-gray-700">{pet.breederName}</p>
                        </div>
                      )}
                      {pet.phoneNum && (
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-500">Contact Number</h5>
                          <p className="text-sm sm:text-base text-gray-700">{pet.phoneNum}</p>
                        </div>
                      )}
                      {pet.shopAddress && (
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-500">Shop Address</h5>
                          <p className="text-sm sm:text-base text-gray-700">{pet.shopAddress}</p>
                        </div>
                      )}
                      {pet.breedLineage && (
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-500">Breed Lineage</h5>
                          <p className="text-sm sm:text-base text-gray-700">{pet.breedLineage}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {pet.breederName && (
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-500">Breeder's Name</h5>
                          <p className="text-sm sm:text-base text-gray-700">{pet.breederName}</p>
                        </div>
                      )}
                      {pet.phoneNumber && (
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-500">Contact Number</h5>
                          <p className="text-sm sm:text-base text-gray-700">{pet.phoneNumber}</p>
                        </div>
                      )}
                      {pet.shopAddress && (
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-500">Shop Address</h5>
                          <p className="text-sm sm:text-base text-gray-700">{pet.shopAddress}</p>
                        </div>
                      )}
                      {pet.location && (
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-500">Location</h5>
                          <p className="text-sm sm:text-base text-gray-700">{pet.location}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Payment Status Badge */}
                <div className="mt-4 sm:mt-6">
                  <div className="flex items-center text-green-600">
                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="text-sm sm:text-base font-medium">Payment Successful</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
      
      {/* Zoomable Image Modal */}
      {selectedImage && (
        <ZoomableImage
          src={selectedImage}
          galleryImages={petImages}
          initialIndex={petImages.indexOf(selectedImage)}
          showZoomIcon={false}
          aspectRatio={false}
          className="hidden" // Hide the component, we just want to use its modal
          isModalOpen={showZoomedImage}
          onModalClose={() => setShowZoomedImage(false)}
        />
      )}
    </Dialog>
  );
};

// Regular Pet Card Component - Redesigned
const PetCard = ({ pet, onViewDetails }) => {
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const petImages = pet.images || [pet.imageUrl];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <div className="aspect-[4/3] cursor-zoom-in" onClick={() => setShowZoomedImage(true)}>
          <img 
            src={petImages[0]} 
            alt={pet.name || pet.breed} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 sm:px-2.5 py-0.5 text-xs font-medium text-blue-800 border border-blue-200">
            Adoption
          </span>
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">{pet.name || pet.breed}</h3>
        
        <div className="mt-2 space-y-1 sm:space-y-1.5">
          <div className="flex items-center text-gray-600 text-xs sm:text-sm">
            <TagIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-gray-400" />
            <span>{pet.breed}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-xs sm:text-sm">
            <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-gray-400" />
            <span>{pet.age} {pet.ageUnit || "years old"}</span>
          </div>
          
          {pet.location && (
            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
              <MapPinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-gray-400" />
              <span>{pet.location}</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 sm:mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">Purchased</span>
          </div>
          
          <button
            onClick={() => onViewDetails(pet, "adoption")}
            className="inline-flex items-center rounded-md bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors min-h-[36px] sm:min-h-[40px]"
            aria-label="View details for this pet"
          >
            View Details
          </button>
        </div>
      </div>
      
      {/* Zoomable Image Modal */}
      <ZoomableImage
        src={petImages[0]}
        galleryImages={petImages}
        initialIndex={0}
        showZoomIcon={false}
        aspectRatio={false}
        className="hidden" // Hide the component, we just want to use its modal
        isModalOpen={showZoomedImage}
        onModalClose={() => setShowZoomedImage(false)}
      />
    </motion.div>
  );
};

// Mating Pet Card Component - Redesigned
const MatingPetCard = ({ pet, onViewDetails }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  
  const petImages = Array.isArray(pet.photosAndVideos) && pet.photosAndVideos.length > 0
    ? pet.photosAndVideos
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.3
      }}
      className="overflow-hidden rounded-xl shadow-md bg-gradient-to-b from-white to-purple-50 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        <div className="aspect-[4/3] cursor-zoom-in" onClick={() => setShowZoomedImage(true)}>
          {petImages.length > 0 ? (
            <img 
              src={petImages[0]} 
              alt={pet.breedName || "Mating Pet"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-purple-100 flex items-center justify-center">
              <FireIcon className="h-10 w-10 sm:h-12 sm:w-12 text-purple-300" />
            </div>
          )}
        </div>
        
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-1.5 sm:px-2.5 py-0.5 text-xs font-medium text-purple-800 border border-purple-200">
            Mating
          </span>
        </div>
        
        <AnimatePresence>
          {isHovering && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <button
                onClick={() => onViewDetails(pet, "mating")}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white text-purple-700 hover:bg-purple-50 transition-colors flex items-center space-x-1 sm:space-x-2 min-h-[36px] sm:min-h-[40px]"
                aria-label="View details for this mating pet"
              >
                <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">View Details</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
          {pet.breedName || "Premium Mating Pet"}
        </h3>
        
        <div className="mt-2 space-y-1 sm:space-y-1.5">
          {pet.petQuality && (
            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
              <StarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-amber-400" />
              <span>{pet.petQuality} Quality</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600 text-xs sm:text-sm">
            <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-gray-400" />
            <span>{pet.age} years old</span>
          </div>
          
          {pet.location && (
            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
              <MapPinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-gray-400" />
              <span>{pet.location}</span>
            </div>
          )}
        </div>
        
        {pet.breedLineage && (
          <div className="mt-2 sm:mt-3">
            <p className="text-xs line-clamp-2 text-gray-500">{pet.breedLineage}</p>
          </div>
        )}
        
        <div className="mt-3 sm:mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">Purchased</span>
          </div>
          
          <button
            onClick={() => onViewDetails(pet, "mating")}
            className="inline-flex items-center rounded-md bg-purple-50 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors min-h-[36px] sm:min-h-[40px]"
            aria-label="View details for this mating pet"
          >
            View Details
          </button>
        </div>
      </div>
      
      {/* Zoomable Image Modal */}
      {petImages.length > 0 && (
        <ZoomableImage
          src={petImages[0]}
          galleryImages={petImages}
          initialIndex={0}
          showZoomIcon={false}
          aspectRatio={false}
          className="hidden" // Hide the component, we just want to use its modal
          isModalOpen={showZoomedImage}
          onModalClose={() => setShowZoomedImage(false)}
        />
      )}
    </motion.div>
  );
};

export default function Payments() {
  const [adoptionPets, setAdoptionPets] = useState([]);
  const [matingPets, setMatingPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Add state for pet details modal
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetType, setSelectedPetType] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Add state for wishlist and payments
  const [wishlist, setWishlist] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // Add state for active tab
  const [activeTab, setActiveTab] = useState("all");

  // 1. Store userData from localStorage
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("user"));

    if (userdata && userdata.data) {
      setUserData(userdata.data);
      console.log("Logged in as", userdata.data);
    } else {
      console.log("No user found");
      setError("Please log in to view your payment history");
      setLoading(false);
    }
  }, []);

  // Fetch user's payments and purchased pets
  useEffect(() => {
    const fetchPaymentsAndPets = async () => {
      if (!userData?._id) return;

      try {
        setLoading(true);
        
        // Get payment data
        const paymentsResponse = await axios.get(
          `${config.baseURL}/api/payments/getallpayments/${userData._id}`
        );
        
        // Store payments IDs
        const paymentIds = paymentsResponse.data || [];
        setPayments(paymentIds);
        
        console.log("Payment IDs:", paymentIds);
        
        if (paymentIds.length === 0) {
          setLoading(false);
          return; // No payments to fetch
        }

        // Parallel fetching for both pet types
        const [adoptionResponse, matingResponse] = await Promise.all([
          // Try to fetch each pet from the regular pets collection
          Promise.all(
            paymentIds.map(petId => 
              axios.get(`${config.baseURL}/api/aboutpet/pet/${petId}`)
                .catch(() => ({ data: null })) // Catch errors for individual pets
            )
          ),
          // Try to fetch each pet from the mating pets collection
          Promise.all(
            paymentIds.map(petId => 
              axios.get(`${config.baseURL}/api/matingpets/pet/${petId}`)
                .catch(() => ({ data: null })) // Catch errors for individual pets
            )
          )
        ]);
        
        // Filter out successful responses and extract data
        const adoptionPetsData = adoptionResponse
          .filter(res => res.data)
          .map(res => res.data);
          
        const matingPetsData = matingResponse
          .filter(res => res.data)
          .map(res => res.data);
        
        console.log("Adoption pets:", adoptionPetsData.length);
        console.log("Mating pets:", matingPetsData.length);
        
        setAdoptionPets(adoptionPetsData);
        setMatingPets(matingPetsData);
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setError("Failed to fetch your payment history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentsAndPets();
  }, [userData]);

  // Handler for viewing pet details
  const handleViewDetails = (pet, petType) => {
    console.log("Viewing details for pet:", pet, "Type:", petType);
    setSelectedPet(pet);
    setSelectedPetType(petType);
    setIsDetailsModalOpen(true);
  };
  
  // Get displayed pets based on active tab
  const getDisplayedPets = () => {
    switch (activeTab) {
      case "adoption":
        return { pets: adoptionPets, type: "adoption" };
      case "mating":
        return { pets: matingPets, type: "mating" };
      case "all":
      default:
        return {
          pets: [
            ...adoptionPets.map(pet => ({ ...pet, type: "adoption" })),
            ...matingPets.map(pet => ({ ...pet, type: "mating" }))
          ],
          mixed: true
        };
    }
  };
  
  const displayedPetsInfo = getDisplayedPets();
  const displayedPets = displayedPetsInfo.pets;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="pb-4 sm:pb-5 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">View all your pet purchases and mating services</p>
        </div>
        
        {/* Stats Cards */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2">
          {/* Total Pets Purchased */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-4 sm:py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2 sm:p-3">
                  <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-4 sm:ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Pets Adopted</dt>
                    <dd>
                      <div className="text-base sm:text-lg font-medium text-gray-900">{adoptionPets.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mating Pets */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-4 sm:py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-2 sm:p-3">
                  <FireIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-4 sm:ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Mating Services</dt>
                    <dd>
                      <div className="text-base sm:text-lg font-medium text-gray-900">{matingPets.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="mt-4 sm:mt-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
            {["all", "adoption", "mating"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={classNames(
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm capitalize min-h-[44px]'
                )}
                aria-label={`View ${tab} pets`}
              >
                {tab === "all" ? "All Purchases" : `${tab} Pets`}
              </button>
            ))}
          </nav>
        </div>

        {/* Pet Cards */}
        <div className="mt-4 sm:mt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <p className="text-gray-500 text-sm sm:text-base">Loading payment history...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <p className="text-red-500 text-sm sm:text-base">{error}</p>
            </div>
          ) : displayedPets.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-48 sm:h-64">
              <p className="text-gray-500 text-base sm:text-lg mb-3 sm:mb-4 text-center">No purchases found in your payment history.</p>
              <a 
                href="/petshop" 
                className="text-indigo-600 hover:text-indigo-800 text-sm sm:text-base font-medium min-h-[44px] flex items-center"
              >
                Browse available pets
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedPets.map((pet) => {
                const petType = displayedPetsInfo.mixed ? pet.type : displayedPetsInfo.type;
                
                return petType === "mating" ? (
                  <MatingPetCard
                    key={pet._id}
                    pet={pet}
                    onViewDetails={handleViewDetails}
                  />
                ) : (
                  <PetCard
                    key={pet._id}
                    pet={pet}
                    onViewDetails={handleViewDetails}
                  />
                );
              })}
            </div>
          )}
        </div>
        
        {/* Pet Details Modal */}
        <PetDetailsModal
          pet={selectedPet}
          petType={selectedPetType}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          wishlist={wishlist}
          payments={payments}
          userId={userData?._id}
        />
      </div>
    </div>
  );
}
