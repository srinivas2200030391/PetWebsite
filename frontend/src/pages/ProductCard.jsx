
// components/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const { name, price, image, category } = product;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <span className="text-xs text-indigo-600 font-medium">{category}</span>
        <h3 className="font-medium text-gray-800 mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">${price.toFixed(2)}</span>
          <button
            onClick={onAddToCart}
            className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;