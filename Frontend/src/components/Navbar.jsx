import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ page }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    let buttonText;
    let navigateTo;

    if(!localStorage.role){
    switch (page) {
        case 'Landing':
        case 'Signup':
            buttonText = 'Login';
            navigateTo = '/login';
            break;
        case 'Login':
            buttonText = 'Signup';
            navigateTo = '/signup';
            break;
        case 'Dashboard':
            buttonText = 'Logout';
            navigateTo = '/logout';
            break;
        default:
            buttonText = 'Login'; // default value
            navigateTo = '/login';
    }
    }else{
        buttonText = 'Logout';
        navigateTo = './';
    }

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="sticky top-0 m-0 text-wht w-screen h-[8vh] flex flex-row items-center py-12 px-20 justify-between">
                <div className="m-0 gap-32 flex flex-row items-center justify-between">
                    <img className="h-[3.5vh]" src="OCCASIO.png" alt="Occasio Logo" />

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex gap-12 text-wht text-lg flex-row items-center justify-between">
                        <div onClick={() => navigate('/')} className="hover:font-medium cursor-pointer">Home</div>
                        <div onClick={() => navigate('/events')} className="hover:font-medium cursor-pointer">Events</div>
                        <div onClick={() => navigate('/about')} className="hover:font-medium cursor-pointer">About Us</div>
                    </div>
                </div>

                {/* Mobile View: Hamburger Menu and Login Button */}
                <div className="flex items-center lg:hidden">
                    {/* Hamburger Menu Button */}
                    <button onClick={toggleNav} className="flex flex-col items-center justify-center space-y-1 focus:outline-none">
                        <span className={`block w-6 h-0.5 bg-wht transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
                        <span className={`block w-6 h-0.5 bg-wht transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
                        <span className={`block w-6 h-0.5 bg-wht transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
                    </button>
                </div>
                <div 
                    className="ml-4 text-[1rem] px-4 py-1.5 font-semibold border border-wht border-opacity-50 hover:cursor-pointer hidden lg:flex" 
                    onClick={() => navigate(navigateTo)}
                >
                    {localStorage.user ? localStorage.user.name : ''} -- {buttonText}
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="flex-col lg:hidden gap-4 p-4 px-20 bg-blk text-wht text-lg">
                    <div onClick={() => navigate('/')} className="hover:font-medium cursor-pointer">Home</div>
                    <div onClick={() => navigate('/events')} className="hover:font-medium cursor-pointer">Events</div>
                    <div onClick={() => navigate('/about')} className="hover:font-medium cursor-pointer">About Us</div>
                    {/* Login Button in Mobile Menu */}
                    <div 
                        className="hover:font-medium cursor-pointer"
                        onClick={() => navigate(navigateTo)}
                    >
                        {buttonText}
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
