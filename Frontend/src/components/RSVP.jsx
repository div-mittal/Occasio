import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { message } from "antd";

const RSVP = (props) => {
  const navigate=useNavigate();
  const [confirm, setConfirm] = useState(false);
  const handleConfirm = () => {
    if(!localStorage.username){
      message.error("Login First");
      navigate('/login');
    }
  }

  return (
    <>
      <div className="flex flex-col items-start w-1/3 justify-between border border-solid border-wht border-opacity-25 rounded-lg p-6">
        <h2 className="text-wht text-xl font-semibold">RSVP</h2>
        {!confirm ? (
          <>
            <p className="text-wht mt-4 mb-8 italic">
              I am pleased to confirm my attendance at the upcoming event and
              look forward to joining you.
            </p>
            <button
              onClick={() => handleConfirm()}
              className="bg-ylw text-blk text-lg w-full font-bold rounded-md px-6 py-2 hover:cursor-pointer"
            >
              Confirm
            </button>
          </>
        ) : (
            <>
          <h1 className="text-wht w-full text-center">Scan the Qr Code</h1>
          <img className='rounded-lg' src='/qr.png'/>
          <button
              onClick={() => setConfirm(false)}
              className="bg-red-800 text-wht text-lg w-full font-bold rounded-md px-6 py-2 hover:cursor-pointer"
            >
              Cancel RSVP
            </button>
          </>
          
        )}
      </div>
    </>
  );
};

export default RSVP;
