import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ page }) {
    const navigate = useNavigate();
    let buttonText;
    let navigateTo;

    switch(page) {
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

    return (
        <>
        <div className="m-0 text-wht w-screen h-[8vh] flex flex-row items-center py-12 px-20 justify-between">
            <div className="m-0 gap-32 flex flex-row items-center justify-between">
            <img className="h-[3.5vh]" src="OCCASIO.png" alt="Occasio Logo"/>
            <div className="gap-12 flex text-wht text-lg flex-row items-center justify-between">
                <div>Home</div>
                <div>Events</div>
                <div>About Us</div>
            </div>
            </div>
            <div 
                className="text-[1rem] px-6 py-1.5 font-semibold border-[0.5px] border-wht border-opacity-50 hover:cursor-pointer" 
                onClick={() => navigate(navigateTo)}
            > 
                {buttonText}
            </div>
        </div>
        </>
    );
}

export default Navbar;