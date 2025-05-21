import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const MyPet = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [petData, setPetData] = useState({
        profilePic: '',
        petName: '',
        displayName: '',
        age: '',
        breedName: '',
        breedLineage: '',
        weight: '',
        height: '',
        category: 'Dog',
        gender: 'Male' // Add this line
    });
    const [preview, setPreview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const storedUserData = localStorage.getItem('user');
    const parsedData = storedUserData ? JSON.parse(storedUserData) : null;
    const userId = parsedData?.data?._id || null;

    useEffect(() => {
        if (!userId) {
            setMessage('User not found. Please login again.');
            setMessageType('error');
            return;
        }
        fetchUserPets();
    }, [userId]);

    const fetchUserPets = async () => {
        try {
            const storedUserData = localStorage.getItem('user');
            const parsedData = JSON.parse(storedUserData);
            
            // Add these debug logs
            console.log('User data:', parsedData);
            console.log('User ID:', parsedData.data._id);

            const response = await axios.get(
                `http://localhost:8000/api/mypet/user/${parsedData.data._id}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Pets response:', response.data);
            
            if (response.data.success) {
                setPets(response.data.data);
            } else {
                setMessage(response.data.message || 'Failed to fetch pets');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error fetching pets:', error.response || error);
            setMessage(error.response?.data?.message || 'Error fetching pets');
            setMessageType('error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPetData(prev => ({
                    ...prev,
                    profilePic: reader.result
                }));
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                ...petData,
                userId: parsedData.data._id // Use the correct path to userId
            };

            if (isEditing) {
                await axios.put(
                    `http://localhost:8000/api/mypet/update/${petData._id}`,
                    formData,
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                setMessage('Pet updated successfully!');
            } else {
                await axios.post(
                    `http://localhost:8000/api/mypet/create`,
                    formData,
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                setMessage('Pet created successfully!');
            }
            setMessageType('success');
            fetchUserPets();
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            setMessage(error.response?.data?.message || 'Error saving pet profile');
            setMessageType('error');
        }
    };

    const handleDelete = async (petId) => {
        if (window.confirm('Are you sure you want to delete this pet profile?')) {
            try {
                await axios.delete(`http://localhost:8000/api/mypet/delete/${petId}`);
                setMessage('Pet deleted successfully!');
                setMessageType('success');
                fetchUserPets();
            } catch (error) {
                setMessage(error.response?.data?.message || 'Error deleting pet');
                setMessageType('error');
            }
        }
    };

    const handleEdit = (pet) => {
        setPetData(pet);
        setPreview(pet.profilePic);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleCardClick = (petId) => {
        navigate(`/my-pets/${petId}`); // Add leading slash here
    };

    const resetForm = () => {
        setPetData({
            profilePic: '',
            petName: '',
            displayName: '',
            age: '',
            breedName: '',
            breedLineage: '',
            weight: '',
            height: '',
            category: 'Dog',
            gender: 'Male' // Add this line
        });
        setPreview(null);
        setShowModal(false);
        setIsEditing(false);
    };

    return (
        <>
            <div className="mt-16 relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-xl lg:max-w-lg"
                        >
                            <h2 className="text-4xl font-semibold tracking-tight text-white">Add Your Pet</h2>
                            <p className="mt-4 text-lg text-gray-300">
                                Subscribe to receive weekly tips on pet care, latest updates on pet health, and exclusive offers for your furry friends.
                            </p>
                            <div className="mt-6 flex max-w-md gap-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setIsEditing(false);
                                        setShowModal(true);
                                    }}
                                    type="submit"
                                    className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                    Add New Pet
                                </motion.button>
                            </div>
                        </motion.div>
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                            <motion.div 
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-col items-start"
                            >
                                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    <CalendarDaysIcon aria-hidden="true" className="h-6 w-6 text-white" />
                                </div>
                                <dt className="mt-4 text-base font-semibold text-white">Weekly Pet Care Tips</dt>
                                <dd className="mt-2 text-base/7 text-gray-400">
                                    Get expert advice on pet care, training tips, and health guidance delivered to your inbox.
                                </dd>
                            </motion.div>
                            <motion.div 
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-col items-start"
                            >
                                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    <HandRaisedIcon aria-hidden="true" className="h-6 w-6 text-white" />
                                </div>
                                <dt className="mt-4 text-base font-semibold text-white">Exclusive Benefits</dt>
                                <dd className="mt-2 text-base/7 text-gray-400">
                                    Members receive special discounts on pet supplies and priority access to our services.
                                </dd>
                            </motion.div>
                        </dl>
                    </div>
                </div>
                <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                    />
                </div>
            </div>

            <div className="container mx-auto mt-20 px-4 py-8">
                <AnimatePresence mode="wait">
                    {message && (
                        <motion.p 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className={`text-center mt-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-500'}`}
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showModal && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        >
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]"
                            >
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-800" 
                                    onClick={() => setShowModal(false)}
                                >
                                    ✕
                                </motion.button>
                                <motion.h2 
                                    initial={{ y: -20 }}
                                    animate={{ y: 0 }}
                                    className="text-2xl font-medium mb-4 text-center"
                                >
                                    {isEditing ? 'Edit Pet' : 'Register a New Pet'}
                                </motion.h2>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required={!isEditing}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <input
                                        type="text"
                                        name="petName"
                                        placeholder="Pet Name"
                                        value={petData.petName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="displayName"
                                        placeholder="Display Name"
                                        value={petData.displayName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="Age"
                                        value={petData.age}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="breedName"
                                        placeholder="Breed Name"
                                        value={petData.breedName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="breedLineage"
                                        placeholder="Breed Lineage"
                                        value={petData.breedLineage}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="number"
                                        name="weight"
                                        placeholder="Weight (kg)"
                                        value={petData.weight}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="number"
                                        name="height"
                                        placeholder="Height (cm)"
                                        value={petData.height}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    />
                                    <select
                                        name="category"
                                        value={petData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    >
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <select
                                        name="gender"
                                        value={petData.gender}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {preview && (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="mt-4 w-40 h-40 object-cover rounded-lg"
                                        />
                                    )}
                                    <button
                                        type="submit"
                                        className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                    >
                                        {isEditing ? 'Update Pet' : 'Register Pet'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-medium mb-4"
                >
                    Your Pets
                </motion.h2>

                {pets.length === 0 ? (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        No pets found.
                    </motion.p>
                ) : (
                    <motion.div 
                        layout
                        className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {pets.map((pet) => (
                                <motion.div
                                    layout
                                    key={pet._id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{
                                        layout: { duration: 0.3 },
                                        scale: { type: "spring", stiffness: 300 }
                                    }}
                                    onClick={() => handleCardClick(pet._id)}
                                    className="py-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                                >
                                    <div className="pb-0 pt-2 px-4 flex flex-col items-start">
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm uppercase font-bold text-gray-600"
                                        >
                                            {pet.category}
                                        </motion.p>
                                        <motion.h4 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="font-bold text-xl"
                                        >
                                            {pet.petName}
                                        </motion.h4>
                                        <motion.small 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-gray-500"
                                        >
                                            {pet.breedName}
                                        </motion.small>
                                    </div>
                                    <div className="overflow-visible py-2 px-4">
                                        {pet.profilePic ? (
                                            <motion.img
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                src={pet.profilePic}
                                                alt={pet.petName}
                                                className="w-full h-48 object-cover rounded-xl"
                                            />
                                        ) : (
                                            <motion.div 
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center"
                                            >
                                                <span className="text-gray-400">No Image</span>
                                            </motion.div>
                                        )}
                                        <div className="mt-4 flex justify-between items-center">
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-gray-600"
                                            >
                                                {pet.age} years • {pet.gender}
                                            </motion.p>
                                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleEdit(pet)}
                                                    className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                                                >
                                                    <span className="sr-only">Edit</span>
                                                    ✏️
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDelete(pet._id)}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <span className="sr-only">Delete</span>
                                                    🗑️
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default MyPet;