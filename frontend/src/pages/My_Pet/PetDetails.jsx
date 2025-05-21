import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, HeartIcon, BeakerIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';

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

    if (loading) return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center min-h-screen"
        >
            Loading...
        </motion.div>
    );
    
    if (error) return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center min-h-screen text-red-500"
        >
            {error}
        </motion.div>
    );
    
    if (!pet) return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center min-h-screen"
        >
            Pet not found
        </motion.div>
    );

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-10 px-8"
        >
            {/* Hero Section with Pet Info */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto mt-8 mb-10"
            >
                <motion.div 
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                >
                    <div className="md:flex">
                        <motion.div 
                            className="md:flex-shrink-0"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.img
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="h-64 w-full object-cover md:h-full md:w-64"
                                src={pet.profilePic}
                                alt={pet.petName}
                            />
                        </motion.div>
                        <motion.div 
                            className="p-8"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="mb-6">
                                <motion.p 
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-sm uppercase font-bold text-indigo-600"
                                >
                                    {pet.category}
                                </motion.p>
                                <motion.h1 
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-3xl font-bold text-gray-900"
                                >
                                    {pet.petName}
                                </motion.h1>
                                <motion.p 
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-lg text-gray-500"
                                >
                                    {pet.breedName}
                                </motion.p>
                            </div>
                            
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-2 gap-4 mb-6"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gray-50 p-4 rounded-lg"
                                >
                                    <p className="text-gray-500">Age</p>
                                    <p className="text-lg font-semibold">{pet.age} years</p>
                                </motion.div>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gray-50 p-4 rounded-lg"
                                >
                                    <p className="text-gray-500">Gender</p>
                                    <p className="text-lg font-semibold">{pet.gender}</p>
                                </motion.div>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gray-50 p-4 rounded-lg"
                                >
                                    <p className="text-gray-500">Weight</p>
                                    <p className="text-lg font-semibold">{pet.weight} kg</p>
                                </motion.div>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gray-50 p-4 rounded-lg"
                                >
                                    <p className="text-gray-500">Height</p>
                                    <p className="text-lg font-semibold">{pet.height} cm</p>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
                className="container mx-auto grid lg:gap-x-8 gap-y-8 grid-cols-1 lg:grid-cols-2"
            >
                {/* Health Card */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                    <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-md bg-green-100 p-2 w-fit"
                    >
                        <HeartIcon className="h-6 w-6 text-green-600" />
                    </motion.div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">Health Tracking</h3>
                    <p className="mt-2 text-gray-600">
                        Monitor vaccinations, medical history, and upcoming vet appointments.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/pet-health/${pet._id}`)}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        View Health Records
                    </motion.button>
                </motion.div>

                {/* Care Schedule Card */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                    <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-md bg-blue-100 p-2 w-fit"
                    >
                        <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
                    </motion.div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">Care Schedule</h3>
                    <p className="mt-2 text-gray-600">
                        Keep track of feeding times, walks, and grooming appointments.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/schedule')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        View Schedule
                    </motion.button>
                </motion.div>

                {/* Nutrition Card */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                    <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-md bg-purple-100 p-2 w-fit"
                    >
                        <BeakerIcon className="h-6 w-6 text-purple-600" />
                    </motion.div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">Nutrition & Diet</h3>
                    <p className="mt-2 text-gray-600">
                        Manage diet plans and track nutritional requirements.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/nutrition')}
                        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                        View Diet Plan
                    </motion.button>
                </motion.div>

                {/* Toys & Enrichment Card */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                    <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-md bg-orange-100 p-2 w-fit"
                    >
                        <PuzzlePieceIcon className="h-6 w-6 text-orange-600" />
                    </motion.div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">Toys & Enrichment</h3>
                    <p className="mt-2 text-gray-600">
                        Discover recommended toys and activities for mental stimulation.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/toys')}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Browse Toys
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Navigation */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="container mx-auto mt-8 flex justify-center"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/my-pets')}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Back to My Pets
                </motion.button>
            </motion.div>
        </motion.section>
    );
};

export default PetDetails;