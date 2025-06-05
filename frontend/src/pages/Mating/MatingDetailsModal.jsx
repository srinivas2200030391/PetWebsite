import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import config from "../../config";
import { motion } from "framer-motion";
import ImageCarousel from "../petshop/ImageCarousel";
import PropTypes from "prop-types";

const backdropAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const modalAnimation = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      scale: { type: "spring", bounce: 0.5 },
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};

const MatingDetailsModal = ({
  pet,
  isOpen,
  onClose,
  wishlist,
  userId,
  onAddToWishlist,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  if (!pet) return null;
  const isWishlisted = wishlist.includes(pet._id);
  
  // Images for carousel
  const imagesForCarousel = Array.isArray(pet.photosAndVideos) && pet.photosAndVideos.length > 0
    ? pet.photosAndVideos
    : [];

  const handleContactRequest = async () => {
    if (!userId) {
      toast.error("Please log in to contact the breeder");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This is a placeholder for any API call you might want to make
      // to record the contact request or notify the breeder
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setContactVisible(true);
      toast.success("Contact information revealed!");
    } catch (err) {
      toast.error("Could not process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 ">
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="exit">
        <DialogBackdrop className="fixed inset-0 bg-slate-900/40" />
      </motion.div>

      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/10 bg-opacity-50 backdrop-blur-sm">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.95 },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-4xl">
            <DialogPanel className="mx-auto rounded-lg bg-white shadow-xl overflow-hidden">
              {/* Header section with gradient background */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <div className="flex justify-between items-center">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-semibold text-white">
                    Mating Pet Profile
                  </motion.h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors">
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {/* Left column: Image carousel */}
                <div className="md:col-span-1 p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}>
                    {/* Added a wrapper for aspect ratio */}
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gray-100">
                      <ImageCarousel images={imagesForCarousel} />
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <h2 className="mt-8 text-xl font-bold text-gray-900">
                          {pet.breedName || "Unknown Breed"}
                        </h2>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Middle column: Pet details */}
                <div className="md:col-span-1 p-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
                      Pet Information
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Breed
                        </h5>
                        <p className="text-sm font-medium">{pet.breedName}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Age
                        </h5>
                        <p className="text-sm font-medium">
                          {pet.age} years
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Gender
                        </h5>
                        <p className="text-sm font-medium">{pet.gender}</p>
                      </div>
                      {pet.petQuality && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">
                            Quality
                          </h5>
                          <p className="text-sm font-medium">{pet.petQuality}</p>
                        </div>
                      )}
                      {pet.location && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">
                            Location
                          </h5>
                          <p className="text-sm font-medium">{pet.location}</p>
                        </div>
                      )}
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Status
                        </h5>
                        <p className="text-sm font-medium">{pet.availability === "available" ? "Available" : "Unavailable"}</p>
                      </div>
                    </div>

                    {pet.breedLineage && (
                      <div className="pt-4">
                        <h5 className="text-sm font-medium text-gray-500 mb-1">
                          Breed Lineage
                        </h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {pet.breedLineage}
                        </p>
                      </div>
                    )}

                    {pet.vaccinationDetails && (
                      <div className="pt-4">
                        <h5 className="text-sm font-medium text-gray-500 mb-1">
                          Vaccination Details
                        </h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {pet.vaccinationDetails}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Right column: Contact information */}
                <div className="md:col-span-1 p-6 bg-gray-50">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}>
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <span className="text-indigo-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                            Breeder Information
                          </h4>
                          
                          {contactVisible ? (
                            <div className="mt-4 space-y-3">
                              {pet.breederName && (
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500">Breeder Name</h5>
                                  <p className="text-sm font-medium">{pet.breederName}</p>
                                </div>
                              )}
                              {pet.phoneNum && (
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500">Phone Number</h5>
                                  <p className="text-sm font-medium">{pet.phoneNum}</p>
                                </div>
                              )}
                              {pet.shopAddress && (
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500">Address</h5>
                                  <p className="text-sm font-medium">{pet.shopAddress}</p>
                                </div>
                              )}
                              {pet.vendor?.vendorShopName && (
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500">Shop Name</h5>
                                  <p className="text-sm font-medium">{pet.vendor.vendorShopName}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-600 mt-2">
                                Contact the breeder for more information about this mating pet:
                              </p>
                              <ul className="mt-3 space-y-2">
                                <li className="flex items-center text-sm text-gray-600">
                                  <svg
                                    className="h-4 w-4 text-green-500 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Breeder contact information
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                  <svg
                                    className="h-4 w-4 text-green-500 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Shop address and location
                                </li>
                              </ul>
                            </>
                          )}
                        </div>

                        {pet.vaccinationProof && pet.vaccinationProof.length > 0 && (
                          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                            <h4 className="font-medium text-gray-900 mb-2">Vaccination Proof</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {pet.vaccinationProof.map((proofUrl, index) => (
                                <a 
                                  key={index} 
                                  href={proofUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block rounded overflow-hidden border border-gray-200"
                                >
                                  <img 
                                    src={proofUrl} 
                                    alt={`Vaccination proof ${index + 1}`} 
                                    className="w-full h-auto object-cover"
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {!contactVisible && (
                          <button
                            onClick={handleContactRequest}
                            disabled={isLoading}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2">
                            {isLoading ? (
                              <>
                                <svg
                                  className="animate-spin h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processing</span>
                              </>
                            ) : (
                              "Show Contact Info"
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => onAddToWishlist(pet._id)}
                          className={`${contactVisible ? 'flex-1' : ''} border py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                            isWishlisted
                              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}>
                          <HeartIcon
                            className={`h-5 w-5 ${
                              isWishlisted ? "fill-red-500 stroke-red-500" : ""
                            }`}
                          />
                          <span>
                            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </DialogPanel>
          </motion.div>
        </div>
      </div>
    </Dialog>
  );
};

MatingDetailsModal.propTypes = {
  pet: PropTypes.shape({
    _id: PropTypes.string,
    breedName: PropTypes.string,
    breedLineage: PropTypes.string,
    photosAndVideos: PropTypes.arrayOf(PropTypes.string),
    beforeMatingVideos: PropTypes.arrayOf(PropTypes.string),
    vaccinationProof: PropTypes.arrayOf(PropTypes.string),
    petQuality: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.string,
    availability: PropTypes.string,
    location: PropTypes.string,
    breederName: PropTypes.string,
    phoneNum: PropTypes.string,
    shopAddress: PropTypes.string,
    vendor: PropTypes.object,
    vaccinationDetails: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  wishlist: PropTypes.arrayOf(PropTypes.string),
  userId: PropTypes.string,
  onAddToWishlist: PropTypes.func.isRequired,
};

export default MatingDetailsModal; 