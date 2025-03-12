import 'react'
import {Image} from "@nextui-org/react";
import { Link } from 'react-router-dom';

function image() {
  return (
      <div className="flex items-center justify-center min-h-screen bg-black">
      <Link to="/carousel">
      <Image
        isZoomed
        alt="NextUI Fruit Image with Zoom"
        src="https://nextui.org/images/fruit-1.jpeg"
        width={240}
      />
      </Link> 
      </div>
  )
}

export default image