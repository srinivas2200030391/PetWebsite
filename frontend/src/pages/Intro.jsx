"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

// A simple, elegant component for the snow effect
const SnowEffect = () => {
  const snowflakes = Array.from({ length: 150 });

  return (
    <>
      <style>
        {`
          .snowflake {
            position: absolute;
            top: -10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            animation-name: fall;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            pointer-events: none;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
          }

          @keyframes fall {
            to {
              transform: translateY(105vh);
            }
          }
        `}
      </style>
      <div className="absolute inset-0 z-10 overflow-hidden">
        {snowflakes.map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 7 + 5}s`, // Slower fall speed
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.2,
            }}
          />
        ))}
      </div>
    </>
  );
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function Intro() {
  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="A happy dog on a light background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <SnowEffect />

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.h2
            variants={itemVariants}
            className="text-lg font-medium text-white/70 tracking-[0.3em] uppercase md:text-xl"
          >
            Petzu
          </motion.h2>

          <motion.h1
            variants={itemVariants}
            className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-7xl"
            style={{ textShadow: "0 2px 15px rgba(0,0,0,0.4)" }}
          >
            <span className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">Your Pet's World,<br/>All in One Place.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-2xl mx-auto text-lg leading-8 text-white/80"
          >
            From finding your perfect companion with ethical breeders to shopping for all their needs, Petzu is the ultimate destination for pet lovers.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-5"
          >
            <Link
              to="/signup"
              className="transform rounded-full bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-gray-50 flex items-center gap-2"
            >
              Get Started <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="group flex items-center gap-2 text-base font-semibold leading-6 text-white/80 transition-colors duration-300 hover:text-white"
            >
              Log In{" "}
              <span
                aria-hidden="true"
                className="transform transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
