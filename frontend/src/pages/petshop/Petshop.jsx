import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  HeartIcon,
} from "@heroicons/react/20/solid";
import config from "../../config";

// Updated sort options with multiple sorting criteria
const sortOptions = [
  { name: "Most Popular", value: "popularity", current: true },
  { name: "Price: Low to High", value: "price_asc", current: false },
  { name: "Price: High to Low", value: "price_desc", current: false },
  { name: "Age: Youngest First", value: "age_asc", current: false },
  { name: "Age: Oldest First", value: "age_desc", current: false },
  { name: "Newest Arrivals", value: "arrival", current: false },
];

const subCategories = [
  { name: "Dogs", href: "#", value: "Dog" },
  { name: "Cats", href: "#", value: "Cat" },
  { name: "Birds", href: "#", value: "Bird" },
  { name: "Fish", href: "#", value: "Fish" },
  { name: "Small Pets", href: "#", value: "small" },
];

const filters = [
  {
    id: "breed",
    name: "Breed",
    options: [
      { value: "german-shepherd", label: "German Shepherd", checked: false },
      { value: "golden-retriever", label: "Golden Retriever", checked: false },
      { value: "labrador", label: "Labrador", checked: false },
      { value: "poodle", label: "Poodle", checked: false },
      { value: "siamese", label: "Siamese", checked: false },
      { value: "persian", label: "Persian", checked: false },
      { value: "maine-coon", label: "Maine Coon", checked: false },
      { value: "bengal", label: "Bengal", checked: false },
    ],
  },
  {
    id: "age",
    name: "Age",
    options: [
      { value: "puppy", label: "0-1 year", checked: false },
      { value: "young", label: "1-3 years", checked: false },
      { value: "adult", label: "3-7 years", checked: false },
      { value: "senior", label: "7+ years", checked: false },
    ],
  },
  {
    id: "price",
    name: "Price Range",
    options: [
      { value: "budget", label: "Under $500", checked: false },
      { value: "mid-range", label: "$500-$1000", checked: false },
      { value: "premium", label: "$1000-$2000", checked: false },
      { value: "luxury", label: "$2000+", checked: false },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Image Carousel Component for Pet Cards
const ImageCarousel = ({ images }) => {
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

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full">
            ‹
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full">
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
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Pet Details Modal
const PetDetailsModal = ({ pet, isOpen, onClose, wishlist }) => {
  if (!pet) return null;
  const isWishlisted = wishlist.includes(pet._id);

  const sampleImages = pet.images || [
    pet.imageUrl,
    "https://placehold.co/600x400?text=Pet+Image+2",
    "https://placehold.co/600x400?text=Pet+Image+3",
    "https://placehold.co/600x400?text=Pet+Image+4",
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{pet.name}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100">
                <XMarkIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ImageCarousel images={sampleImages} />
              </div>
              <div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Breed</h4>
                    <p className="text-base font-medium">{pet.breed}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Age</h4>
                    <p className="text-base font-medium">{pet.age} years old</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Gender
                    </h4>
                    <p className="text-base font-medium">{pet.gender}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Weight
                    </h4>
                    <p className="text-base font-medium">{pet.weight}</p>
                  </div>
                  {pet.height && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Height
                      </h4>
                      <p className="text-base font-medium">{pet.height}</p>
                    </div>
                  )}
                  {pet.lifeSpan && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Lifespan
                      </h4>
                      <p className="text-base font-medium">{pet.lifeSpan}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Price</h4>
                    <p className="text-xl font-bold text-indigo-600">
                      ${pet.price}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Details
                  </h4>
                  <p className="text-gray-700">
                    {pet.details || "No details available for this pet."}
                  </p>
                </div>

                {pet.characteristics && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Characteristics
                    </h4>
                    <p className="text-gray-700">{pet.characteristics}</p>
                  </div>
                )}

                <div className="mt-8 flex space-x-4">
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
                    Adopt Now
                  </button>
                  <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-2 rounded-md">
                    <HeartIcon
                      className={`h-6 w-6 transition-colors duration-200 ${
                        isWishlisted
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>
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

  const sampleImages = pet.images || [
    pet.imageUrl,
    "https://placehold.co/600x400?text=Pet+Image+2",
    "https://placehold.co/600x400?text=Pet+Image+3",
    "https://placehold.co/600x400?text=Pet+Image+4",
  ];

  return (
    <div className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="cursor-pointer" onClick={() => onViewDetails(pet)}>
        <ImageCarousel images={sampleImages} />

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(pet._id);
              }}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Add to wishlist">
              <HeartIcon
                className={`h-6 w-6 transition-colors duration-200 ${
                  isWishlisted
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
              />
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-500">{pet.breed}</p>
          <p className="mt-1 text-sm text-gray-500">{pet.age} years old</p>

          <div className="mt-2 flex justify-between items-center">
            <p className="text-lg font-medium text-gray-900">${pet.price}</p>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Available
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onViewDetails(pet)}
        className="block w-[calc(100%-2rem)] mx-auto mb-4 mt-2 bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
        View Details
      </button>
    </div>
  );
};

export default function PetStore() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSort, setCurrentSort] = useState(sortOptions[0]);
  const [wishList, setWishList] = useState([]);
  const [userData, setUserData] = useState([]);

  // Add state for pet details modal
  const [selectedPet, setSelectedPet] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Add state for wishlist
  const [wishlist, setWishlist] = useState([]);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      Object.entries(selectedFilters).forEach(([category, values]) => {
        Object.entries(values).forEach(([value, isChecked]) => {
          if (isChecked) {
            queryParams.append(category, value);
          }
        });
      });

      if (selectedCategory) {
        queryParams.append("category", selectedCategory);
      }

      if (currentSort) {
        queryParams.append("sort", currentSort.value);
      }

      queryParams.append("available", "true");

      const response = await axios.get(
        `${config.baseURL}/api/aboutpet/all?${queryParams}`
      );
      setPets(response.data);
      console.log("Fetched pets:", response.data);

      setFilteredPets(response.data);

      if (userData?._id) {
        const resp = await axios.get(
          `${config.baseURL}/api/user/getallwishlist/${userData._id}`
        );
        setWishlist(resp.data);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError("Failed to load pets. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedFilters, selectedCategory, currentSort, userData?._id]);

  // 1. Store userData from localStorage
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("user"));

    if (userdata && userdata.data) {
      setUserData(userdata.data); // setUserData is async 💕
      console.log("Logged in as", userdata.data);
    } else {
      console.log("No user found");
    }
  }, []);

  // 2. Fetch pets AFTER userData is available
  useEffect(() => {
    if (!userData?.id) return; // Wait until userData is ready, my love 💖

    fetchPets();
  }, [userData]); // This will trigger once userData is set 🌟

  // Fetch user's wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userData?.id) return; // Make sure we wait for the user ID

      try {
        const response = await axios.get(
          `${config.baseURL}/api/user/getallwishlist/${userData.id}`
        );
        setWishlist(response.data);
        console.log("Wishlist fetched", response.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, [userData]); // Only run when userData is available

  const handleFilterChange = (sectionId, value, checked) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [value]: checked,
      },
    }));
  };

  const handleCategoryChange = (categoryValue) => {
    // If the same category is clicked again, clear the selection
    if (selectedCategory === categoryValue) {
      //console.log("Clearing category selection");
      setSelectedCategory("");
      setPets(filteredPets); // Reset to all pets
      console.log(pets);
    } else {
      setSelectedCategory(categoryValue);
    }
    // set pets with category as categoryValue
    const filteredPet = filteredPets.filter(
      (pet) => pet.category === categoryValue
    );
    setPets(filteredPet);
    setSelectedCategory(categoryValue);
  };
  // const handleCategoryChange = (categoryValue) => {
  //   if (selectedCategory === categoryValue) {
  //     setSelectedCategory(""); // Toggle off if it's the same
  //   } else {
  //     setSelectedCategory(categoryValue); // Set new category
  //   }
  // };

  const handleSortChange = (sortOption) => {
    setCurrentSort(sortOption);

    // Update current status in sortOptions
    sortOptions.forEach((option) => {
      option.current = option.value === sortOption.value;
    });
  };

  const handleAddToWishlist = async (petId) => {
    try {
      console.log("Adding to wishlist:", petId);

      const userId = userData.id;
      await axios.put(`${config.baseURL}/api/user/updatewishlist`, {
        userId,
        wishListId: petId,
      });

      // Update local wishlist state
      setWishlist((prev) => [...prev, petId]);

      // Show success message
      alert("Pet added to wishlist!");
    } catch (err) {
      console.error("Error adding to wishlist:", err);

      // If unauthorized, prompt user to login
      if (err.response?.status === 401) {
        alert("Please log in to add pets to your wishlist.");
      } else {
        alert("Failed to add pet to wishlist. Please try again.");
      }
    }
  };

  // Handler for viewing pet details
  const handleViewDetails = (pet) => {
    console.log("Viewing details for pet:", pet);

    setSelectedPet(pet);
    setIsDetailsModalOpen(true);
  };

  // Handler for closing pet details modal
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
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

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>
                <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(category.value)}
                        className={`block px-2 py-3 w-full text-left ${
                          selectedCategory === category.value
                            ? "text-indigo-600 font-semibold"
                            : ""
                        }`}>
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6">
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-[&:not([data-open])]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  type="checkbox"
                                  onChange={(e) =>
                                    handleFilterChange(
                                      section.id,
                                      option.value,
                                      e.target.checked
                                    )
                                  }
                                  defaultValue={option.value}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25">
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-[:checked]:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="min-w-0 flex-1 text-gray-500">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl uppercase font-extrabold tracking-tighter text-gray-900">
              Pets Store
            </h1>
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort: {currentSort.name}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <button
                          onClick={() => handleSortChange(option)}
                          className={classNames(
                            option.current
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            "block w-full text-left px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none"
                          )}>
                          {option.name}
                        </button>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Available Pets
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-8">
              {/* Filters - Add sticky positioning */}
              <form className="hidden lg:block lg:col-span-2 max-w-[200px] sticky top-24 h-fit">
                <h3 className="font-medium text-gray-900 mb-3">
                  Pet Categories
                </h3>
                <ul
                  role="list"
                  className="space-y-4 border-b border-gray-200 pb-6 text-sm text-gray-900">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(category.value)}
                        className={`w-full text-left ${
                          selectedCategory === category.value
                            ? "text-indigo-600 font-medium"
                            : ""
                        }`}>
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6"
                    defaultOpen={true}>
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-[&:not([data-open])]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  onChange={(e) =>
                                    handleFilterChange(
                                      section.id,
                                      option.value,
                                      e.target.checked
                                    )
                                  }
                                  defaultValue={option.value}
                                  defaultChecked={option.checked}
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />

                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25">
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-[:checked]:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>

              {/* Products - Add scrollable container */}
              <div className="lg:col-span-6">
                <div className="h-[calc(100vh-200px)] overflow-y-auto pr-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-500">Loading pets...</p>
                    </div>
                  ) : error ? (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : pets.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-500">
                        No pets found matching your criteria.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                      {pets.map((pet) => (
                        <PetCard
                          key={pet._id}
                          pet={pet}
                          onViewDetails={handleViewDetails}
                          onAddToWishlist={handleAddToWishlist}
                          wishlist={wishlist}
                        />
                      ))}
                      {/* Pet Details Modal */}
                      <PetDetailsModal
                        pet={selectedPet}
                        isOpen={isDetailsModalOpen}
                        onClose={() => setIsDetailsModalOpen(false)}
                        wishlist={wishlist}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
