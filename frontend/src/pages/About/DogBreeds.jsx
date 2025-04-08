import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoChevronBack } from "react-icons/io5";
import config from "../../config";

const DogBreeds = () => {
  const { item } = useParams();
  const navigate = useNavigate();
  const [animalData, setAnimalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductData();
  }, [item]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      // capitalize first letter of item
      //const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1);
      const response = await axios.get(
        `${config.baseURL}/api/aboutpet/get${item}breeds`
        // {
        //   withCredentials: true,
        // }
      );

      if (response.status === 200) {
        setAnimalData(response.data);
      }
    } catch (error) {
      console.error("Error fetching breeds:", error);
      setError("Failed to load breed data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mt-20 px-4 py-6 shadow-sm fixed top-0 w-full bg-white z-50">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100">
          <IoChevronBack size={25} className="text-indigo-600" />
        </button>
        <h1 className="text-2xl font-bold text-indigo-600">
          {item?.toUpperCase()} BREEDS
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animalData.map((breed, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold text-indigo-600">{breed}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DogBreeds;
