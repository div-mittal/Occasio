import React from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import RSVP from "../components/RSVP.jsx";
import { useState } from "react";
const EventDetails = ({ event }) => {
  const [user, setUser] = useState("organizer");
  const navigate = useNavigate();

  const handleConfirm = () => {
    // Implement the RSVP functionality here
    console.log("RSVP Confirmed");
  };

  return (
    <div className="h-[100vh] bg-blk flex flex-col">
      <Navbar />
      <div className="dash w-full px-20 py-12 flex-grow">
        <div className="relative flex flex-col w-full h-full p-8 border border-solid border-wht border-opacity-25 rounded-lg">
          {user === "organizer" ? (
            <>
            <h1 className="text-4xl text-white font-bold">For Organizer</h1>
            <button className="text-wht text-xl bg-red-950 py-4 rounded-md" onClick={()=>{setUser("attendee")}}>Click to view the attendee page </button>
            </>
          ) : (
            <div className="flex flex-row gap-8 h-full">
              <div className="w-1/3">
                <img
                  src="/image.png"
                  alt="event.title"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex flex-col w-2/3 justify-between">
                <div>
                  <h1 className="text-wht text-6xl font-bold">event.title</h1>
                  <p className="text-wht text-lg">event.location</p>
                </div>
                <div className="mt-4">
                  <h2 className="text-wht text-xl font-semibold">
                    About the Event
                  </h2>
                  <p className="text-wht border border-solid border-wht border-opacity-25 rounded-lg p-4 mt-2 h-24">
                    {"Details about the event will appear here."}
                  </p>
                </div>

                <div className="flex flex-row gap-8 mt-4">
                  <div className="flex flex-col items-center justify-center border border-solid border-wht border-opacity-25 rounded-lg p-4">
                    <h3 className="text-wht text-2xl">event.date</h3>
                    <p className="text-wht text-lg">Dec</p>
                  </div>

                  <div className="flex flex-col items-center justify-center border border-solid border-wht border-opacity-25 rounded-lg p-4">
                    <h3 className="text-wht text-2xl">event.time</h3>
                    <p className="text-wht text-lg">onwards</p>
                  </div>
                </div>
              </div>
              <RSVP handleConfirm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
