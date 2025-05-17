import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "./../../config";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Carousel,
  Spinner,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function BoardingCenterDetail() {
  const { boardingId } = useParams();
  const navigate = useNavigate();
  const [boardingCenter, setBoardingCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (boardingId) {
      fetchBoardingCenterDetails();
    }
  }, [boardingId]);

  const fetchBoardingCenterDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.baseURL}/api/boarding/${boardingId}`);
      console.log("Boarding center data:", response.data);
      
      if (response.data && response.data.data) {
        setBoardingCenter(response.data.data);
      } else {
        throw new Error("Invalid response format from API");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching boarding center details:", error);
      setError("Failed to load boarding center details. Please try again later.");
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (boardingCenter && boardingCenter._id) {
      navigate(`/newboardingrequest?vendorId=${boardingCenter._id}`);
    } else {
      // Fallback if no ID is available
      navigate(`/newboardingrequest`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" color="orange" />
      </div>
    );
  }

  if (error || !boardingCenter) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography color="red" variant="h6">{error || "Could not load boarding center details"}</Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <Button
        variant="text"
        color="orange"
        className="flex items-center gap-2 mb-6"
        onClick={() => navigate(-1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Results
      </Button>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Boarding center images */}
        <div className="lg:w-1/2">
          <Card className="overflow-hidden">
            {boardingCenter.images && boardingCenter.images.length > 0 ? (
              <Carousel
                navigation={({ setActiveIndex, activeIndex, length }) => (
                  <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                    {new Array(length).fill("").map((_, i) => (
                      <span
                        key={i}
                        className={`block h-1 cursor-pointer rounded-2xl transition-all ${
                          activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                        }`}
                        onClick={() => setActiveIndex(i)}
                      />
                    ))}
                  </div>
                )}
                className="h-[300px] lg:h-[500px]"
              >
                {boardingCenter.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${boardingCenter.shopName} - image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ))}
              </Carousel>
            ) : (
              <div className="flex items-center justify-center bg-gray-100 h-[300px] lg:h-[500px]">
                <div className="text-center">
                  <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <Typography className="text-gray-500">No images submitted</Typography>
                </div>
              </div>
            )}
          </Card>
        </div>
        
        {/* Right side - Boarding center details */}
        <div className="lg:w-1/2">
          <Typography variant="h3" color="blue-gray" className="mb-2">
            {boardingCenter.shopName}
          </Typography>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-gray-700 text-sm">
              {boardingCenter.location || "Location not specified"}
            </span>
          </div>
          
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
            <TabsHeader>
              <Tab value="details">Details</Tab>
              <Tab value="pricing">Pricing</Tab>
              <Tab value="contact">Contact</Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel value="details">
                <Typography className="mb-4">
                  {boardingCenter.shopDescription || "No description available."}
                </Typography>
                
                <Typography variant="h6" className="mb-2">Pet Types</Typography>
                <div className="flex flex-wrap gap-2 mb-4">
                  {boardingCenter.petTypes && boardingCenter.petTypes.length > 0 ? (
                    boardingCenter.petTypes.map((petType, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-sm">
                        {petType}
                      </span>
                    ))
                  ) : (
                    <Typography className="text-gray-500 italic">No pet types specified</Typography>
                  )}
                </div>
                
                <Typography variant="h6" className="mb-2">Amenities</Typography>
                <div className="flex flex-wrap gap-2 mb-4">
                  {boardingCenter.amenities && boardingCenter.amenities.length > 0 ? (
                    boardingCenter.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))
                  ) : (
                    <Typography className="text-gray-500 italic">No amenities specified</Typography>
                  )}
                </div>
                
                <Typography variant="h6" className="mb-2">Business Hours</Typography>
                <Typography className="mb-4">
                  {boardingCenter.businessHours || "Not specified"}
                </Typography>
                
                <Button 
                  color="orange" 
                  className="mt-4"
                  onClick={handleApplyClick}
                >
                  Apply for Boarding
                </Button>
              </TabPanel>
              
              <TabPanel value="pricing">
                <Typography variant="h6" className="mb-4">Pricing Table (Daily Rates)</Typography>
                
                {boardingCenter.priceTable && boardingCenter.priceTable.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 border-b text-left font-medium text-gray-700">S.No</th>
                          <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Pet Type</th>
                          <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Breed</th>
                          <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Size</th>
                          <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Age</th>
                          <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Price/Day (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boardingCenter.priceTable.map((config, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                            <td className="py-3 px-4 border-b">{index + 1}</td>
                            <td className="py-3 px-4 border-b">{config.petType || "Not specified"}</td>
                            <td className="py-3 px-4 border-b">{config.breed || "Any"}</td>
                            <td className="py-3 px-4 border-b">{config.size || "Any"}</td>
                            <td className="py-3 px-4 border-b">{config.age || "Any"}</td>
                            <td className="py-3 px-4 border-b font-medium">₹{config.price || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Typography className="text-gray-500 italic mb-4">No pricing information available</Typography>
                )}
                
                <Button 
                  color="orange" 
                  className="mt-6"
                  onClick={handleApplyClick}
                >
                  Apply for Boarding
                </Button>
              </TabPanel>
              
              <TabPanel value="contact">
                <div className="space-y-4">
                  <div>
                    <Typography variant="h6" className="mb-1">Owner Name</Typography>
                    <Typography>{boardingCenter.ownerName || "Not specified"}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="h6" className="mb-1">Email</Typography>
                    <Typography>{boardingCenter.contactEmail || "Not available"}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="h6" className="mb-1">Phone</Typography>
                    <Typography>{boardingCenter.contactPhone || "Not available"}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="h6" className="mb-1">Address</Typography>
                    <Typography>{boardingCenter.address || "Not available"}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="h6" className="mb-1">Location</Typography>
                    <Typography>{boardingCenter.location || "Not available"}</Typography>
                  </div>
                </div>
                
                <Button 
                  color="orange" 
                  className="mt-6"
                  onClick={handleApplyClick}
                >
                  Apply for Boarding
                </Button>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 