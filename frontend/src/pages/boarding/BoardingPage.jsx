import { Typography } from '@material-tailwind/react'
import { useState } from 'react'
import {DatePicker} from "@heroui/react";
import { Link } from 'react-router-dom'



const BoardingShop = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const placements = ["outside-left"];

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="pt-20">
      <div className="container mx-auto">
        <Typography variant="h2" className="text-center mb-8">
          Pet Boarding Locations
        </Typography>
      </div>

      <div className="bg-gradient-to-r from-orange-300 to-orange-100 rounded-lg shadow-md w-[90%] md:w-[80%] lg:w-[100%] h-[150px] md:h-[200px] lg:h-[350px] mx-auto my-8"> 
      <div className="max-w-2xl mx-auto flex flexy-col items-center justify-center h-full">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search for boarding locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
            />
            <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
          {placements.map((placement) => (
            <DatePicker
              key={placement}
              className="max-w-[284px]"
            />
          ))}
        </div>
      </div>
    </div>
            <Link to="/boardingshopfilter" className="text-gray-900 hover:text-orange-400">
             <button
              type="submit"
              className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
            >
              Search
            </button>
            </Link>
          </form>
        </div>
        
      </div>
    </div>
  ) 
}

export default BoardingShop