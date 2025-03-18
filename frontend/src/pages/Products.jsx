import { Rating, Button,IconButton } from "@material-tailwind/react";
import { useState } from "react";


const products = [
    {
      id: 1,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      color: 'Black',
    },
    {
      id: 2,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      color: 'Black',
    },
    {
      id: 3,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      color: 'Black',
    },
    {
      id: 4,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      color: 'Black',
    },
    {
      id: 5,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      color: 'Black',
    },
    {
      id: 6,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      color: 'Black',
    },
    {
      id: 7,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      color: 'Black',
    },
    {
      id: 9,
      name: 'German sephard',
      href: '#',
      imageSrc: '', 
      imageAlt: "German sephard",
      price: '$35',
      color: 'Black',
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
                <img
                  alt={product.imageAlt}
                  src={product.imageSrc}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-48"
                />
                      <Rating value={4} onChange={(value) => setRated(value)} />

                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <Button variant="outlined" className="flex-1">
                    Add to Cart
                  </Button>
                  <a href="#buttons-with-link">
                    <IconButton variant="outlined">
                    <i className="fas fa-heart" />
                    </IconButton>
                    </a>
                </div>
              </div>
            ))}
          </div>
        </div>
    )
  }
  