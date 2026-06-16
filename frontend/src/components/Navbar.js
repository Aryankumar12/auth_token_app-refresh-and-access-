import React from "react";

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md transition">

      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        MERN Auth App
      </h1>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg transition"
      >
        {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
      </button>

    </div>
  );
};

export default Navbar;