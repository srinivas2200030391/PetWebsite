//old code
/*export default function ProductDetail() {
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
              <div className="flex mb-4">
                <span className="flex items-center text-indigo-500 text-lg">★★★★★</span>
                <span className="text-gray-600 ml-3">4 Reviews</span>
              </div>
              <p className="leading-relaxed">
                Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY.
              </p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              </div>
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">$58.00</span>
                <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                  Add to Cart
                </button>
                <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                  ❤
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }*/
 //old code

 //new code
 import { useState } from "react";
 import { useParams, useNavigate } from "react-router-dom";
 import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
 import { IoChevronBack } from 'react-icons/io5';
 import { FaShare } from 'react-icons/fa';
 
 const ProductPage = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [count, setCount] = useState(1);
   const [item] = useState({
     // Replace with your actual API data fetching
     title: "German Shepherd",
     price: "35000",
     imageurl: "your-image-url",
     Gender: "Male",
     Bread_lineage: "Pure Breed",
     Breader_details: "Professional Breeder",
     category: "Dogs",
     Contact_details: "123-456-7890",
     isAvailable: true,
     Address: "123 Pet Street",
     quality: "High",
     Bread_name: "German Shepherd"
   });
 
   const foodtags = ["BEST DOG", "2 Bones", "32 Teeth", "Thin hair"];
 
   const increment = () => {
     setCount(prev => prev + 1);
   };
 
   const decrement = () => {
     if (count > 1) {
       setCount(prev => prev - 1);
     }
   };
 
   return (
     <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
       {/* Navigation */}
       <div className="relative mb-8">
         <button 
           onClick={() => navigate(-1)}
           className="absolute top-0 left-0 p-2 rounded-full hover:bg-gray-100"
         >
           <IoChevronBack size={24} />
         </button>
         <button className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-100">
           <FaShare size={24} className="text-blue-600" />
         </button>
       </div>
 
       {/* Product Image */}
       <div className="flex justify-center mb-8">
         <img 
           src=" https://th.bing.com/th?id=ODL.6feebfa091b76783ba5a09446b6caba7&w=143&h=91&c=10&rs=1&qlt=99&o=6&dpr=2&pid=AlgoBlockDebug" 
           alt={item.title}
           className="w-full max-w-xl rounded-lg object-cover"
         />
       </div>
 
       {/* Product Info */}
       <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold">{item.title}</h1>
         <p className="text-xl font-bold">₹{item.price}/-</p>
       </div>
 
       {/* Details */}
       <div className="bg-gray-50 rounded-lg p-6 mb-8">
         <h2 className="text-2xl font-bold text-center mb-4">Details</h2>
         <div className="grid gap-4">
           <DetailRow label="Gender" value={item.Gender} />
           <DetailRow label="Breed Lineage" value={item.Bread_lineage} />
           <DetailRow label="Breeder Details" value={item.Breader_details} />
           <DetailRow label="Category" value={item.category} />
           <DetailRow label="Contact Details" value={item.Contact_details} />
           <DetailRow label="Availability" value={item.isAvailable ? "Available" : "Not Available"} />
           <DetailRow label="Shop Address" value={item.Address} />
           <DetailRow label="Quality" value={item.quality} />
           <DetailRow label="Breed Name" value={item.Bread_name} />
         </div>
       </div>
 
       {/* Quantity */}
       <div className="flex justify-between items-center mb-8">
         <h2 className="text-xl font-bold">Quantity</h2>
         <div className="flex items-center gap-4">
           <button 
             onClick={decrement}
             className="text-red-500 hover:bg-red-50 p-2 rounded-full"
           >
             <AiOutlineMinus size={24} />
           </button>
           <span className="text-xl text-blue-600">{count}</span>
           <button 
             onClick={increment}
             className="text-green-500 hover:bg-green-50 p-2 rounded-full"
           >
             <AiOutlinePlus size={24} />
           </button>
         </div>
       </div>
 
       {/* Buy Button */}
       <button 
         className="w-full bg-blue-600 text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors mb-8"
         onClick={() => navigate('/order-page', { state: { 
           orderItem: {
             animalId: id,
             quantity: count,
             totalPrice: item.price,
             title: item.title
           }
         }})}
       >
         Buy Now
       </button>
 
       {/* Tags */}
       <div className="flex gap-2 mb-6 overflow-x-auto">
         {foodtags.map((tag) => (
           <span 
             key={tag}
             className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap"
           >
             {tag}
           </span>
         ))}
       </div>
 
 
       {/* Related Items */}
       <div>
         <h2 className="text-2xl font-bold mb-4">Related Items</h2>
         {/* Add your related items component here */}
       </div>
     </div>
   );
 };
 
 import PropTypes from 'prop-types';
 
 const DetailRow = ({ label, value }) => (
   <div className="flex justify-between items-center py-2 border-b">
     <span className="font-semibold">{label}:</span>
     <span>{value}</span>
   </div>
 );
 
 DetailRow.propTypes = {
   label: PropTypes.string.isRequired,
   value: PropTypes.string.isRequired,
 };
 
 export default ProductPage;