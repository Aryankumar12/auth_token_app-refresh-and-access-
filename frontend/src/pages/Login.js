import API, { setAccessToken } from "../api/axios";
import React, { useEffect } from 'react'
import { useState } from 'react';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner";


const Login = ({ setIsAuthenticated }) => {
      const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const[loading, setLoading]  = useState(false);


  const navigate = useNavigate();

  



 const handleLogin = async () => {
  try {
    setLoading(true);
    const { data } = await API.post("/auth/login", { email, password });

    setAccessToken(data.accessToken);
    localStorage.setItem("wasLoggedIn", "true"); // Remember user logged in
    setIsAuthenticated(true);   // 👈 important

    toast.success("Login successful!");
    navigate("/dashboard");

  } 
    catch (err) {
  if (err.response?.status === 429) {
    toast.error("Too many attempts. Try again later.");
  } else {
    toast.error(err.response?.data?.message || "Login failed");
  }
}
   finally {
    setLoading(false);
  }
};
 return (
 <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">

    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8 rounded-2xl shadow-2xl w-96">

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Welcome Back 👋
      </h1>

      <div className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />

        <button
  onClick={handleLogin}
  disabled={loading}
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
>
  {loading ? <Spinner /> : "Login"}
</button>

      </div>

      <p className="text-sm text-center mt-4 text-gray-500">
        Don't have an account?
        <span
          onClick={() => navigate("/register")}
          className="text-indigo-600 cursor-pointer ml-1"
        >
          Register
        </span>
      </p>

    </div>

  </div>
);
}

export default Login