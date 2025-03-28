import { useState } from 'react'
import { PhotoIcon,} from '@heroicons/react/20/solid'
import { Checkbox, Typography } from "@material-tailwind/react";


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
    <form onSubmit={handleSubmit}>
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-lg p-9 mt-20">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">Pet Appointment</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please fill in the details for your pet&#39;s appointment.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="parentName" className="block text-sm font-medium leading-6 text-gray-900">
                  Pet Parent Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="parentName"
                    name="parentName"
                    placeholder="Parent's name"
                    onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Pet age */}
              <div className="sm:col-span-2">
                <label htmlFor="parentName" className="block text-sm font-medium leading-6 text-gray-900">
                  Pet Age 
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="parentName"
                    name="parentName"
                    onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write any additional information about your pet.</p>
              </div>

               {/* Pet Image */}
               <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                Pet Image 
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>


              {/* Parent Aadhar */}
              <div className="sm:col-span-2">
                <label htmlFor="parentName" className="block text-sm font-medium leading-6 text-gray-900">
                  Parent Aadhar Number
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="parentName"
                    name="parentName"
                    placeholder="0000-0000-0000"
                    onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
                {/* Appointment Date */}
                <div className="sm:col-span-1">
                <label htmlFor="appointmentDate" className="block text-sm font-medium leading-6 text-gray-900">
                  From Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>  

              {/* Appointment Date */}
              <div className="sm:col-span-1">
                <label htmlFor="appointmentDate" className="block text-sm font-medium leading-6 text-gray-900">
                  To Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
               {/* Contact Number */}
              <div className="sm:col-span-1">
                <label htmlFor="contactNumber" className="block text-sm font-medium leading-6 text-gray-900">
                  Contact Number
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="col-span-full">
              <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                Address
              </label>
              <div className="mt-2">
                <input
                  id="street-address"
                  name="street-address"
                  type="text"
                  autoComplete="street-address"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                State 
              </label>
              <div className="mt-2">
                <input
                  id="region"
                  name="region"
                  type="text"
                  autoComplete="address-level1"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  id="postal-code"
                  name="postal-code"
                  type="text"
                  autoComplete="postal-code"
                  placeholder='000-000'
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
             
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-10">
        <Checkbox
      label={
        <Typography color="blue-gray" className="flex font-medium">
          I agree with the
          <Typography
            as="a"
            href="#"
            color="blue"
            className="font-medium transition-colors hover:text-blue-700"
          >
            &nbsp;terms and conditions
          </Typography>
          .
        </Typography>
      }
    />
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </form>
  )
}