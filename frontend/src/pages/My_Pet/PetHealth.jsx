import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PetHealth = () => {
    const { petId } = useParams();
    const navigate = useNavigate();
    const [healthRecords, setHealthRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        petId: petId,
        Date: '',
        vaccine: '',
        from: '',
        end: '',
        validation: 'not validated',
        FE: '',
        Hospital: '',
        patient_id: ''
    });

    useEffect(() => {
        fetchHealthRecords();
    }, [petId]);

    const fetchHealthRecords = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/pethealth/getAll?petId=${petId}`);
            setHealthRecords(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching health records');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/pethealth/create', formData);
            setShowModal(false);
            fetchHealthRecords();
            setFormData({
                petId: petId,
                Date: '',
                vaccine: '',
                from: '',
                end: '',
                validation: 'not validated',
                FE: '',
                Hospital: '',
                patient_id: ''
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating health record');
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <br></br>
            <br></br>
            <br></br>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Pet Health Records</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    Add Health Record
                </button>
            </div>

            {/* Health Records Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validation</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FE</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {healthRecords.map((record) => (
                            <tr key={record._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(record.Date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{record.vaccine}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(record.from).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(record.end).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.validation === 'validated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {record.validation}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{record.FE}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{record.Hospital}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{record.patient_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Health Record Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Add Health Record</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    name="Date"
                                    value={formData.Date}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vaccine</label>
                                <input
                                    type="text"
                                    name="vaccine"
                                    value={formData.vaccine}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">From</label>
                                <input
                                    type="date"
                                    name="from"
                                    value={formData.from}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End</label>
                                <input
                                    type="date"
                                    name="end"
                                    value={formData.end}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">FE</label>
                                <input
                                    type="text"
                                    name="FE"
                                    value={formData.FE}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hospital</label>
                                <input
                                    type="text"
                                    name="Hospital"
                                    value={formData.Hospital}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                                <input
                                    type="text"
                                    name="patient_id"
                                    value={formData.patient_id}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetHealth;