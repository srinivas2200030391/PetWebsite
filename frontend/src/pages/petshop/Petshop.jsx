import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  DialogBackdrop,
} from "@headlessui/react";
import {
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { MinusIcon, PlusIcon, XCircleIcon } from "@heroicons/react/20/solid";
import config from "../../config";
import PetCard from "./PetCard";
import PetDetailsModal from "./PetDetailsModal";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const pageTransition = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const sortOptions = [
  { name: "Relevance", value: "relevance", current: true },
  { name: "Most Recent", value: "recent", current: false },
  { name: "Price: Low to High", value: "price_asc", current: false },
  { name: "Price: High to Low", value: "price_desc", current: false },
  { name: "Age: Youngest", value: "age_asc", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Debounce helper function
function debounce(func, delay) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

export default function PetStore() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Core filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [currentSort, setCurrentSort] = useState(sortOptions.find(opt => opt.current));
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [allFetchedPets, setAllFetchedPets] = useState([]);
  const [displayedPets, setDisplayedPets] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([{ name: "All Pets", value: "" }]);
  const [dynamicFilters, setDynamicFilters] = useState([]);
  
  // UI/Loading states
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [error, setError] = useState(null);
  const pendingToastRef = useRef(null);

  // User & Wishlist states
  const [userData, setUserData] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // --- Client-Side Filtering (for search) ---
  const filterPetsBySearch = useCallback((petsToFilter, query) => {
    if (!query.trim()) return petsToFilter;
    const lowerQuery = query.toLowerCase();
    return petsToFilter.filter(pet => 
      Object.values(pet).some(val => 
        String(val).toLowerCase().includes(lowerQuery)
      )
    );
  }, []);

  // --- Data Fetching and Processing ---
  const processAndSetPets = useCallback((petsFromApi) => {
    setAllFetchedPets(petsFromApi); // Store the full dataset

    // Generate dynamic filter options from the COMPLETE dataset (petsFromApi)
    // This ensures filter options don't disappear if current filters yield no results for them
    const uniqueCategories = [
      ...new Set(petsFromApi.map((p) => p.category).filter(Boolean)),
    ];
    setDynamicCategories([
      { name: "All Pets", value: "" },
      ...uniqueCategories.map((cat) => ({ name: cat, value: cat })),
    ]);

    const filterFields = [
      { id: "breed", name: "Breed" },
      { id: "gender", name: "Gender" },
      { id: "ageUnit", name: "Age Unit" }, 
      { id: "petQuality", name: "Quality" },
    ];

    const newDynamicFilters = filterFields.map(field => {
      const uniqueValues = [
        ...new Set(petsFromApi.map(p => p[field.id]).filter(Boolean).sort()),
      ];
      return {
        id: field.id,
        name: field.name,
        options: uniqueValues.map(val => ({
          label: String(val),
          value: String(val),
        })),
      };
    }).filter(f => f.options.length > 0);
    setDynamicFilters(newDynamicFilters);

    // DO NOT set displayedPets here directly anymore.
    // The new comprehensive useEffect will handle filtering allFetchedPets into displayedPets.

  }, [selectedFilters]); // searchQuery is no longer a direct dependency here. 
                        // filterPetsBySearch is also removed as it's not called here.
                        // dynamicCategories doesn't need to be in deps since it's set here.

  // Debounced version of fetchPets to avoid rapid API calls
  const debouncedFetchPets = useCallback(
    debounce(async (/* fetchConfig is no longer used for filtering params */) => {
      if (pendingToastRef.current) toast.dismiss(pendingToastRef.current);
      pendingToastRef.current = toast.loading("Fetching all pets...");
    setLoading(true);
      setError(null);

      // Params are no longer built from fetchConfig for filtering, always fetch all
      const params = new URLSearchParams(); 

      try {
        const response = await axios.get(`${config.baseURL}/api/aboutpet/all`); // Always fetch all
        processAndSetPets(response.data); // processAndSetPets will now primarily set allFetchedPets
        // Toast message might need adjustment if this only happens once
        // toast.success("Pet data refreshed!"); 
      } catch (err) {
        console.error("Error fetching all pets:", err);
        setError("Could not load pet data. Please try again.");
        setAllFetchedPets([]); // Clear data on error
        setDisplayedPets([]); // Clear displayed data on error
        toast.error("Failed to fetch pet data.");
      } finally {
        if (pendingToastRef.current) toast.dismiss(pendingToastRef.current);
        pendingToastRef.current = null;
        setLoading(false);
        if (!initialLoadComplete) {
            setInitialLoadComplete(true);
            toast.success("Pet catalogue loaded!"); // Success toast after initial full load
        }
      }
    }, 500), 
    [processAndSetPets, initialLoadComplete] // processAndSetPets and initialLoadComplete are dependencies
  );

  // --- Effects ---
  // Effect to fetch initial full dataset
  useEffect(() => {
    if (userData?._id && !initialLoadComplete) { // Fetch only if user is loaded AND initial load hasn't happened
        debouncedFetchPets(); // No specific config needed as it always fetches all
    }
    // This effect should primarily run once userData is available to fetch the initial dataset.
    // It no longer depends on filter/sort states for re-fetching.
  }, [userData, initialLoadComplete, debouncedFetchPets]);

  // Effect for all client-side filtering, sorting, and searching
  useEffect(() => {
    if (!initialLoadComplete) {
      return; // Don't filter until initial data is loaded and allFetchedPets is populated
    }

    let result = [...allFetchedPets]; // Start with a copy of all fetched pets

    // 1. Category Filter
      if (selectedCategory) {
      result = result.filter(pet => pet.category === selectedCategory);
    }

    // 2. Facet Filters (breed, gender, etc.)
    if (Object.keys(selectedFilters).length > 0) {
      result = result.filter(pet => {
        return Object.entries(selectedFilters).every(([filterType, filterValues]) => {
          const selectedOptions = Object.keys(filterValues).filter(key => filterValues[key]);
          if (selectedOptions.length === 0) return true; // No options selected for this filter type, so pass
          return selectedOptions.includes(String(pet[filterType]));
        });
      });
    }

    // 3. Search Query Filter
    if (searchQuery.trim() !== "") {
      result = filterPetsBySearch(result, searchQuery); // Use the memoized function
    }

    // 4. Sorting
    const sortValue = currentSort?.value;
    if (sortValue === 'price_asc') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortValue === 'price_desc') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortValue === 'age_asc') {
      result.sort((a, b) => {
        // Basic age sort, assumes age is primarily numeric.
        // A more robust solution would parse "X units" into a comparable value (e.g., total months).
        const ageA = parseFloat(String(a.age).split(' ')[0]); 
        const ageB = parseFloat(String(b.age).split(' ')[0]);
        if (!isNaN(ageA) && !isNaN(ageB)) return ageA - ageB;
        return 0; // Fallback if ages are not easily parsable to numbers
      });
    }
    // 'recent': If pets have a 'createdAt' or similar timestamp, sort by that. Otherwise, it's hard to do client-side accurately.
    // For now, 'recent' and 'relevance' will not apply a specific sort beyond what other filters/sorts do.

    // 5. Final "Available" vs "Sold Out" sorting (applied last to maintain other sorts within these groups)
    const available = result.filter(p => p.status === "Available");
    const soldOut = result.filter(p => p.status !== "Available");
    
    setDisplayedPets([...available, ...soldOut]);

  }, [allFetchedPets, selectedCategory, selectedFilters, currentSort, searchQuery, initialLoadComplete, filterPetsBySearch]);

  useEffect(() => {
    const ud = JSON.parse(localStorage.getItem("user"));
    if (ud && ud.data) {
      setUserData(ud.data);
    } else {
    }
    // Fetch wishlist and payments can be triggered here or based on userData change
  }, []);
  
  useEffect(() => {
    if (!userData?._id) return;

    const fetchWishlistAndPayments = async () => {
      try {
        const [wishlistRes, paymentsRes] = await Promise.all([
          axios.get(`${config.baseURL}/api/user/getallwishlist/${userData._id}`),
          axios.get(`${config.baseURL}/api/payments/getallpayments/${userData._id}`)
        ]);
        setWishlist(wishlistRes.data || []);
        setPayments(paymentsRes.data || []);
      } catch (err) {
        console.error("Error fetching wishlist or payments:", err);
        // Optionally, set them to empty arrays on error to prevent issues
        setWishlist([]);
        setPayments([]); 
        toast.error("Could not load your wishlist or payment data.");
      }
    };

    fetchWishlistAndPayments();
  }, [userData]);

  // Handler for viewing pet details
  const handleViewDetails = (pet) => {
    setSelectedPet(pet);
    setIsDetailsModalOpen(true);
  };

  // Handler for adding to wishlist
  const handleAddToWishlist = async (petId) => {
    try {
      if (!userData?._id) {
        toast.error("Please log in to add pets to your wishlist");
        return;
      }

      const userId = userData._id;
      // Assuming your API endpoint and payload are correct
      await axios.put(`${config.baseURL}/api/user/updatewishlist`, {
        userId,
        wishListId: petId, // Ensure this matches your backend (wishListId vs petId)
      });

      // Update local wishlist state
      if (wishlist.includes(petId)) {
        setWishlist((prev) => prev.filter((id) => id !== petId));
        toast.success("Removed from wishlist");
      } else {
        setWishlist((prev) => [...prev, petId]);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      toast.error("Couldn't update wishlist. Please try again.");
    }
  };

  // --- Event Handlers ---
  const handleCategoryChange = useCallback((categoryValue) => {
    setSelectedCategory(prev => prev === categoryValue ? "" : categoryValue);
  }, []);

  const handleFilterChange = useCallback((sectionId, optionValue, isChecked) => {
    setSelectedFilters(prev => {
      const newSectionFilters = { ...(prev[sectionId] || {}) };
      if (isChecked) {
        newSectionFilters[optionValue] = true;
      } else {
        delete newSectionFilters[optionValue];
      }
      if (Object.keys(newSectionFilters).length === 0) {
        const { [sectionId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [sectionId]: newSectionFilters };
    });
  }, []);

  const handleSortChange = useCallback((sortOption) => {
    setCurrentSort(sortOption);
    sortOptions.forEach(opt => opt.current = (opt.value === sortOption.value));
  }, []);

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const activeFilterObjects = useCallback(() => {
    const active = [];
    if (selectedCategory) {
        const catLabel = dynamicCategories.find(c => c.value === selectedCategory)?.name || selectedCategory;
        active.push({ type: 'category', id: 'category', value: selectedCategory, label: catLabel });
    }
    Object.entries(selectedFilters).forEach(([filterId, options]) => {
        const filterGroup = dynamicFilters.find(f => f.id === filterId);
        Object.keys(options).filter(key => options[key]).forEach(value => {
            active.push({ type: 'filter', id: filterId, value: value, label: `${filterGroup?.name || filterId}: ${value}` });
        });
    });
    return active;
  }, [selectedCategory, selectedFilters, dynamicCategories, dynamicFilters]);

  const clearAllFilters = useCallback(() => {
    setSelectedCategory("");
    setSelectedFilters({});
    setSearchQuery("");
    setCurrentSort(sortOptions.find(opt => opt.value === 'relevance'));
    sortOptions.forEach(opt => opt.current = (opt.value === 'relevance'));
  }, []);
  
  const removeFilterTag = useCallback((tag) => {
    if (tag.type === 'category') {
        setSelectedCategory("");
    } else if (tag.type === 'filter') {
        setSelectedFilters(prev => {
            const newSectionFilters = { ...(prev[tag.id] || {}) };
            delete newSectionFilters[tag.value];
            if (Object.keys(newSectionFilters).length === 0) {
                const { [tag.id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [tag.id]: newSectionFilters };
        });
    }
  }, []);

  // --- Render ---
  if (!initialLoadComplete && loading) {
    return <div className="min-h-screen flex justify-center items-center"><p>Loading Pet Store...</p></div>;
  }


  return (
    <motion.div className="bg-gray-50 min-h-screen">
      <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-25" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button type="button" className="-m-2.5 p-2.5 text-gray-700" onClick={() => setMobileFiltersOpen(false)}><XMarkIcon className="h-6 w-6" /></button>
              </div>
              <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                      <div className="py-6">
                          <h3 className="text-md font-semibold text-gray-900 mb-3">Category</h3>
                          {dynamicCategories.map(cat => (
                              <div key={`mobile-cat-${cat.value}`} className="flex items-center mb-2">
                                  <input id={`mobile-cat-filter-${cat.value}`} name="category" value={cat.value} type="radio" checked={selectedCategory === cat.value} onChange={() => handleCategoryChange(cat.value)} className="h-5 w-5 border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                  <label htmlFor={`mobile-cat-filter-${cat.value}`} className="ml-4 text-sm font-medium text-gray-700">{cat.name}</label>
                              </div>
                  ))}
                      </div>
                      {dynamicFilters.map(section => (
                          <Disclosure as="div" key={`mobile-section-${section.id}`} className="py-6 border-t border-gray-200" defaultOpen>
                              {({ open }) => (
                                  <>
                                      <h3 className="-my-3 flow-root">
                                          <DisclosureButton className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                              <span className="font-medium text-gray-900">{section.name}</span>
                                              <span className="ml-6 flex items-center">{open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}</span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                                          <div className="space-y-4">
                                              {section.options.map(option => (
                                                  <div key={`mobile-${section.id}-${option.value}`} className="flex items-center">
                                                      <input id={`mobile-filter-${section.id}-${option.value}`} name={`${section.id}[]`} value={option.value} type="checkbox" checked={!!(selectedFilters[section.id]?.[option.value])} onChange={(e) => handleFilterChange(section.id, option.value, e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                                      <label htmlFor={`mobile-filter-${section.id}-${option.value}`} className="ml-4 min-w-0 flex-1 text-sm font-medium text-gray-700">{option.label}</label>
                                                  </div>
                                              ))}
                                          </div>
                                      </DisclosurePanel>
                                  </>
                              )}
                          </Disclosure>
                      ))}
                  </div>
              </div>
               <div className="mt-8 border-t pt-6">
                  <button onClick={clearAllFilters} className="w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Clear All Filters</button>
              </div>
          </DialogPanel>
      </Dialog>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 lg:px-8">
        <div className="border-b border-gray-200 pb-8 pt-16 md:pt-20">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Find Your New Friend</h1>
            <p className="mt-4 text-lg text-gray-500">Browse our available pets or use filters to find the perfect match.</p>
        </div>
        
        <div className="pt-8 pb-24 lg:grid lg:grid-cols-4 lg:gap-x-8">
          <aside className="hidden lg:block">
            <h2 className="sr-only">Filters</h2>
            <div className="sticky top-8 bg-white p-6 rounded-lg shadow space-y-6">
                <div>
                    <label htmlFor="search-desktop" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Search Pets
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                                <input
                            type="search" 
                            name="search-desktop" 
                            id="search-desktop" 
                            value={searchQuery} 
                            onChange={handleSearchQueryChange} 
                            placeholder="Name, breed, color..." 
                            className="block w-full bg-white shadow-sm rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                  />
                    </div>
                              </div>

                <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Category</h3>
                    <div className="space-y-2">
                        {dynamicCategories.map(cat => (
                            <div key={`desktop-cat-${cat.value}`} className="flex items-center">
                                <input id={`desktop-cat-filter-${cat.value}`} name="category" value={cat.value} type="radio" checked={selectedCategory === cat.value} onChange={() => handleCategoryChange(cat.value)} className="h-5 w-5 border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor={`desktop-cat-filter-${cat.value}`} className="ml-4 text-sm font-medium text-gray-700 cursor-pointer">{cat.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {dynamicFilters.map(section => (
                    <Disclosure as="div" key={`desktop-section-${section.id}`} className="border-t border-gray-200 pt-6" defaultOpen>
                        {({ open }) => (
                            <>
                                <h3 className="-my-3 flow-root">
                                    <DisclosureButton className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                        <span className="font-medium text-gray-900">{section.name}</span>
                                        <span className="ml-6 flex items-center">{open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}</span>
                                    </DisclosureButton>
                                </h3>
                                <DisclosurePanel className="pt-6">
                                    <div className="space-y-4">
                                        {section.options.map(option => (
                                            <div key={`desktop-${section.id}-${option.value}`} className="flex items-center">
                                                <input id={`desktop-filter-${section.id}-${option.value}`} name={`${section.id}[]`} value={option.value} type="checkbox" checked={!!(selectedFilters[section.id]?.[option.value])} onChange={(e) => handleFilterChange(section.id, option.value, e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                                <label htmlFor={`desktop-filter-${section.id}-${option.value}`} className="ml-4 text-sm font-medium text-gray-700 cursor-pointer">{option.label}</label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                            </>
                        )}
                  </Disclosure>
                ))}
                <div className="pt-6">
                  <button onClick={clearAllFilters} className="w-full flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">Clear All Filters</button>
                </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <div className="text-sm text-gray-500">
                    {loading ? "Loading..." : `${displayedPets.length} pet${displayedPets.length === 1 ? "" : "s"} found`}
          </div>
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort: {currentSort.name}
                            <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                  </MenuButton>
                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                                {sortOptions.map(option => (
                      <MenuItem key={option.name}>
                                        {({ active }) => (
                                            <button onClick={() => handleSortChange(option)} className={classNames(option.current ? 'font-medium text-indigo-600' : 'text-gray-500', active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm')}>{option.name}</button>
                                        )}
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>              
                    <button type="button" onClick={() => setMobileFiltersOpen(true)} className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 lg:hidden">
                        <FunnelIcon className="h-5 w-5" />
              </button>
                </div>
            </div>

            {activeFilterObjects().length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-700">Active:</h3>
                    {activeFilterObjects().map(tag => (
                        <span key={`${tag.id}-${tag.value}`} className="inline-flex items-center gap-x-1.5 rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
                            {tag.label}
                            <button type="button" onClick={() => removeFilterTag(tag)} className="-mr-0.5 h-3.5 w-3.5 rounded-full text-indigo-500 hover:bg-indigo-200"><XMarkIcon className="h-2.5 w-2.5"/></button>
                        </span>
                    ))}
                    <button onClick={clearAllFilters} className="text-xs text-gray-500 hover:text-indigo-600 underline">Clear all</button>
                </div>
            )}
            
            <AnimatePresence mode="wait">
              {loading && !initialLoadComplete && displayedPets.length === 0 ? (
                 <motion.div key="initial-skeletons" className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {[...Array(6)].map((_, i) => {
                        return (
                            <div key={`skeleton-${i}`} className="bg-white rounded-xl shadow-lg p-4 space-y-3 animate-pulse">
                                <div className="aspect-[4/3] bg-gray-200 rounded-lg"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-8 bg-gray-200 rounded w-full"></div>
                            </div>
                        );
                    })}
                </motion.div>
              ) : !loading && displayedPets.length === 0 ? (
                <motion.div key="no-results" className="text-center py-12">
                  <AdjustmentsHorizontalIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Pets Found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                  <div className="mt-6">
                    <button onClick={clearAllFilters} type="button" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Clear All Filters
                    </button>
                          </div>
                </motion.div>
              ) : (
                <motion.div
                    key="pet-results"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {displayedPets.map(pet => {
                    return (
                        <PetCard key={pet._id} pet={pet} onViewDetails={handleViewDetails} onAddToWishlist={handleAddToWishlist} wishlist={wishlist} />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
              </div>
            </div>
        </main>
      <PetDetailsModal pet={selectedPet} isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} onAddToWishlist={handleAddToWishlist} wishlist={wishlist} userId={userData?._id} payments={payments} />
    </motion.div>
  );
}
