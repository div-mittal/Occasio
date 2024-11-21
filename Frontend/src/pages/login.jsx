import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(location.state?.role || "Attendee");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url =
        role === "Attendee"
          ? "http://localhost:9002/api/v1/users/login"
          : "http://localhost:9002/api/v1/organizers/login";

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, mobile: username, password }),
        credentials: 'include', // Include cookies in the response
      });

      const data = await response.json();
      console.log(data);
      if (data.statusCode !== 200) {
        message.error(data.message);
      } else {
        message.success(data.message);
        localStorage.setItem('role', role);
        localStorage.setItem('username', username)
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };


  return (
    <div className='bg-blk text-wht min-h-screen flex flex-col'>
      <Navbar page="Login" />
      <div className="flex-grow px-32 flex flex-row-reverse justify-center gap-[20%] items-center bg-blk text-white">
        <div className="w-full max-w-sm p-6 shadow-md rounded-lg">
          <div className='flex justify-between items-center mb-6'>
            <h1 className="text-3xl text-wht font-semibold text-center">LOGIN</h1>
            <div className="text-2xl text-wht  text-center  opacity-25">{role === "Attendee" ? "Attendee" : "Organizer"}</div>
          </div>

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
          <div className="mt-6 text-center flex justify-between">
            <a href="#" className="text-sm text-gray-400 hover:underline">
              Forgot Password?
            </a>
            <div className="flex gap-[6px] text-gray-400 cursor-default hover:text-wht hover:font-semibold">
              <div>{role === "Attendee" ? "Organizer?" : "Attendee?"}</div>
              <div
                className="hover:text-wht cursor-pointer hover:font-normal"
                onClick={() => {
                  setRole(role === "Attendee" ? "Organizer" : "Attendee");
                }}
              >
                Click Here
              </div>
            </div>
          </div>
        </div>
        <img src='cal.png' alt='Calendar' className='w-2/5 xsm:hidden lg:flex' />
      </div>
    </div>
  );
};

export default Login;