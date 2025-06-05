import { useState, useEffect } from "react";
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Image Carousel Component for Pet Cards
const ImageCarousel = ({ images, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Limit to 4 images maximum
  const displayImages = images.slice(0, 4);

  const nextImage = (e) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    setCurrentIndex((prevIndex) =>
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index, e) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    setCurrentIndex(index);
  };

  if (!displayImages || displayImages.length === 0) {
    return (
      <div className={classNames(className, "bg-gray-200 flex items-center justify-center")}>
        <p className="text-gray-500">No Image</p>
      </div>
    );
  }

  return (
    <div className={classNames(className, "relative w-full overflow-hidden")}>
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
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all">
            <XMarkIcon className="h-4 w-4" style={{ transform: 'rotate(-45deg)', width: '1rem', height: '1rem' }} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all">
             <XMarkIcon className="h-4 w-4" style={{ transform: 'rotate(45deg)', width: '1rem', height: '1rem' }} />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white scale-125" : "bg-white/50"
                }`}
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
  
    useEffect(() => {
        setSelectedImage(images[0]);
    }, [images]);

    if (!images || images.length === 0) {
      return (
        <div className="aspect-square w-full bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No Images</p>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col gap-4">
        <div className="aspect-square w-full overflow-hidden rounded-xl">
          <img src={selectedImage} alt="Selected pet" className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={classNames(
                "aspect-square w-full rounded-lg overflow-hidden transition-all",
                selectedImage === image ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:opacity-80"
              )}
            >
              <img src={image} alt={`Pet thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    );
  };

// Pet Details Modal - Redesigned
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
  const isAvailable = pet.status === "Available";

  const sampleImages =
    pet.images && pet.images.length > 0
      ? pet.images
      : [
          pet.imageUrl,
          "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ];

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const resp = await axios.post(`${config.baseURL}/api/payments/create`, {
        amount: pet.price,
        currency: "INR",
        receipt: `rcpt_${pet._id.slice(-6)}_${Date.now().toString().slice(-6)}`,
        notes: "Pet adoption payment",
        userId: userId,
        petId: pet._id,
      });

      if (resp?.data?.success) {
        toast.success("Payment initiated! Complete it to unlock exclusive details.");
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
      <span className="text-gray-500">{text}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative mx-auto w-full max-w-6xl rounded-2xl bg-white shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button onClick={onClose} className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-4">
                <ModalImageGallery images={sampleImages} />
              </div>

              <div className="flex flex-col p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{pet.name}</h3>
                  <button className="flex items-center justify-center mx-auto bg-gray-100 hover:bg-gray-200 p-3 rounded-full">
                    <HeartIconSolid className={`h-6 w-6  transition-colors duration-200 ${isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"}`} />
                  </button>
                </div>
                <p className="text-lg text-gray-600 mb-4">{pet.breed}</p>

                <div className="flex items-center text-4xl font-bold text-gray-800 mb-6">
                  <CurrencyRupeeIcon className="h-8 w-8 mr-1" />{pet.price.toLocaleString('en-IN')}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mb-6 text-base">
                  <p><strong className="font-semibold text-gray-600">Age:</strong> {pet.age} years</p>
                  <p><strong className="font-semibold text-gray-600">Gender:</strong> {pet.gender}</p>
                  {pet.breedLineage && <p><strong className="font-semibold text-gray-600">Lineage:</strong> {pet.breedLineage}</p>}
                  {pet.height && <p><strong className="font-semibold text-gray-600">Height:</strong> {pet.height}</p>}
                  {pet.lifeSpan && <p><strong className="font-semibold text-gray-600">Lifespan:</strong> {pet.lifeSpan}</p>}
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">About {pet.name}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{pet.details || "No details available for this pet."}</p>
                </div>

                {pet.characteristics && (
                  <div className="mb-auto">
                    <h4 className="font-semibold text-gray-800 mb-2">Characteristics</h4>
                    <div className="flex flex-wrap gap-2">
                      {pet.characteristics.split(",").map((char) => (
                        <span key={char} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">{char.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  {paymentStatus ? (
                    <div className="bg-green-50/60 rounded-xl p-6 border border-green-200 space-y-5">
                      <h4 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <SparklesIcon className="h-6 w-6 text-green-600" />
                        Exclusive Details Unlocked
                      </h4>
                      
                      {/* Contact & Location */}
                      <div className="space-y-3">
                        {pet.breederName && <div className="flex items-start gap-3"><UserCircleIcon className="h-5 w-5 text-green-500 mt-0.5" /><span className="text-gray-700 text-sm"><strong className="text-gray-900 block">Breeder:</strong> {pet.breederName}</span></div>}
                        {pet.phoneNumber && <div className="flex items-start gap-3"><PhoneIcon className="h-5 w-5 text-green-500 mt-0.5" /><span className="text-gray-700 text-sm"><strong className="text-gray-900 block">Contact:</strong> {pet.phoneNumber}</span></div>}
                        {pet.location && <div className="flex items-start gap-3"><MapPinIcon className="h-5 w-5 text-green-500 mt-0.5" /><span className="text-gray-700 text-sm"><strong className="text-gray-900 block">Location:</strong> {pet.location}</span></div>}
                        {pet.shopAddress && <div className="flex items-start gap-3"><MapPinIcon className="h-5 w-5 text-green-500 mt-0.5" /><span className="text-gray-700 text-sm"><strong className="text-gray-900 block">Shop Address:</strong> {pet.shopAddress}</span></div>}
                      </div>

                      <div className="border-t border-green-200"></div>

                      {/* Health & Lineage */}
                      <div className="space-y-3">
                        {pet.vaccinationDetails && <div className="flex items-start gap-3"><ShieldCheckIcon className="h-5 w-5 text-green-500 mt-0.5" /><span className="text-gray-700 text-sm"><strong className="text-gray-900 block">Vaccination Details:</strong> {pet.vaccinationDetails}</span></div>}
                        {pet.vaccinationProof && <div className="flex items-center gap-3"><ShieldCheckIcon className="h-5 w-5 text-green-500" /><a href={pet.vaccinationProof} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline font-medium text-sm">View Vaccination Proof</a></div>}
                      </div>
                      
                      {/* Videos */}
                      {pet.videos?.length > 0 && (
                        <>
                          <div className="border-t border-green-200"></div>
                          <div className="space-y-2">
                            <h5 className="font-semibold text-gray-900 text-sm flex items-center gap-2"><VideoCameraIcon className="h-5 w-5 text-green-500" /> Videos</h5>
                            <div className="flex flex-wrap gap-2">
                              {pet.videos.map((video, idx) => (
                                <a href={video} key={idx} target="_blank" rel="noopener noreferrer" className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-300">Video {idx + 1}</a>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6 border">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <LockClosedIcon className="h-6 w-6 text-gray-500" />
                        Unlock Exclusive Details
                      </h4>
                       <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                        <LockedFeature icon={UserCircleIcon} text="Breeder's Name" />
                        <LockedFeature icon={PhoneIcon} text="Contact Number" />
                        <LockedFeature icon={MapPinIcon} text="Exact Location & Address" />
                        <LockedFeature icon={ShieldCheckIcon} text="Vaccination Details & Proof" />
                        <LockedFeature icon={VideoCameraIcon} text="Exclusive Videos" />
                      </div>
                      <button onClick={handlePayment} className={classNames("w-full text-white font-bold py-3 px-4 rounded-lg transition-transform text-base shadow-lg hover:shadow-xl", isAvailable ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-0.5" : "bg-gray-400 cursor-not-allowed")} disabled={isLoading || !isAvailable}>
                        {isLoading ? "Processing..." : !isAvailable ? "Pet is Unavailable" : "Pay to Unlock"}
                      </button>
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
  const isAvailable = pet.status === "Available";
  const sampleImages = pet.images && pet.images.length > 0 ? pet.images : [pet.imageUrl].filter(Boolean);

  return (
    <div
      onClick={isAvailable ? () => onViewDetails(pet) : (e) => e.preventDefault()}
      className={classNames(
        "group relative rounded-2xl overflow-hidden shadow-lg border border-gray-200/80 transition-all duration-300 bg-white",
        isAvailable ? "hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer" : "opacity-60 grayscale"
      )}
    >
      <div className="relative">
        <ImageCarousel images={sampleImages} className="h-72" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
          <h3 className="text-xl font-bold text-white leading-tight">{pet.name}</h3>
          <p className="text-sm text-white/90">{pet.breed}</p>
        </div>
      </div>

      <div className="p-4 flex justify-between items-center">
        <div>
          <p className="text-xl font-bold text-gray-800">₹{pet.price.toLocaleString('en-IN')}</p>
          <span className={classNames(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mt-1",
              isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          )}>
            {isAvailable ? "Available" : "Sold"}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAddToWishlist(pet._id); }}
          className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:text-red-500 transition-all duration-300 hover:bg-red-50"
          aria-label="Add to wishlist"
        >
          <HeartIconSolid className={`h-6 w-6 ${isWishlisted ? "text-red-500" : ""}`} />
        </button>
      </div>
    </div>
  );
};

export default function PetStore() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);

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

  // Fetch user's wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userData?._id) return; // Make sure we wait for the user ID

      try {
        const response = await axios.get(
          `${config.baseURL}/api/user/getallwishlist/${userData._id}`
        );
        const wishlistPetIds = response.data.filter(id => id); // Filter out null/undefined IDs
        setWishlist(wishlistPetIds);

        if (wishlistPetIds.length > 0) {
            const petDetailsPromises = wishlistPetIds.map((petId) =>
            axios.get(`${config.baseURL}/api/aboutpet/pet/${petId}`)
            );
            const petDetailsResponses = await Promise.all(petDetailsPromises);
            const petDetails = petDetailsResponses.map((res) => res.data);
            setPets(petDetails);
        } else {
            setPets([]);
        }

        const resp = await axios.get(
          `${config.baseURL}/api/payments/getallpayments/${userData._id}`
        );
        setPayments(resp.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load your wishlist. Please try again later.");
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

  return (
    <div className="bg-white">
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

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
              Your Wishlist
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              The special pets you've saved. Click a pet to see more details, or click the heart to remove it.
            </p>
          </div>

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
              <div className="text-center py-24">
                <HeartIconSolid className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-xl font-medium text-gray-900">Your wishlist is empty</h3>
                <p className="mt-1 text-gray-500">Find a pet you love and save it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pets.map((pet) => (
                  <PetCard
                    key={pet._id}
                    pet={pet}
                    onViewDetails={handleViewDetails}
                    onAddToWishlist={handleAddToWishlist}
                    wishlist={wishlist}
                  />
                ))}
              </div>
            )}
            
            {selectedPet && <PetDetailsModal
              pet={selectedPet}
              isOpen={isDetailsModalOpen}
              onClose={() => setIsDetailsModalOpen(false)}
              wishlist={wishlist}
              payments={payments}
              userId={userData._id}
            />}
          </section>
        </main>
      </div>
    </div>
  );
}
