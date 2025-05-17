import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  IconButton,
  Chip,
  Progress,
} from "@material-tailwind/react";
import { 
  XMarkIcon, 
  PhotoIcon, 
  PlusIcon, 
  TrashIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  TagIcon,
  PuzzlePieceIcon,
  CameraIcon,
  InformationCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/solid";
import axios from "axios";
import config from "./../../config";
import { useNavigate } from "react-router-dom";

// Custom Input Component
const CustomInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  type = "text", 
  error = "", 
  onBlur = () => {}, 
  className = "" 
}) => {
  return (
    <div className="mb-4">
      <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-white rounded-lg border-2 outline-none transition-all duration-200
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-200 focus:border-orange-400'}
            ${className}`}
          required={required}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Custom Textarea Component
const CustomTextarea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error = "", 
  onBlur = () => {}, 
  rows = 4,
  className = "" 
}) => {
  return (
    <div className="mb-4">
      <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-3 bg-white rounded-lg border-2 outline-none transition-all duration-200
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-200 focus:border-orange-400'}
            ${className}`}
          required={required}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Custom Select Component
const CustomSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  required = false, 
  error = "", 
  className = "" 
}) => {
  return (
    <div className="mb-4">
      <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 bg-white rounded-lg border-2 outline-none appearance-none transition-all duration-200
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-200 focus:border-orange-400'}
            ${className}`}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default function AddBoardingShop() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Add validation error state
  const [validationErrors, setValidationErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    location: "",
    ownerName: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    businessHours: "",
    petTypes: [],
    amenities: [],
    priceTable: [
      { petType: "Dog", breed: "Any", size: "Small", age: "Puppy", price: "" },
    ],
    images: []
  });

  // For custom amenity input
  const [customAmenity, setCustomAmenity] = useState("");

  // For animation
  const [fadeIn, setFadeIn] = useState(true);

  // Available amenities list
  const availableAmenities = [
    "24/7 Care", 
    "Grooming", 
    "Play Area", 
    "Vet Services", 
    "Climate Control", 
    "Webcam Access", 
    "Premium Food", 
    "Pickup/Dropoff",
    "Daily Walks",
    "Playtime",
    "Veterinary Care",
    "Training"
  ];

  // Available pet types
  const petTypes = [
    "Dogs",
    "Cats",
    "Birds",
    "Small Pets",
    "Reptiles",
    "Other"
  ];

  // Pet size options
  const petSizes = ["Small", "Medium", "Large", "Any"];
  
  // Pet age options
  const petAges = ["Puppy/Kitten", "Adult", "Senior", "Any"];

  // Enhanced input change handler with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ""
      });
    }
  };

  // Handle pet type selection/deselection
  const handlePetTypeToggle = (petType) => {
    setFormData(prev => {
      if (prev.petTypes.includes(petType)) {
        return {
          ...prev,
          petTypes: prev.petTypes.filter(item => item !== petType)
        };
      } else {
        return {
          ...prev,
          petTypes: [...prev.petTypes, petType]
        };
      }
    });
  };

  // Handle amenity selection/deselection
  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter(item => item !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity]
        };
      }
    });
  };

  // Handle custom amenity addition
  const handleAddCustomAmenity = () => {
    if (customAmenity.trim() === "") return;
    
    if (!formData.amenities.includes(customAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity.trim()]
      }));
      setCustomAmenity(""); // Reset the input field
    }
  };

  // Handle price table updates
  const handlePriceTableChange = (index, field, value) => {
    const updatedPriceTable = [...formData.priceTable];
    // Convert price to a number if the field is 'price'
    updatedPriceTable[index][field] = field === 'price' ? Number(value) : value;
    setFormData({
      ...formData,
      priceTable: updatedPriceTable
    });
  };

  // Add new price entry
  const addPriceEntry = () => {
    setFormData({
      ...formData,
      priceTable: [
        ...formData.priceTable,
        { petType: "Dog", breed: "Any", size: "Small", age: "Puppy", price: "" }
      ]
    });
  };

  // Remove price entry
  const removePriceEntry = (index) => {
    const updatedPriceTable = formData.priceTable.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      priceTable: updatedPriceTable
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > 5) {
      setErrorMessage("Maximum 5 images allowed");
      return;
    }
    
    // Convert images to base64 strings for preview and sending to backend
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(imageDataUrls => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageDataUrls]
      }));
    });
  };

  // Remove an image
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Enhanced form validation logic
  const validateField = (fieldName, value) => {
    let errors = { ...validationErrors };
    
    // Clear previous error
    delete errors[fieldName];
    
    switch (fieldName) {
      case "shopName":
        if (!value.trim()) errors[fieldName] = "Center name is required";
        else if (value.trim().length < 3) errors[fieldName] = "Center name must be at least 3 characters";
        break;
      case "shopDescription":
        if (!value.trim()) errors[fieldName] = "Description is required";
        else if (value.trim().length < 20) errors[fieldName] = "Please provide a more detailed description (min 20 characters)";
        break;
      case "ownerName":
        if (!value.trim()) errors[fieldName] = "Owner name is required";
        break;
      case "location":
        if (!value.trim()) errors[fieldName] = "Location is required";
        break;
      case "address":
        if (!value.trim()) errors[fieldName] = "Address is required";
        break;
      case "contactEmail":
        if (!value.trim()) {
          errors[fieldName] = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          errors[fieldName] = "Invalid email address";
        }
        break;
      case "contactPhone":
        if (!value.trim()) {
          errors[fieldName] = "Phone number is required";
        } else if (!/^[0-9+\- ]{10,15}$/i.test(value.replace(/\s/g, ''))) {
          errors[fieldName] = "Invalid phone number";
        }
        break;
      case "businessHours":
        if (!value.trim()) errors[fieldName] = "Business hours are required";
        break;
      case "petTypes":
        if (!value || value.length === 0) errors[fieldName] = "At least one pet type is required";
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
    return !errors[fieldName]; // Return true if valid
  };

  // Function to validate all fields in the current step
  const validateStepFields = () => {
    let isValid = true;
    let newErrors = {};
    
    // Check which fields to validate based on current step
    switch (currentStep) {
      case 1:
        // Basic Information
        ["shopName", "shopDescription", "location", "ownerName", "address"].forEach(field => {
          if (!validateField(field, formData[field])) {
            isValid = false;
            newErrors[field] = validationErrors[field] || `${field} is required`;
          }
        });
        break;
      case 2:
        // Contact Information
        ["contactEmail", "contactPhone", "businessHours"].forEach(field => {
          if (!validateField(field, formData[field])) {
            isValid = false;
            newErrors[field] = validationErrors[field] || `${field} is required`;
          }
        });
        break;
      case 3:
        // Pets & Pricing
        if (formData.petTypes.length === 0) {
          isValid = false;
          newErrors.petTypes = "At least one pet type is required";
        }
        
        // Check if all prices are filled
        formData.priceTable.forEach((entry, index) => {
          if (!entry.price) {
            isValid = false;
            newErrors[`price_${index}`] = "Price is required";
          }
        });
        break;
      // Steps 4 & 5 have no required fields
    }
    
    setValidationErrors(newErrors);
    return isValid;
  };

  // Update the changeStep function to include validation
  const changeStep = (direction) => {
    if (direction === 'next' && !validateStepFields()) {
      // Don't proceed if validation fails
      setErrorMessage("Please fix the validation errors before proceeding");
      return;
    }
    
    // Clear any error message
    setErrorMessage("");
    
    setFadeIn(false);
    setTimeout(() => {
      setCurrentStep(prevStep => 
        direction === 'next' 
          ? Math.min(prevStep + 1, totalSteps) 
          : Math.max(prevStep - 1, 1)
      );
      setFadeIn(true);
    }, 300);
  };

  // Update handle submit to do final validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields from all steps
    const allRequiredFields = [
      "shopName", "shopDescription", "location", "ownerName", "address",
      "contactEmail", "contactPhone", "businessHours"
    ];
    
    let hasErrors = false;
    let newErrors = {};
    
    allRequiredFields.forEach(field => {
      if (!formData[field]) {
        hasErrors = true;
        newErrors[field] = `${field} is required`;
      }
    });
    
    if (formData.petTypes.length === 0) {
      hasErrors = true;
      newErrors.petTypes = "At least one pet type is required";
    }
    
    if (hasErrors) {
      setValidationErrors(newErrors);
      setErrorMessage("Please fill all required fields before submitting");
      return;
    }
    
    // Prepare the data for submission - ensure price values are numbers
    const submissionData = {
      ...formData,
      priceTable: formData.priceTable.map(entry => ({
        ...entry,
        price: Number(entry.price)
      }))
    };
    
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Send form data to API
      const response = await axios.post(`${config.baseURL}/api/boarding`, submissionData);
      
      if (response.data) {
        setSuccessMessage("Boarding center added successfully!");
        // Reset form or redirect
        setTimeout(() => {
          navigate("/boarding");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.response?.data?.message || "Failed to add boarding center. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 my-12">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-8 mb-8 shadow-lg text-white">
        <Typography variant="h2" className="font-bold">
          Add Your Boarding Center
        </Typography>
        <Typography className="mt-2 opacity-90">
          Join our network of quality pet care providers and grow your business
        </Typography>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center ${index < currentStep ? 'text-orange-500' : 'text-gray-400'}`}
            >
              <div className={`rounded-full flex items-center justify-center h-10 w-10 mb-1 border-2 
                ${index + 1 === currentStep 
                  ? 'border-orange-500 text-orange-500' 
                  : index + 1 < currentStep 
                    ? 'border-orange-500 bg-orange-500 text-white' 
                    : 'border-gray-300 text-gray-300'}`}
              >
                {index + 1 < currentStep ? <CheckCircleIcon className="h-6 w-6" /> : index + 1}
              </div>
              <Typography className="text-xs">
                {index === 0 ? 'Basic Info' : 
                 index === 1 ? 'Contact' : 
                 index === 2 ? 'Pets & Pricing' : 
                 index === 3 ? 'Amenities' : 'Photos'}
              </Typography>
            </div>
          ))}
        </div>
        <Progress 
          value={(currentStep / totalSteps) * 100} 
          size="lg" 
          className="bg-gray-200"
          color="orange"
        />
      </div>

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 animate-pulse">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 mr-2" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <div className="flex items-center">
            <XMarkIcon className="h-6 w-6 mr-2" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="p-8">
              <div className="flex items-center mb-6 text-orange-500">
                <BuildingOfficeIcon className="h-7 w-7 mr-2" />
                <Typography variant="h4" className="font-medium">
                  Basic Information
                </Typography>
              </div>
              
              <div className="space-y-4">
                <CustomInput
                  label="Center Name"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="Enter your boarding center name"
                  required={true}
                  error={validationErrors.shopName}
                  onBlur={() => validateField("shopName", formData.shopName)}
                />

                <CustomInput
                  label="Owner Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="Enter the owner's full name"
                  required={true}
                  error={validationErrors.ownerName}
                  onBlur={() => validateField("ownerName", formData.ownerName)}
                />

                <CustomTextarea
                  label="Description"
                  name="shopDescription"
                  value={formData.shopDescription}
                  onChange={handleInputChange}
                  placeholder="Describe your boarding center, services offered, facilities, etc."
                  required={true}
                  error={validationErrors.shopDescription}
                  onBlur={() => validateField("shopDescription", formData.shopDescription)}
                  rows={5}
                />

                <CustomTextarea
                  label="Complete Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full address with street, city, state, and zip code"
                  required={true}
                  error={validationErrors.address}
                  onBlur={() => validateField("address", formData.address)}
                  rows={3}
                />

                <CustomInput
                  label="Location/City"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  required={true}
                  error={validationErrors.location}
                  onBlur={() => validateField("location", formData.location)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="p-8">
              <div className="flex items-center mb-6 text-orange-500">
                <PhoneIcon className="h-7 w-7 mr-2" />
                <Typography variant="h4" className="font-medium">
                  Contact Information
                </Typography>
              </div>
              
              <div className="space-y-4">
                <CustomInput
                  label="Email Address"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="contact@yourcompany.com"
                  required={true}
                  error={validationErrors.contactEmail}
                  onBlur={() => validateField("contactEmail", formData.contactEmail)}
                />

                <CustomInput
                  label="Phone Number"
                  name="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  required={true}
                  error={validationErrors.contactPhone}
                  onBlur={() => validateField("contactPhone", formData.contactPhone)}
                />

                <CustomInput
                  label="Business Hours"
                  name="businessHours"
                  value={formData.businessHours}
                  onChange={handleInputChange}
                  placeholder="Monday - Sunday: 8:00 AM - 8:00 PM"
                  required={true}
                  error={validationErrors.businessHours}
                  onBlur={() => validateField("businessHours", formData.businessHours)}
                />
              </div>
            </div>
          )}

          {/* Step 3: Pets & Pricing */}
          {currentStep === 3 && (
            <div className="p-8">
              <div className="flex items-center mb-6 text-orange-500">
                <TagIcon className="h-7 w-7 mr-2" />
                <Typography variant="h4" className="font-medium">
                  Pets & Pricing
                </Typography>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-gray-700 text-sm font-medium mb-3">
                    Select types of pets you can accommodate
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-3 mb-2">
                    {petTypes.map((type) => (
                      <div 
                        key={type}
                        onClick={() => handlePetTypeToggle(type)}
                        className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                          formData.petTypes.includes(type)
                            ? "bg-orange-100 text-orange-700 border-2 border-orange-300 font-medium"
                            : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-orange-200"
                        }`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                  
                  {validationErrors.petTypes && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.petTypes}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-gray-700 text-sm font-medium mb-3">
                    Add pricing details
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  <div className="space-y-4 mb-4">
                    {formData.priceTable.map((priceEntry, index) => (
                      <div key={index} className={`p-5 border-2 rounded-lg relative ${validationErrors[`price_${index}`] ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-orange-200"}`}>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1">Pet Type</label>
                            <select
                              value={priceEntry.petType}
                              onChange={(e) => handlePriceTableChange(index, 'petType', e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-lg border-2 border-gray-200 outline-none appearance-none transition-all duration-200 hover:border-orange-200 focus:border-orange-400"
                            >
                              {formData.petTypes.length > 0 ? 
                                formData.petTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                )) : 
                                petTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))
                              }
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1">Breed</label>
                            <input
                              type="text"
                              value={priceEntry.breed}
                              onChange={(e) => handlePriceTableChange(index, 'breed', e.target.value)}
                              placeholder="Any"
                              className="w-full px-3 py-2 bg-white rounded-lg border-2 border-gray-200 outline-none transition-all duration-200 hover:border-orange-200 focus:border-orange-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1">Size</label>
                            <select
                              value={priceEntry.size}
                              onChange={(e) => handlePriceTableChange(index, 'size', e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-lg border-2 border-gray-200 outline-none appearance-none transition-all duration-200 hover:border-orange-200 focus:border-orange-400"
                            >
                              {petSizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1">Age</label>
                            <select
                              value={priceEntry.age}
                              onChange={(e) => handlePriceTableChange(index, 'age', e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-lg border-2 border-gray-200 outline-none appearance-none transition-all duration-200 hover:border-orange-200 focus:border-orange-400"
                            >
                              {petAges.map(age => (
                                <option key={age} value={age}>{age}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="flex items-center text-xs text-gray-600 font-medium mb-1">
                              Price (₹)<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                              type="number"
                              value={priceEntry.price}
                              onChange={(e) => handlePriceTableChange(index, 'price', e.target.value)}
                              required
                              className={`w-full px-3 py-2 bg-white rounded-lg border-2 outline-none transition-all duration-200 ${validationErrors[`price_${index}`] ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-orange-200 focus:border-orange-400"}`}
                            />
                          </div>
                        </div>
                        
                        {validationErrors[`price_${index}`] && (
                          <p className="text-red-500 text-xs mt-2">{validationErrors[`price_${index}`]}</p>
                        )}
                        
                        {formData.priceTable.length > 1 && (
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                            onClick={() => removePriceEntry(index)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={addPriceEntry}
                    className="flex items-center gap-2 px-4 py-2 text-orange-500 bg-orange-50 rounded-lg border-2 border-orange-200 hover:bg-orange-100 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" /> Add Price Entry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Amenities */}
          {currentStep === 4 && (
            <div className="p-8">
              <div className="flex items-center mb-6 text-orange-500">
                <PuzzlePieceIcon className="h-7 w-7 mr-2" />
                <Typography variant="h4" className="font-medium">
                  Amenities & Features
                </Typography>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-3">
                    Select all amenities that your boarding center offers:
                  </label>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    {availableAmenities.map((amenity) => (
                      <div 
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                          formData.amenities.includes(amenity)
                            ? "bg-orange-100 text-orange-700 border-2 border-orange-300 font-medium"
                            : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-orange-200"
                        }`}
                      >
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Add custom amenities if needed:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom amenity"
                      value={customAmenity}
                      onChange={(e) => setCustomAmenity(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white rounded-lg border-2 border-gray-200 outline-none transition-all duration-200 hover:border-orange-200 focus:border-orange-400"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomAmenity();
                        }
                      }}
                    />
                    <button 
                      type="button"
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      onClick={handleAddCustomAmenity}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {formData.amenities.length > 0 && (
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Selected Amenities:
                    </label>
                    <div className="flex flex-wrap gap-2 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                      {formData.amenities.map((amenity) => (
                        <div 
                          key={amenity}
                          className="flex items-center bg-orange-50 text-orange-800 px-3 py-1 rounded-full border border-orange-200"
                        >
                          <span className="mr-1">{amenity}</span>
                          <button
                            type="button"
                            onClick={() => handleAmenityToggle(amenity)}
                            className="ml-1 text-orange-600 hover:text-orange-800"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Photos */}
          {currentStep === 5 && (
            <div className="p-8">
              <div className="flex items-center mb-6 text-orange-500">
                <CameraIcon className="h-7 w-7 mr-2" />
                <Typography variant="h4" className="font-medium">
                  Photos
                </Typography>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700 text-sm mb-2">
                  Upload photos of your boarding center (up to 5 photos)
                </p>
                
                <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={formData.images.length >= 5}
                  />
                  <label 
                    htmlFor="file-upload"
                    className={`cursor-pointer flex flex-col items-center ${formData.images.length >= 5 ? 'opacity-50' : ''}`}
                  >
                    <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-700 mb-1 font-medium">
                      {formData.images.length >= 5 ? 'Maximum images reached' : 'Click to browse files'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: JPEG, PNG, WebP. Max 5 images.
                    </p>
                  </label>
                </div>
                
                {formData.images.length > 0 && (
                  <div>
                    <p className="text-gray-700 text-sm font-medium mb-3">
                      Preview ({formData.images.length}/5 images):
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden shadow-md h-32 border-2 border-gray-200">
                          <img 
                            src={image} 
                            alt={`Boarding center ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50"
                              onClick={() => removeImage(index)}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex">
                    <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-blue-700 font-medium">
                      Tips for great boarding center photos:
                    </p>
                  </div>
                  <ul className="ml-7 mt-2 text-sm text-blue-600 list-disc">
                    <li>Use bright, well-lit photos of your facility</li>
                    <li>Include images of pet play areas and accommodation</li>
                    <li>Show amenities and unique features</li>
                    <li>Upload clear, high-quality images (at least 800px wide)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation controls */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              onClick={() => currentStep === 1 ? navigate(-1) : changeStep('prev')}
              className="flex items-center gap-2 px-6 py-2.5 text-gray-600 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {currentStep === 1 ? (
                <span>Cancel</span>
              ) : (
                <>
                  <ArrowLeftIcon className="h-4 w-4" /> <span>Previous</span>
                </>
              )}
            </button>
            
            <div>
              {currentStep === totalSteps ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-6 py-2.5 text-white rounded-lg transition-colors ${
                    isSubmitting ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span>Add Boarding Center</span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => changeStep('next')}
                  className="flex items-center gap-2 px-6 py-2.5 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <span>Next</span> <ArrowRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
      
      <div className="mt-6 flex items-center text-gray-500">
        <p className="text-xs"><span className="text-red-500">*</span> Required field</p>
      </div>
    </div>
  );
} 