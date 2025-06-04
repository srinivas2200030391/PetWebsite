import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";

const Breeds = () => {
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
      const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1);
      const response = await axios.get(
        `${config.baseURL}/api/aboutpet/${capitalizedItem}`
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
  const handleBreedClick = (breed) => {
    navigate(`/pet/breeds/${encodeURIComponent(breed.toLowerCase())}`);
  };
  return (
    <div className="flex flex-col items-center justify-center bg-white">

      {/* Content */}
      <div className="container mx-auto px-4 mt-28 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animalData.map((breed, index) => (
            <div
              key={index}
              onClick={() => handleBreedClick(breed)}
              className="bg-gradient-to-br from-pink-100 via-white to-indigo-100 rounded-2xl shadow-xl p-6 transition-transform transform hover:-translate-y-2 hover:scale-105 duration-300 ease-in-out">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-2xl font-semibold text-indigo-700">
                    {breed.charAt(0)}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-indigo-700 text-center mb-2">
                {breed}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                Explore the charm of the {breed} breed, darling 🐾✨
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Breeds;
