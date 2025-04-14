import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    breed: '',
    minPrice: '',
    maxPrice: '',
    age: ''
  });

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const value = {
    products,
    loading,
    filters,
    setFilters,
    fetchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};