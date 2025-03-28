// components/Store.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useStore } from "../store/store";

const PetStore = ({ userId, updateCartCount}) => {

  const categories = [
    "All",
    "Accessories",
    "Medicine",
    "Food",
    "Toys",
    "Grooming",
  ];

  // Access actions from the store
  const fetchProducts = useStore((state) => state.fetchProducts);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const addToCart = useStore((state) => state.addToCart);

  // Access state from the store
  const loading = useStore((state) => state.loading);
  const cartCount = useStore((state) => state.cart.count);

 const getFilteredProducts = useStore((state) => state.getFilteredProducts);
 const products = useStore((state) => state.products);
 const selectedCategory = useStore((state) => state.selectedCategory);

 // Then in your component:
 const filteredProducts =
   selectedCategory === "All"
     ? products
     : products.filter((product) => product.category === selectedCategory);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // const fetchProducts = async () => {
  //   setLoading(true);
  //   try {
  //     // Uncomment this when backend is ready
  //     // const response = await axios.get('/api/products');
  //     // setProducts(response.data);

  //     // Static Data for Now
  //     setProducts([
  //       {
  //         id: 1,
  //         name: "Dog Collar",
  //         price: 12.99,
  //         category: "Accessories",
  //         image: "/api/placeholder/200/200",
  //       },
  //       {
  //         id: 2,
  //         name: "Pet Vitamins",
  //         price: 24.99,
  //         category: "Medicine",
  //         image: "/api/placeholder/200/200",
  //       },
  //       {
  //         id: 3,
  //         name: "Premium Dog Food",
  //         price: 29.99,
  //         category: "Food",
  //         image: "/api/placeholder/200/200",
  //       },
  //       {
  //         id: 4,
  //         name: "Interactive Ball",
  //         price: 9.99,
  //         category: "Toys",
  //         image: "/api/placeholder/200/200",
  //       },
  //       {
  //         id: 5,
  //         name: "Pet Shampoo",
  //         price: 14.99,
  //         category: "Grooming",
  //         image: "/api/placeholder/200/200",
  //       },
  //       {
  //         id: 6,
  //         name: "Cat Toys Set",
  //         price: 19.99,
  //         category: "Toys",
  //         image: "/api/placeholder/200/200",
  //       },
  //       {
  //         id: 7,
  //         name: "Dog Leash",
  //         price: 17.99,
  //         category: "Accessories",
  //         image: "/api/placeholder/200/200",
  //       },
  //       {
  //         id: 8,
  //         name: "Cat Food",
  //         price: 22.99,
  //         category: "Food",
  //         image: "/api/placeholder/200/200",
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const loadCartCount = () => {
  //   const cart = JSON.parse(localStorage.getItem("cart")) || [];
  //   updateCartCount(cart.reduce((total, item) => total + item.quantity, 0));
  // };

  // const addToCart = (productId) => {
  //   const cart = JSON.parse(localStorage.getItem("cart")) || [];
  //   const product = products.find((item) => item.id === productId);

  //   if (product) {
  //     const existingItem = cart.find((item) => item.id === productId);
  //     if (existingItem) {
  //       existingItem.quantity += 1;
  //     } else {
  //       cart.push({ ...product, quantity: 1 });
  //     }
  //   }

  //   localStorage.setItem("cart", JSON.stringify(cart));
  //   updateCartCount(cart.reduce((total, item) => total + item.quantity, 0));

  //   alert("Item added to cart!");
  // };

  // const filteredProducts =
  //   selectedCategory === "All"
  //     ? products
  //     : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="mt-[5.5rem] container mx-auto px-4 mb-5">
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } shadow-sm`}>
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-indigo-600">Loading products...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PetStore;
