import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config"

const MatingPetsList = () => {
  const [matingPets, setMatingPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatingPets = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/api/matingpets/all`, {
          withCredentials: true,
        });
        setMatingPets(response.data);
      } catch (error) {
        console.error("Error fetching mating pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatingPets();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Mating Pets</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matingPets.map((pet) => (
          <div key={pet._id} className="border rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-semibold">{pet.breedName} ({pet.category})</h3>
            <p>Gender: {pet.gender}</p>
            <p>Age: {pet.age}</p>
            <p>Quality: {pet.petQuality}</p>
            <p>Price: ₹{pet.price}</p>
            <p>Location: {pet.location}</p>
            <p>Vendor: {pet.vendor?.name || "Unknown"}</p>

            {pet.photosAndVideos && pet.photosAndVideos.length > 0 && (
              <img
                src={pet.photosAndVideos[0]}
                alt={`${pet.breedName}`}
                className="w-full h-40 object-cover mt-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatingPetsList;
