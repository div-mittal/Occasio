import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:9002/api/v1/organizers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email:username,mobile:username, password }),
      });
      const data = await response.json();
      if(data.error){
        alert(data.error);
      }
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className='bg-blk min-h-screen flex flex-col'>
      <Navbar page="Login"/>
      <div className="flex-grow px-32 flex flex-row-reverse justify-center gap-[20%] items-center bg-blk text-white">
        <div className="w-full max-w-sm p-6 shadow-md rounded-lg">
          <h1 className="text-3xl font-semibold text-center mb-6">LOGIN</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full mt-1 p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full mt-1 p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-ylw text-black font-semibold rounded-md hover:bg-ylw"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-400 hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>
        <img src='cal.png' alt='Calendar' className='w-2/5' />
      </div>
    </div>
  );
};

export default Login;
