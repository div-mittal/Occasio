import React from "react";
function Navbar({ page }) {
    let buttonText;
    switch(page) {
        case 'Landing':
        case 'Signup':
            buttonText = 'Login';
            break;
        case 'Login':
            buttonText = 'Signup';
            break;
        case 'Dashboard':
            buttonText = 'Logout';
            break;
        default:
            buttonText = 'Login'; // default value
    }
    return (
        <>
        <div className="m-0 text-wht w-screen h-[8vh] flex flex-row items-center py-12 px-20 justify-between">
            <div className="m-0 gap-32 flex flex-row items-center justify-between">
            <img className="h-[3.5vh]" src="OCCASIO.png" alt="Occasio Logo"/>
            <div className="gap-12 flex text-wht flex-row items-center justify-between">
                <div>Home</div>
                <div>Events</div>
                <div>About Us</div>
            </div>

            </div>
            <div className="text-[1rem] px-6 py-1.5 font-semibold border-[0.5px] border-wht border-opacity-50"> {buttonText}</div>
        </div>
        </>
    );
}
export default Navbar;