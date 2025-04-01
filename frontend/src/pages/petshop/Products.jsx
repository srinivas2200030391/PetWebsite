import { Rating, IconButton } from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";

const products = [
    {
      id: 1,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      Age: '30 days',
    },
    {
      id: 2,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      Age: '30 days',
    },
    {
      id: 3,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      Age: '30 days',
    },
    {
      id: 4,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      Age: '30 days',
    },
    {
      id: 5,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      Age: '30 days',
    },
    {
      id: 6,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      Age: '30 days',
    },
    {
      id: 7,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      Age: '30 days',
    },
    {
      id: 8,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      Age: '30 days',
    },
       // More products...
  ]
  export default function Example() {
    const [setRated] = useState(4);
    return (
      <div className="bg-white">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
{products.map((product) => (
  <div key={product.id} className="group relative">
    <Link to='/productoverview' className="block">
      <div className="relative">
        <img
          alt={product.imageAlt}
          src={product.imageSrc}
          className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-48"
        />
        <div className="absolute top-2 right-2 z-10">
          <IconButton 
            variant="text" 
            className="rounded-full bg-white/80 p-2 hover:bg-white"
            onClick={(e) => {
              e.preventDefault(); 
            }}
          >
            <i className="fas fa-heart text-gray-900 hover:text-red-500 transition-colors" />
          </IconButton>
        </div>
      </div>
      </Link>
      <Rating value={4} onChange={(value) => {
        setRated(value);
      }} />
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.Age}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{product.price}</p>
      </div>
  </div>
))}
          </div>
        </div>
    )
  }
  