import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'

import { Toaster } from 'react-hot-toast'
import API, { setAccessToken } from './api/axios'


const App = () => {

  const[darkMode , setDarkMode]= useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  // Check if user was previously logged in - if so, we need to wait for session restore
  const wasLoggedIn = localStorage.getItem("wasLoggedIn") === "true";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading]= useState(wasLoggedIn); // Only show loading if was logged in


  useEffect(()=>{
    const sessionRestore = async()=>{
      try{
      const res = await API.post("/auth/refresh");
      setAccessToken(res.data.accessToken);
      setIsAuthenticated(true);

      }catch (err) {
        // No refresh token - user is not logged in, this is expected
        localStorage.removeItem("wasLoggedIn");
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }

    // Only try to restore session if we might have one (user was previously logged in)
    if (wasLoggedIn) {
      sessionRestore();
    }
  },[])


  useEffect(()=>{
    if(darkMode === true ){
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      
    }
    else{
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode])


  if(authLoading){
    return <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
    </div>
  }
  return (
    <BrowserRouter>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>

     <Toaster
  position="top-center"
  toastOptions={{
    duration: 3000,
    className: "dark:bg-gray-800 dark:text-white",
  }}
/>
    <Routes>

    <Route path='/' element = {<Login setIsAuthenticated={setIsAuthenticated}/>}/>
    <Route path = "/register" element= {<Register setIsAuthenticated={setIsAuthenticated}/>}/>


    


    <Route path = "/dashboard" element = {<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard setIsAuthenticated={setIsAuthenticated}/></ProtectedRoute>} />

    </Routes>
    </BrowserRouter>
  )
}

export default App