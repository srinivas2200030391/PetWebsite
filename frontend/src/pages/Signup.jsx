import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthstore';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error('Full name is required');
    if (!formData.email.trim()) return toast.error('Email is required');
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Invalid email format');
    if (!formData.password) return toast.error('Password is required');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sucess = validateForm();
    if(sucess === true){
      
     signup(formData);
    navigate('/home');
    }
    
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-md flex-grow">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Signup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 mt-10">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-900">
              Full Name
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              required
              className="block w-full rounded-md px-3 py-1.5 text-gray-900 outline-gray-300 focus:outline-indigo-600"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full rounded-md px-3 py-1.5 text-gray-900 outline-gray-300 focus:outline-indigo-600"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-md px-3 py-1.5 text-gray-900 outline-gray-300 focus:outline-indigo-600"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-indigo-600"
            disabled={isSigningUp}
          >
            {isSigningUp ? 'Signing up...' : 'Signup'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
