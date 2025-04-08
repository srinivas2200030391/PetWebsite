import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { IoChevronBack } from "react-icons/io5";

export default function BreedDetailPage() {
  const { item } = useParams();
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPetsByBreed();
  }, [item]);
  const fetchPetsByBreed = async () => {
    let cleanBreedId = decodeURIComponent(item); // handles %20 and other encoded characters
    const formatBreedId = (id) => {
      return id
        .trim() // remove leading/trailing spaces 💅
        .replace(/%20/g, " ") // just in case %20 slipped in 🥲
        .split(/\s+/) // split on any amount of space, darling
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // elegant touch 💃
        )
        .join(" ");
    };

    cleanBreedId = formatBreedId(cleanBreedId);

    console.log("cleanBreedId", cleanBreedId);
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.baseURL}/api/aboutpet/getpetbybreed/${cleanBreedId}`
      );
      if (response.status === 200) setPets(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-indigo-700">
          Loading pets, sweetheart... 🐾
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

      {pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No pets found for this breed, love 🥺</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden mt-48">
              <div className="relative h-32 w-full flex justify-center items-center">
                {pet.images?.[0] && (
                  <img
                    src={pet.images[0]}
                    alt={`${pet.breed} pet`}
                    className="w-[200px] h-[200px] object-cover rounded-md"
                  />
                )}
              </div>

              <div className="p-10">
                <h2 className="text-xl font-bold text-indigo-700 mb-2">
                  {pet.breed}
                </h2>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Group:</span> {pet.group}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>{" "}
                    {pet.category}
                  </div>
                  <div>
                    <span className="font-medium">Height:</span> {pet.height}
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span> {pet.weight}
                  </div>
                  <div>
                    <span className="font-medium">Life Span:</span>{" "}
                    {pet.lifeSpan}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {pet.details}
                </div>

                <button
                  onClick={() => navigate(`/pets/${pet._id}`)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
