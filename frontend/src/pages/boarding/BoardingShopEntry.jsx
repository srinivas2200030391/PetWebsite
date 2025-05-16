import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Typography,
  Card,
  Input,
  Button,
  Select,
  Option,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, MapPinIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import axios from 'axios';
import config from './../../config';
import BoardingShops from './BoardingShops'

export default function BoardingShopEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [petTypes, setPetTypes] = useState([
    { value: 'all', label: 'All Pets' },
    { value: 'dogs', label: 'Dogs' },
    { value: 'cats', label: 'Cats' },
    { value: 'birds', label: 'Birds' },
    { value: 'small-pets', label: 'Small Pets' }
  ]);

  useEffect(() => {
    fetchLocations();
    
    // Parse query parameters if any
    const queryParams = new URLSearchParams(location.search);
    const locationParam = queryParams.get("location");
    const searchParam = queryParams.get("search");
    const typeParam = queryParams.get("type");
    
    if (locationParam) setSelectedLocation(locationParam);
    if (searchParam) setSearchQuery(searchParam);
    if (typeParam) setActiveTab(typeParam);
  }, [location.search]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/vendor/locations`)
        .catch(err => {
          console.error("API error:", err);
          return { data: null }; // Return a structured response even on error
        });
      
      // If the API doesn't exist yet or returns no locations, use fallback data
      if (!response.data || response.data.length === 0) {
        setLocations(['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']);
      } else {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Fallback locations if API fails
      setLocations(['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateUrlParams();
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    
    // Small delay to allow tab state to update before updating URL
    setTimeout(() => {
      updateUrlParams();
    }, 10);
  };

  const updateUrlParams = () => {
    const params = new URLSearchParams();
    
    if (selectedLocation) params.append('location', selectedLocation);
    if (searchQuery) params.append('search', searchQuery);
    if (activeTab && activeTab !== 'all') params.append('type', activeTab);
    
    navigate(`/boarding?${params.toString()}`);
  };

  return (
    <div className="bg-white pt-16">
      {/* Hero section with description */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-12">
        <div className="container mx-auto px-4">
          <Typography variant="h2" className="text-center mb-6">
            Pet Boarding Services
          </Typography>
          
          <div className="max-w-3xl mx-auto text-center mb-8">
            <Typography className="text-gray-700">
              Find the perfect boarding solution for your pet while you're away. Our partner facilities offer premium care, 
              comfortable accommodations, and experienced staff to ensure your pet feels at home. Browse through our selection 
              of trusted boarding centers and book with confidence.
            </Typography>
          </div>
          
          {/* Search and filter section */}
          <Card className="p-4 max-w-4xl mx-auto shadow-lg">
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    label="Search boarding centers"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
                </div>
                <div className="md:w-64">
                  <Select
                    label="Select Location"
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    icon={<MapPinIcon className="h-5 w-5" />}
                  >
                    <Option value="">All Locations</Option>
                    {locations.map((location, index) => (
                      <Option key={index} value={location}>{location}</Option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <TabsHeader>
                    {petTypes.map(({ value, label }) => (
                      <Tab key={value} value={value} className="whitespace-nowrap w-full px-4 py-2">
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
                
                <Button type="submit" color="orange">
                  Find Boarding
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
      

      
      {/* Featured boarding centers */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <Typography variant="h4" className="font-bold">
            {selectedLocation ? `Boarding in ${selectedLocation}` : 'All Boarding Centers'}
            {searchQuery && <span className="text-sm font-normal ml-2">matching "{searchQuery}"</span>}
          </Typography>
          
          {(selectedLocation || searchQuery || activeTab !== 'all') && (
            <Button 
              variant="text" 
              color="blue-gray" 
              className="flex items-center gap-2"
              onClick={() => {
                setSelectedLocation('');
                setSearchQuery('');
                setActiveTab('all');
                navigate('/boarding');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Boarding shops list component */}
        <BoardingShops /> 
      </div>
      
      {/* Pet boarding benefits section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Typography variant="h4" className="text-center mb-10">
            Benefits of Professional Pet Boarding
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Typography variant="h5" color="blue-gray" className="mb-4">
                24/7 Supervision
              </Typography>
              <Typography>
                Professional staff available around the clock to ensure your pet's safety and address any needs that arise.
              </Typography>
            </Card>
            
            <Card className="p-6">
              <Typography variant="h5" color="blue-gray" className="mb-4">
                Exercise & Socialization
              </Typography>
              <Typography>
                Regular playtime and interaction with caregivers and other pets keeps your furry friend happy and engaged.
              </Typography>
            </Card>
            
            <Card className="p-6">
              <Typography variant="h5" color="blue-gray" className="mb-4">
                Comfortable Accommodations
              </Typography>
              <Typography>
                Clean, spacious, and comfortable living spaces designed specifically for pets' needs and comfort.
              </Typography>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Second CTA at the bottom of the page */}
      <div className="bg-orange-50 py-10 border-t border-orange-100">
        <div className="container mx-auto px-4 text-center">
          <Typography variant="h4" color="blue-gray" className="mb-4">
            Join Our Network of Professional Pet Boarding Centers
          </Typography>
          <Typography className="max-w-2xl mx-auto mb-6 text-gray-700">
            Become part of our trusted community of pet boarding centers and grow your business. 
            Our platform connects you with pet owners looking for reliable boarding services.
          </Typography>
          <Link to="/add-boarding">
            <Button 
              size="lg"
              color="orange"
              className="shadow-md hover:shadow-lg"
            >
              Register Your Boarding Center Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
