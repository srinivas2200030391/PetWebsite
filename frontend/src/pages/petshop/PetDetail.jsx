import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PetDetail() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/aboutpet/pet/${petId}`);
        setPet(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!pet) return <div className="p-8 text-red-500">Pet not found</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-4">{pet.name}</h1>
      <img
        src={pet.images}
        alt={pet.name}
        className="w-full max-h-[400px] object-cover rounded mb-4"
      />
      <p><strong>Breed:</strong> {pet.breed}</p>
      <p><strong>Category:</strong> {pet.category}</p>
      <p><strong>Age:</strong> {pet.age}</p>
      <p><strong>Price:</strong> ${pet.price}</p>
      <p><strong>Description:</strong> {pet.details}</p>
      <p><strong>Group:</strong> {pet.group}</p>
      <p><strong>Gender:</strong> {pet.gender}</p>
      <p><strong>height:</strong> {pet.height}</p>
      <p><strong>Weight:</strong> {pet.weight}</p>
      <p><strong>Status:</strong> {pet.status}</p>
      <p><strong>lifeSpan:</strong> {pet.lifeSpan}</p>
      <p><strong>characteristics:</strong> {pet.characteristics}</p>
      

    </div>
  );
}
