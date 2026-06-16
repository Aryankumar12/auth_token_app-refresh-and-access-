import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';




const Register = () => {

    const [name, setName]= useState('');
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");

    const[loading   , setLoading] = useState(false);
    const[role, setRole]= useState("user");


    const navigate = useNavigate();

    const handleRegister = async()=>{

      if(!name || !email || !password){
        toast.error("Please fill all the fields");
        return;
      }
        try{
               setLoading(true);
                await API.post("/auth/register", {
                    name, email, password, role
                })
              toast.success("Registration successful! Redirecting to login...");
navigate("/");

                
        }
        catch(err){
            toast.error(err.response.data.message || "Registration failed. Please try again.");
        }
        finally{
            setLoading(false);
        }
    }
 return (
 <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">

    <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Create Account 🚀
      </h1>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=> setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />

        <select
          value={role}
          onChange={(e)=> setRole(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
  onClick={handleRegister}
  disabled={loading}
  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex justify-center items-center"
>
  {loading ? <Spinner /> : "Register"}
</button>

      </div>

      <p className="text-sm text-center mt-4 text-gray-500">
        Already have an account?
        <span
          onClick={() => navigate("/")}
          className="text-purple-600 cursor-pointer ml-1"
        >
          Login
        </span>
      </p>

    </div>

  </div>
);
}

export default Register