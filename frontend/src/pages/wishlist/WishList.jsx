import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  XMarkIcon,
  PhoneIcon,
  MapPinIcon,
  UserCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  SparklesIcon,
  LockClosedIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import config from "../../config";
import toast from "react-hot-toast";
import ZoomableImage from "../../components/ZoomableImage";
import { motion, AnimatePresence } from "framer-motion";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "anticipate" } },
  out: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
};

const modalPanelVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30, duration: 0.4 } },
  exit: { opacity: 0, scale: 0.9, y: 30, transition: { duration: 0.2 } },
};

// Image Carousel Component for Pet Cards with touch support
const ImageCarousel = ({ images, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Ensure images is an array and handle empty cases
  const displayImages = Array.isArray(images) && images.length > 0 
    ? images.slice(0, 4) // Limit to 4 images maximum
    : [];

  const paginate = (newDirection) => {
    let newIndex = currentIndex + newDirection;
    if (newIndex < 0) {
      newIndex = displayImages.length - 1;
    } else if (newIndex >= displayImages.length) {
      newIndex = 0;
    }
    setCurrentIndex(newIndex);
  };

  const nextImage = (e) => {
    e?.stopPropagation(); // Prevent event bubbling to parent elements
    paginate(1);
  };

  const prevImage = (e) => {
    e?.stopPropagation(); // Prevent event bubbling to parent elements
    paginate(-1);
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
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe left, go to next image
        nextImage(e);
      } else {
        // Swipe right, go to previous image
        prevImage(e);
      }
    }
  };

  if (displayImages.length === 0) {
    return (
      <div className={classNames(className, "bg-gray-200 flex items-center justify-center")}>
        <p className="text-gray-500 text-sm sm:text-base">No Image</p>
      </div>
    );
  }

  return (
    <div 
      className={classNames(className, "relative w-full overflow-hidden group")}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={displayImages[currentIndex]}
          alt={`Pet image ${currentIndex + 1}`}
          className="absolute w-full h-full object-cover"
          initial={{ opacity: 0.5, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.5, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
        />
      </AnimatePresence>

      {displayImages.length > 1 && (
        <>
          <motion.button
            onClick={prevImage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110 hidden sm:block"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.button
            onClick={nextImage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110 hidden sm:block"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                className={`w-2 h-2 rounded-full transition-all transform ${
                  index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ModalImageGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [showZoomedImage, setShowZoomedImage] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const imageIndex = images.indexOf(selectedImage);
  
    useEffect(() => {
        setSelectedImage(images[0]);
    }, [images]);

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
      const swipeDistance = touchStartX.current - touchEndX.current;
      
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0 && imageIndex < images.length - 1) {
          // Swipe left, go to next image
          setSelectedImage(images[imageIndex + 1]);
        } else if (swipeDistance < 0 && imageIndex > 0) {
          // Swipe right, go to previous image
          setSelectedImage(images[imageIndex - 1]);
        }
      } else {
        // It's a tap, open zoom view
        handleImageClick(e);
      }
    };
    
    const handleImageClick = (e) => {
      e?.stopPropagation();
      setShowZoomedImage(true);
    };

    if (!images || images.length === 0) {
      return (
        <div className="aspect-square w-full bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-sm sm:text-base">No Images</p>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col gap-3 sm:gap-4">
        <div 
          className="aspect-square w-full overflow-hidden rounded-xl cursor-zoom-in"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleImageClick}
        >
          <img src={selectedImage} alt="Selected pet" className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {images.slice(0, 5).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={classNames(
                "aspect-square w-full rounded-lg overflow-hidden transition-all min-h-[44px]",
                selectedImage === image ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:opacity-80"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt={`Pet thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        
        {/* Zoomable Image Gallery Modal */}
        <ZoomableImage
          src={selectedImage}
          galleryImages={images}
          initialIndex={imageIndex}
          showZoomIcon={false}
          aspectRatio={false}
          className="hidden" // Hide the component, we just want to use its modal
          isModalOpen={showZoomedImage}
          onModalClose={() => setShowZoomedImage(false)}
        />
      </div>
    );
  };

// Pet Details Modal - Redesigned with mobile responsiveness
const PetDetailsModal = ({
  pet,
  isOpen,
  onClose,
  wishlist,
  userId,
  payments,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!pet) return null;

  const isWishlisted = wishlist.includes(pet._id);
  const paymentStatus = payments.includes(pet._id);
  const isAvailable = pet.status === "Available" || pet.status === "available";
  const isMatingPet = pet.petType === "mating";
  
  // Handle different image field names between models
  const petImages = isMatingPet
    ? (pet.photosAndVideos || []).filter(Boolean)
    : (pet.images && pet.images.length > 0
      ? pet.images
      : [pet.imageUrl].filter(Boolean));

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Different payment endpoint based on pet type
      const endpoint = `${config.baseURL}/api/payments/create`;

      const resp = await axios.post(endpoint, {
        amount: pet.price || 2500, // Default price for mating pets if not specified
        currency: "INR",
        receipt: `rcpt_${pet._id.slice(-6)}_${Date.now().toString().slice(-6)}`,
        notes: isMatingPet ? "Mating service payment" : "Pet adoption payment",
        userId: userId,
        petId: pet._id,
        serviceType: isMatingPet ? "mating" : "adoption"
      });

      if (resp?.data?.success) {
        toast.success(isMatingPet 
          ? "Payment initiated! Complete it to contact the breeder." 
          : "Payment initiated! Complete it to unlock exclusive details."
        );
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Oops! Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const LockedFeature = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-gray-400" />
      <span className="text-xs sm:text-sm text-gray-500">{text}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <motion.div
        as={DialogBackdrop}
        variants={modalBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
          <DialogPanel
            as={motion.div}
            variants={modalPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative mx-auto w-full max-w-6xl rounded-2xl bg-white shadow-2xl"
          >
            {/* Pet Type Badge */}
            {isMatingPet && (
              <div className="absolute top-4 left-4 z-10 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Mating Pet
              </div>
            )}
            
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                aria-label="Close dialog"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-3 sm:p-4">
                <ModalImageGallery images={petImages} />
              </div>

              <div className="flex flex-col p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                    {isMatingPet 
                      ? `${pet.breed || pet.breedName}` 
                      : pet.name}
                  </h3>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center mx-auto bg-gray-100 hover:bg-gray-200 p-3 rounded-full"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <HeartIconSolid className={`h-6 w-6 transition-colors duration-200 ${isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"}`} />
                  </motion.button>
                </div>
                
                {!isMatingPet && (
                  <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">{pet.breed}</p>
                )}

                {/* Only show price for regular pets */}
                {!isMatingPet && (
                  <div className="flex items-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                    <CurrencyRupeeIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-1" />
                    {typeof pet.price === 'number' ? pet.price.toLocaleString('en-IN') : pet.price}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
                  <p><strong className="font-semibold text-gray-600">Age:</strong> {pet.age} {isMatingPet ? 'years' : ''}</p>
                  <p><strong className="font-semibold text-gray-600">Gender:</strong> {pet.gender}</p>
                  {(pet.breedLineage || (isMatingPet && pet.breed)) && <p><strong className="font-semibold text-gray-600">Lineage:</strong> {pet.breedLineage || pet.breed}</p>}
                  {pet.height && <p><strong className="font-semibold text-gray-600">Height:</strong> {pet.height}</p>}
                  {pet.lifeSpan && <p><strong className="font-semibold text-gray-600">Lifespan:</strong> {pet.lifeSpan}</p>}
                  {pet.petQuality && <p><strong className="font-semibold text-gray-600">Quality:</strong> {pet.petQuality}</p>}
                  {pet.location && <p><strong className="font-semibold text-gray-600">Location:</strong> {pet.location}</p>}
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2">About {isMatingPet ? "This Pet" : pet.name}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{isMatingPet ? pet.breedLineage : pet.details || "No details available for this pet."}</p>
                </div>

                {pet.characteristics && !isMatingPet && (
                  <div className="mb-auto">
                    <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2">Characteristics</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {typeof pet.characteristics === 'string' ? 
                        pet.characteristics.split(",").map((char) => (
                          <span key={char} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 sm:px-2.5 sm:py-1 rounded-full">{char.trim()}</span>
                        )) :
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 sm:px-2.5 sm:py-1 rounded-full">
                          {isMatingPet ? 'Mating Service' : 'Pet'}
                        </span>
                      }
                    </div>
                  </div>
                )}
                
                <div className="mt-4 sm:mt-8">
                  {paymentStatus ? (
                    <div className={`rounded-xl p-4 sm:p-6 border space-y-3 sm:space-y-5 ${
                      isMatingPet ? 'bg-purple-50/60 border-purple-200' : 'bg-green-50/60 border-green-200'
                    }`}>
                      <h4 className={`text-base sm:text-lg font-semibold flex items-center gap-2 ${
                        isMatingPet ? 'text-purple-800' : 'text-green-800'
                      }`}>
                        <SparklesIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${isMatingPet ? 'text-purple-600' : 'text-green-600'}`} />
                        {isMatingPet ? 'Breeder Contact Information' : 'Exclusive Details Unlocked'}
                      </h4>
                      
                      {/* Contact & Location */}
                      <div className="space-y-3">
                        {(pet.breederName || pet.vendorName) && 
                          <div className="flex items-start gap-3">
                            <UserCircleIcon className={`h-5 w-5 mt-0.5 ${isMatingPet ? 'text-purple-500' : 'text-green-500'}`} />
                            <span className="text-gray-700 text-xs sm:text-sm">
                              <strong className="text-gray-900 block">{isMatingPet ? 'Breeder' : 'Vendor'}:</strong> 
                              {pet.breederName || pet.vendorName}
                            </span>
                          </div>
                        }
                        
                        {(pet.phoneNumber || pet.phoneNum) && 
                          <div className="flex items-start gap-3">
                            <PhoneIcon className={`h-5 w-5 mt-0.5 ${isMatingPet ? 'text-purple-500' : 'text-green-500'}`} />
                            <span className="text-gray-700 text-xs sm:text-sm">
                              <strong className="text-gray-900 block">Contact:</strong> 
                              {pet.phoneNumber || pet.phoneNum}
                            </span>
                          </div>
                        }
                        
                        {pet.location && 
                          <div className="flex items-start gap-3">
                            <MapPinIcon className={`h-5 w-5 mt-0.5 ${isMatingPet ? 'text-purple-500' : 'text-green-500'}`} />
                            <span className="text-gray-700 text-xs sm:text-sm">
                              <strong className="text-gray-900 block">Location:</strong> 
                              {pet.location}
                            </span>
                          </div>
                        }
                        
                        {pet.shopAddress && 
                          <div className="flex items-start gap-3">
                            <MapPinIcon className={`h-5 w-5 mt-0.5 ${isMatingPet ? 'text-purple-500' : 'text-green-500'}`} />
                            <span className="text-gray-700 text-xs sm:text-sm">
                              <strong className="text-gray-900 block">Shop Address:</strong> 
                              {pet.shopAddress}
                            </span>
                          </div>
                        }
                      </div>

                      <div className={`border-t ${isMatingPet ? 'border-purple-200' : 'border-green-200'}`}></div>

                      {/* Health & Lineage */}
                      <div className="space-y-3">
                        {pet.vaccinationDetails && 
                          <div className="flex items-start gap-3">
                            <ShieldCheckIcon className={`h-5 w-5 mt-0.5 ${isMatingPet ? 'text-purple-500' : 'text-green-500'}`} />
                            <span className="text-gray-700 text-xs sm:text-sm">
                              <strong className="text-gray-900 block">Vaccination Details:</strong> 
                              {pet.vaccinationDetails}
                            </span>
                          </div>
                        }
                        
                        {pet.vaccinationProof && 
                          <div className="flex items-center gap-3">
                            <ShieldCheckIcon className={`h-5 w-5 ${isMatingPet ? 'text-purple-500' : 'text-green-500'}`} />
                            <a 
                              href={pet.vaccinationProof} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`hover:underline font-medium text-xs sm:text-sm ${isMatingPet ? 'text-purple-700' : 'text-green-700'}`}
                            >
                              View Vaccination Proof
                            </a>
                          </div>
                        }
                      </div>
                      
                      {/* Videos */}
                      {(pet.videos?.length > 0 || pet.beforeMatingVideos?.length > 0) && (
                        <>
                          <div className={`border-t ${isMatingPet ? 'border-purple-200' : 'border-green-200'}`}></div>
                          <div className="space-y-2">
                            <h5 className="font-semibold text-gray-900 text-xs sm:text-sm flex items-center gap-2">
                              <VideoCameraIcon className={`h-5 w-5 ${isMatingPet ? 'text-purple-500' : 'text-green-500'}`} /> 
                              {isMatingPet ? 'Mating Videos' : 'Pet Videos'}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {(pet.videos || pet.beforeMatingVideos || []).map((video, idx) => (
                                <a 
                                  href={video} 
                                  key={idx} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className={`px-3 py-1 rounded-full text-xs font-semibold hover:opacity-80 min-h-[36px] min-w-[44px] flex items-center justify-center ${
                                    isMatingPet 
                                      ? 'bg-purple-200 text-purple-800 hover:bg-purple-300' 
                                      : 'bg-green-200 text-green-800 hover:bg-green-300'
                                  }`}
                                >
                                  Video {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3 sm:mb-4">
                        <LockClosedIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                        {isMatingPet ? 'Contact Breeder' : 'Unlock Exclusive Details'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mb-4 sm:mb-6">
                        <LockedFeature icon={UserCircleIcon} text={isMatingPet ? "Breeder's Name" : "Owner's Name"} />
                        <LockedFeature icon={PhoneIcon} text="Contact Number" />
                        <LockedFeature icon={MapPinIcon} text="Exact Location & Address" />
                        <LockedFeature icon={ShieldCheckIcon} text="Vaccination Details & Proof" />
                        <LockedFeature icon={VideoCameraIcon} text={isMatingPet ? "Mating Videos" : "Pet Videos"} />
                      </div>
                      <motion.button 
                        onClick={handlePayment} 
                        whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
                        whileTap={{ scale: 0.98 }}
                        className={classNames(
                          "w-full text-white font-bold py-3 px-4 rounded-lg transition-transform text-sm sm:text-base shadow-lg min-h-[44px]", 
                          isAvailable 
                            ? isMatingPet 
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600" 
                              : "bg-gradient-to-r from-blue-600 to-indigo-600" 
                            : "bg-gray-400 cursor-not-allowed"
                        )} 
                        disabled={isLoading || !isAvailable}
                      >
                        {isLoading 
                          ? "Processing..." 
                          : !isAvailable 
                            ? "Pet is Unavailable" 
                            : isMatingPet 
                              ? "Pay to Contact Breeder" 
                              : "Pay to Unlock Pet Details"
                        }
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

// Pet Card Component with Limited Information
const PetCard = ({ pet, onAddToWishlist, onViewDetails, wishlist }) => {
  const isWishlisted = wishlist.includes(pet._id);
  const isAvailable = pet.status === "Available" || pet.status === "available";
  const isMatingPet = pet.petType === "mating";
  
  const sampleImages = pet.images && pet.images.length > 0 
    ? pet.images 
    : [pet.imageUrl].filter(Boolean);

  return (
    <motion.div
      variants={cardVariants}
      layout
      onClick={isAvailable ? () => onViewDetails(pet) : (e) => e.preventDefault()}
      whileHover={isAvailable ? { y: -6, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={classNames(
        "group relative rounded-2xl overflow-hidden shadow-lg border bg-white",
        isMatingPet ? "border-purple-200" : "border-gray-200/80",
        isAvailable ? "cursor-pointer" : "opacity-60 grayscale"
      )}
    >
      {/* Pet Type Badge */}
      <div className={`absolute top-3 left-3 z-10 px-3 py-1 text-xs font-bold rounded-full ${
        isMatingPet 
          ? "bg-purple-600 text-white" 
          : "bg-indigo-600 text-white opacity-0"
      }`}>
        {isMatingPet ? "Mating" : "Adoption"}
      </div>
      
      <div className="relative">
        <ImageCarousel images={sampleImages} className="h-56 sm:h-64 md:h-72" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
            {isMatingPet ? `${pet.breed || pet.breedName} (Mating)` : pet.name}
          </h3>
          <p className="text-xs sm:text-sm text-white/90">
            {isMatingPet 
              ? `${pet.gender}, ${pet.age} years${pet.petQuality ? `, ${pet.petQuality}` : ''}` 
              : pet.breed}
          </p>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex justify-between items-center">
        <div>
          {/* Only show price for regular pets */}
          {!isMatingPet && (
            <p className="text-lg sm:text-xl font-bold text-gray-800">
              ₹{typeof pet.price === 'number' ? pet.price.toLocaleString('en-IN') : pet.price}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
            {/* Status badge */}
            <span className={classNames(
              "inline-flex items-center rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold",
              isAvailable ? 
                (isMatingPet ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800") : 
                "bg-gray-100 text-gray-800"
            )}>
              {isAvailable ? (isMatingPet ? "Available for Mating" : "Available") : "Unavailable"}
            </span>
            
            {/* Pet location badge */}
            {pet.location && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-blue-50 text-blue-700">
                {pet.location}
              </span>
            )}
            
            {/* PetQuality badge for mating pets */}
            {isMatingPet && pet.petQuality && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-purple-50 text-purple-700">
                {pet.petQuality}
              </span>
            )}
          </div>
        </div>
        
        <motion.button
          onClick={(e) => { e.stopPropagation(); onAddToWishlist(pet._id); }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9, rotate: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${
            isWishlisted 
              ? "bg-red-50 text-red-500" 
              : "bg-gray-100 text-gray-600 hover:text-red-500 hover:bg-red-50"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIconSolid className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function PetStore() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);
  const [sortOption, setSortOption] = useState("all"); // "all", "adoption", "mating"
  
  // Add state for pet details modal
  const [selectedPet, setSelectedPet] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Add state for wishlist
  const [wishlist, setWishlist] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // 1. Store userData from localStorage
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("user"));

    if (userdata && userdata.data) {
      setUserData(userdata.data); // setUserData is async 💕
    } else {
      console.log("No user found");
    }
  }, []);

  // Filtered pets based on sort option
  const filteredPets = useMemo(() => {
    if (sortOption === "all") return pets;
    if (sortOption === "adoption") return pets.filter(p => p.petType !== "mating");
    if (sortOption === "mating") return pets.filter(p => p.petType === "mating");
    return pets;
  }, [pets, sortOption]);

  // Fetch user's wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userData?._id) return; // Make sure we wait for the user ID

      try {
        setLoading(true);
        // Fetch wishlist IDs
        const response = await axios.get(
          `${config.baseURL}/api/user/getallwishlist/${userData._id}`
        );
        const wishlistPetIds = response.data.filter(id => id); // Filter out null/undefined IDs
        setWishlist(wishlistPetIds);

        if (wishlistPetIds.length > 0) {
          // Create an array to store pet details
          const petDetails = [];
          
          // Process each pet ID one by one to avoid failing the entire batch if one fails
          for (const petId of wishlistPetIds) {
            try {
              // First check if pet exists and what type it is
              const existsRes = await axios.get(`${config.baseURL}/api/user/checkPetExists/${petId}`);
              
              if (existsRes.data.exists) {
                // Fetch pet details based on model type
                if (existsRes.data.modelType === "AboutPet") {
                  // Regular pet
                  const res = await axios.get(`${config.baseURL}/api/aboutpet/pet/${petId}`);
                  if (res.data) {
                    // Add a type identifier
                    petDetails.push({
                      ...res.data,
                      petType: "regular"
                    });
                  }
                } else if (existsRes.data.modelType === "MatingPet") {
                  // Mating pet - fetch from mating pets API
                  try {
                    const matingRes = await axios.get(`${config.baseURL}/api/matingpets/pet/${petId}`);
                    if (matingRes.data) {
                      // Format mating pet data to match structure expected by PetCard
                      const formattedMatingPet = {
                        _id: matingRes.data._id,
                        name: matingRes.data.breedName || "Mating Pet",
                        breed: matingRes.data.breedName,
                        breedName: matingRes.data.breedName,
                        images: matingRes.data.photosAndVideos || [],
                        photosAndVideos: matingRes.data.photosAndVideos || [],
                        price: matingRes.data.price || 0,
                        petQuality: matingRes.data.petQuality,
                        age: matingRes.data.age,
                        gender: matingRes.data.gender,
                        status: matingRes.data.availability === "available" ? "Available" : "Unavailable",
                        availability: matingRes.data.availability,
                        petType: "mating", // Add type identifier
                        details: matingRes.data.breedLineage || "",
                        breedLineage: matingRes.data.breedLineage || "",
                        location: matingRes.data.location,
                        phoneNum: matingRes.data.phoneNum,
                        breederName: matingRes.data.breederName,
                        shopAddress: matingRes.data.shopAddress,
                        vaccinationDetails: matingRes.data.vaccinationDetails,
                        vaccinationProof: matingRes.data.vaccinationProof,
                        beforeMatingVideos: matingRes.data.beforeMatingVideos || []
                      };
                      petDetails.push(formattedMatingPet);
                    }
                  } catch (matingErr) {
                    console.log(`Error fetching mating pet ${petId}:`, matingErr.message);
                  }
                }
              } else {
                console.log(`Pet with ID ${petId} no longer exists in any model`);
              }
            } catch (err) {
              console.log(`Error processing pet ID ${petId}:`, err.message);
            }
          }
          
          setPets(petDetails);
        } else {
          setPets([]);
        }

        try {
          // Fetch payment information
          const paymentResp = await axios.get(
            `${config.baseURL}/api/payments/getallpayments/${userData._id}`
          );
          setPayments(paymentResp.data);
        } catch (paymentErr) {
          console.error("Error fetching payment data:", paymentErr);
          setPayments([]);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load your wishlist. Please try again later.");
        setPets([]);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userData]);

  const handleAddToWishlist = async (petId) => {
    try {
      const userId = userData._id;
      // Optimistically remove from UI
      setPets(prevPets => prevPets.filter(p => p._id !== petId));
      setWishlist(prev => prev.filter(id => id !== petId));

      await axios.put(`${config.baseURL}/api/user/updatewishlist`, {
        userId,
        wishListId: petId,
      });

      toast.success("Removed from Wishlist!");
    } catch (err) {
      console.error("Error updating wishlist:", err);
      // Revert UI on failure
      // (This would require re-fetching the original state, so for now we just show an error)
      toast.error("Failed to update wishlist. Please refresh.");
      if (err.response?.status === 401) {
        alert("Please log in to update your wishlist.");
      }
    }
  };

  // Handler for viewing pet details
  const handleViewDetails = (pet) => {
    setSelectedPet(pet);
    setIsDetailsModalOpen(true);
  };

  // Pet counts
  const matingPetsCount = useMemo(() => pets.filter(p => p.petType === "mating").length, [pets]);
  const regularPetsCount = useMemo(() => pets.filter(p => p.petType !== "mating").length, [pets]);

  return (
    <motion.div className="bg-white" variants={pageVariants} initial="initial" animate="in" exit="out">
      <div>
        {/* Mobile filter dialog - can be removed if not needed */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />
          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400">
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
              Your Wishlist
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-gray-500">
              Your collection of saved pets for adoption and mating services.
            </motion.p>
            
            {!loading && pets.length > 0 && (
              <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-4">
                <span className="text-xs sm:text-sm text-gray-500">
                  {regularPetsCount} pets for adoption • {matingPetsCount} mating pets
                </span>
              </div>
            )}
          </div>
          
          {!loading && pets.length > 0 && (
            <div className="mb-6 sm:mb-8 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex rounded-md shadow-sm" role="group">
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSortOption("all")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                    sortOption === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-200 rounded-l-lg`}
                >
                  All Pets
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSortOption("adoption")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                    sortOption === "adoption"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border-t border-b border-gray-200`}
                >
                  Adoption
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSortOption("mating")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                    sortOption === "mating"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-200 rounded-r-lg`}
                >
                  Mating
                </motion.button>
              </motion.div>
            </div>
          )}

          <section aria-labelledby="products-heading">
            <h2 id="products-heading" className="sr-only">
              Wishlist Pets
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading your wishlist...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
              </div>
            ) : pets.length === 0 ? (
              <div className="text-center py-16 sm:py-24">
                <HeartIconSolid className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                <h3 className="mt-2 text-lg sm:text-xl font-medium text-gray-900">Your wishlist is empty</h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">Find a pet you love and save it here.</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                variants={gridVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredPets.map((pet) => (
                  <PetCard
                    key={pet._id}
                    pet={pet}
                    onViewDetails={handleViewDetails}
                    onAddToWishlist={handleAddToWishlist}
                    wishlist={wishlist}
                  />
                ))}
              </motion.div>
            )}
            
            <AnimatePresence>
              {selectedPet && isDetailsModalOpen && (
                <PetDetailsModal
                  key={selectedPet._id}
                  pet={selectedPet}
                  isOpen={isDetailsModalOpen}
                  onClose={() => setIsDetailsModalOpen(false)}
                  wishlist={wishlist}
                  payments={payments}
                  userId={userData._id}
                />
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>
    </motion.div>
  );
}
