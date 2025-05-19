import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PetDetails = () => {
    const { petId } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/mypet/pet/${petId}`);
                setPet(response.data.data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching pet details');
                setLoading(false);
            }
        };

        fetchPetDetails();
    }, [petId]);

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    if (!pet) return <div className="flex justify-center items-center min-h-screen">Pet not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <br></br>
            <br></br>
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img
                            className="h-48 w-full object-cover md:h-full md:w-48"
                            src={pet.profilePic}
                            alt={pet.petName}
                        />
                    </div>
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{pet.petName}</h1>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Display Name:</p>
                                <p className="font-semibold">{pet.displayName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Age:</p>
                                <p className="font-semibold">{pet.age} years</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Breed:</p>
                                <p className="font-semibold">{pet.breedName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Breed Lineage:</p>
                                <p className="font-semibold">{pet.breedLineage}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Category:</p>
                                <p className="font-semibold">{pet.category}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Weight:</p>
                                <p className="font-semibold">{pet.weight} kg</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Height:</p>
                                <p className="font-semibold">{pet.height} cm</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Gender:</p>
                                <p className="font-semibold">{pet.gender}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={() => navigate(`/pet-health/${pet._id}`)}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                View Pet Health
                            </button>
                            <button
                                onClick={() => navigate('/my-pets')}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Back to My Pets
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetails;