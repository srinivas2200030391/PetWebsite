import { useState } from 'react'
import { PhotoIcon,} from '@heroicons/react/20/solid'
import { Checkbox, Typography } from "@material-tailwind/react";
import {NumberInput} from "@heroui/react";

export default function Appointment() {
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
    <form onSubmit={handleSubmit} className="px-4 sm:px-0">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-lg p-4 sm:p-6 md:p-9 mt-10 sm:mt-20">
        <div className="space-y-8 sm:space-y-12">
          <div className="border-b border-gray-900/10 pb-8 sm:pb-12">
            <h2 className="text-xl sm:text-2xl font-semibold leading-7 text-gray-900">Product Data</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please fill in the details for your pet&#39;s appointment.
            </p>

            <div className="mt-6 sm:mt-10 grid grid-cols-1 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8 sm:grid-cols-2">
              {/* Pet Type */}
              <div className="sm:col-span-1">
                <label htmlFor="petType" className="block text-sm font-medium leading-6 text-gray-900">
                  Pet Type
                </label>
                <div className="mt-2">
                  <select
                    id="petType"
                    name="petType"
                    onChange={(e) => setFormData({...formData, petType: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  >
                    <option value="">Select type</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                  </select>
                </div>
              </div>

              {/* Pet Breed */}
              <div className="sm:col-span-1">
                <label htmlFor="petBreed" className="block text-sm font-medium leading-6 text-gray-900">
                  Pet Breed
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="petBreed"
                    name="petBreed"
                    onChange={(e) => setFormData({...formData, petBreed: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  />
                </div>
              </div>
              {/* Pet Gender */}
              <div className="sm:col-span-1">
                <label htmlFor="petGender" className="block text-sm font-medium leading-6 text-gray-900">
                  Pet Gender
                </label>
                <div className="mt-2">
                  <select
                    id="petGender"
                    name="petGender"
                    onChange={(e) => setFormData({...formData, petGender: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              {/* Pet availability */}
              <div className="sm:col-span-1">
                <label htmlFor="petAvailability" className="block text-sm font-medium leading-6 text-gray-900">
                  Pet Availability
                </label>
                <div className="mt-2">
                  <select
                    id="petAvailability"
                    name="petAvailability"
                    onChange={(e) => setFormData({...formData, petAvailability: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  >
                    <option value="">Select availability</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Not available</option>
                  </select>
                </div>
              </div>

              {/* Pet age */}
              <div className="sm:col-span-2">
                <label htmlFor="petAge" className="block text-sm font-medium leading-6 text-gray-900">
                  Pet Age 
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="petAge"
                    name="petAge"
                    onChange={(e) => setFormData({...formData, petAge: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  />
                </div>
              </div>
              {/* Pet Quality */}
              <div className="sm:col-span-2">
                <label htmlFor="petQuality" className="block text-sm font-medium leading-6 text-gray-900">
                  Pet Quality
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="petQuality"
                    name="petQuality"
                    onChange={(e) => setFormData({...formData, petQuality: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  />
                </div>
              </div>
              {/* Pet Linage */}
              <div className="sm:col-span-2">
                <label htmlFor="petLinage" className="block text-sm font-medium leading-6 text-gray-900">
                  Pet linage
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="petLinage"
                    name="petLinage"
                    onChange={(e) => setFormData({...formData, petLinage: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  />
                </div>
              </div>
              {/* Breeder */}
              <div className="sm:col-span-2">
                <label htmlFor="breederName" className="block text-sm font-medium leading-6 text-gray-900">
                   Breeder Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="breederName"
                    name="breederName"
                    onChange={(e) => setFormData({...formData, breederName: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  />
                </div>
              </div>
              {/* Vacinnatio */}
              <div className="sm:col-span-2">
                <label htmlFor="vaccination" className="block text-sm font-medium leading-6 text-gray-900">
                   Vaccination
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="vaccination"
                    name="vaccination"
                    onChange={(e) => setFormData({...formData, vaccination: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  />
                </div>
              </div>

               {/* Description */}
               <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  />
                </div>
                <p className="mt-2 sm:mt-3 text-sm leading-6 text-gray-600">Write any additional information about your pet.</p>
              </div>

               {/* Pet Image */}
               <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                Pet Image 
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-4 sm:px-6 py-6 sm:py-10">
                <div className="text-center">
                  <PhotoIcon aria-hidden="true" className="mx-auto size-10 sm:size-12 text-gray-300" />
                  <div className="mt-3 sm:mt-4 flex flex-wrap justify-center text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 py-2 px-2 min-h-[44px] touch-manipulation"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1 flex items-center">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-gray-600 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

               {/* Contact Number */}
              <div className="sm:col-span-2">
                <label htmlFor="contactNumber" className="block text-sm font-medium leading-6 text-gray-900">
                  Contact Number
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 sm:py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 min-h-[44px] touch-manipulation"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="col-span-full">
              <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
               Shop Address
              </label>
              <div className="mt-2">
                <input
                  id="street-address"
                  name="street-address"
                  type="text"
                  autoComplete="street-address"
                  className="block w-full rounded-md bg-white px-3 py-2.5 sm:py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 min-h-[44px] touch-manipulation"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-span-full mt-6">
              <button
                type="submit"
                className="w-full rounded-md bg-orange-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 min-h-[44px] active:scale-95 touch-manipulation"
              >
                Submit
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}