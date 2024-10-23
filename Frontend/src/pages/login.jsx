import React from 'react';
import Navbar from '../components/Navbar';

const Login = () => {
  return (
    <div className='bg-blk min-h-screen flex flex-col'>
      <Navbar page="Login"/>
      <div className="flex-grow px-32 flex flex-row-reverse items-center bg-blk text-white">
        <div className="w-full max-w-sm p-6 shadow-md rounded-lg">
          <h1 className="text-3xl font-semibold text-center mb-6">LOGIN</h1>
          <form className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full mt-1 p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your username"
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
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-ylw"
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
      </div>
    </div>
  );
};

export default Login;
