import { useState } from 'react'
import { PhotoIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'

const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function MatingForm() {
  const [formData, setFormData] = useState({
    parentName: '',
    petType: '',
    petBreed: '',
    contactNumber: '',
    appointmentDate: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    // Add your form submission logic here
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 mt-10"
      variants={formContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <motion.div variants={itemVariants} className="border-b border-gray-900/10 pb-12">
            <h2 className="text-3xl font-bold leading-7 text-gray-900">Mating & Breeding Form</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Please fill in the details for pet mating and breeding.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <motion.div variants={itemVariants} className="sm:col-span-1">
                <label htmlFor="petType" className="block text-sm font-medium leading-6 text-gray-900">Pet Type</label>
                <div className="mt-2">
                  <select
                    id="petType"
                    name="petType"
                    onChange={(e) => setFormData({...formData, petType: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  >
                    <option value="">Select type</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                  </select>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-1">
                <label htmlFor="petBreed" className="block text-sm font-medium leading-6 text-gray-900">Pet Breed</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="petBreed"
                    name="petBreed"
                    onChange={(e) => setFormData({...formData, petBreed: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-1">
                <label htmlFor="petGender" className="block text-sm font-medium leading-6 text-gray-900">Pet Gender</label>
                <div className="mt-2">
                  <select
                    id="petGender"
                    name="petGender"
                    onChange={(e) => setFormData({...formData, petGender: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-1">
                <label htmlFor="petAvailability" className="block text-sm font-medium leading-6 text-gray-900">Pet Availability</label>
                <div className="mt-2">
                  <select
                    id="petAvailability"
                    name="petAvailability"
                    onChange={(e) => setFormData({...formData, petAvailability: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  >
                    <option value="">Select availability</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Not available</option>
                  </select>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-2">
                <label htmlFor="petAge" className="block text-sm font-medium leading-6 text-gray-900">Pet Age</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="petAge"
                    name="petAge"
                    placeholder="e.g., 2 years"
                    onChange={(e) => setFormData({...formData, petAge: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-2">
                <label htmlFor="petQuality" className="block text-sm font-medium leading-6 text-gray-900">Pet Quality</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="petQuality"
                    name="petQuality"
                    onChange={(e) => setFormData({...formData, petQuality: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-2">
                <label htmlFor="petLineage" className="block text-sm font-medium leading-6 text-gray-900">Pet Lineage</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="petLineage"
                    name="petLineage"
                    onChange={(e) => setFormData({...formData, petLineage: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-2">
                <label htmlFor="breederName" className="block text-sm font-medium leading-6 text-gray-900">Breeder Name</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="breederName"
                    name="breederName"
                    onChange={(e) => setFormData({...formData, breederName: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-2">
                <label htmlFor="vaccination" className="block text-sm font-medium leading-6 text-gray-900">Vaccination</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="vaccination"
                    name="vaccination"
                    onChange={(e) => setFormData({...formData, vaccination: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write any additional information about your pet.</p>
              </motion.div>

              <motion.div variants={itemVariants} className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Pet Image</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-2">
                <label htmlFor="contactNumber" className="block text-sm font-medium leading-6 text-gray-900">Contact Number</label>
                <div className="mt-2">
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="col-span-full">
                <label htmlFor="shop-address" className="block text-sm font-medium leading-6 text-gray-900">Shop Address</label>
                <div className="mt-2">
                  <input
                    id="shop-address"
                    name="shop-address"
                    type="text"
                    autoComplete="street-address"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-6 flex items-center justify-end gap-x-6">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Submit for Mating
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  )
}