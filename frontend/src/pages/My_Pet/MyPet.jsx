import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    const userId = storedUserData ? JSON.parse(storedUserData).data.id : null;

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
            const response = await axios.get(`http://localhost:8000/api/mypet/user/${userId}`);
            setPets(response.data.data);
        } catch (error) {
            console.error('Error fetching pets:', error);
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
                userId: userId
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
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Create Pet Profile</h2>

            <div className="text-center mb-6">
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setShowModal(true);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Register My Pet
                </button>
            </div>

            {message && (
                <p className={`text-center mt-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
                        <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-800" onClick={() => setShowModal(false)}>✕</button>
                        <h2 className="text-2xl font-medium mb-4 text-center">{isEditing ? 'Edit Pet' : 'Register a New Pet'}</h2>
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
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-medium mt-8 mb-4">Your Pets</h2>
            {pets.length === 0 ? (
                <p className="text-center">No pets found.</p>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {pets.map((pet) => (
                        <div
                            key={pet._id}
                            onClick={() => handleCardClick(pet._id)}
                            className="p-4 border border-gray-300 rounded-xl bg-white shadow-md flex flex-col items-center text-center hover:scale-105 hover:shadow-lg cursor-pointer transition-all duration-200"
                        >
                            {pet.profilePic && (
                                <img
                                    src={pet.profilePic}
                                    alt={pet.petName}
                                    className="w-32 h-32 object-cover rounded-full border mb-4"
                                />
                            )}
                            <h3 className="text-xl font-bold">{pet.petName}</h3>
                            <p className="text-gray-600">Display Name: {pet.displayName}</p>
                            <p className="text-gray-600">Age: {pet.age}</p>
                            <p className="text-gray-600">Breed: {pet.breedName}</p>
                            <p className="text-gray-600">Breed Lineage: {pet.breedLineage}</p>
                            <p className="text-gray-600">Category: {pet.category}</p>
                            <p className="text-gray-600">Weight: {pet.weight} kg</p>
                            <p className="text-gray-600">Height: {pet.height} cm</p>
                            <p className="text-gray-600">Gender: {pet.gender}</p>
                            <div className="mt-4 flex gap-2" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => handleEdit(pet)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(pet._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPet;