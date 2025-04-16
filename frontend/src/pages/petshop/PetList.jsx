import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PetCard from "./Productscard"

const PetList = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/aboutpet/all')
      .then(res => setPets(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {pets.map(pet => <PetCard key={pet._id} pet={pet} />)}
    </div>
  );
};

export default PetList;
