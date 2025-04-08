import { useState } from 'react';
import PropTypes from 'prop-types'; // Add this import


const ProductOverview = () => {
  const [selectedSize, setSelectedSize] = useState('SM');
  
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img 
            alt="ecommerce" 
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" 
            src="https://dummyimage.com/400x400" 
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">The Catcher in the Rye</h1>
            
            {/* Reviews Section */}
            <div className="flex mb-4">
              <span className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} fill={index < 4 ? "currentColor" : "none"} stroke="currentColor" 
                       className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                ))}
                <span className="text-gray-600 ml-3">4 Reviews</span>
              </span>
              
              {/* Social Share Buttons */}
              <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
                {['Facebook', 'Twitter', 'Message'].map((social) => (
                  <button key={social} className="text-gray-500 ml-2">
                    <SocialIcon type={social} />
                  </button>
                ))}
              </span>
            </div>

            <p className="leading-relaxed">
              Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY.
            </p>

            {/* Product Options */}
            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              <div className="flex">
                <span className="mr-3">Color</span>
                {['white', 'gray-700', 'indigo-500'].map((color) => (
                  <button 
                    key={color}
                    className={`border-2 border-gray-300 ml-1 ${color !== 'white' ? `bg-${color}` : ''} rounded-full w-6 h-6 focus:outline-none`}
                  />
                ))}
              </div>
              
              {/* Size Selector */}
              <div className="flex ml-6 items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10"
                  >
                    {['SM', 'M', 'L', 'XL'].map(size => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                  <DropdownArrow />
                </div>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">$58.00</span>
              <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                Add to Cart
              </button>
              <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                <HeartIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper Components
const DropdownArrow = () => (
  <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6"></path>
    </svg>
  </span>
);

const HeartIcon = () => (
  <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
  </svg>
);

const SocialIcon = ({ type }) => {
  const icons = {
    Facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
    Twitter: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
    Message: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
  };

  return (
    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
      <path d={icons[type]}></path>
    </svg>
  );
};

SocialIcon.propTypes = {
  type: PropTypes.oneOf(['Facebook', 'Twitter', 'Message']).isRequired
};

export default ProductOverview;