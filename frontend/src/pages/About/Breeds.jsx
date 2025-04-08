import React from "react";
import { useParams } from "react-router-dom";
import DogBreeds from "./DogBreeds";
import CatBreeds from "./CatBreeds";

export default function Breeds() {
  const { item } = useParams();
  return (
    <div className="container mx-auto mt-20 px-4">
      {item === "dog" && <DogBreeds item={item} />}
      {item === "cat" && <CatBreeds item={item} />}
      {!["dog", "cat"].includes(item) && (
        <div className="text-center text-pink-600 font-semibold text-xl">
          Oops, love 😢 We don’t know this breed type yet...
        </div>
      )}
    </div>
  );
}
