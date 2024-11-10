import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Ecard from "../components/Ecard.jsx";
const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [sEvent, setSEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events"); // replace with your actual API endpoint
        const data = await response.json();
        // setEvents(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvents();
  }, []);
  return (
    <div className="h-[100vh] bg-blk flex flex-col">
      <Navbar />
      <div className="dash w-full px-20 py-8 flex-grow">
        <div className="relative flex flex-col w-full h-full p-6 border border-solid border-wht border-opacity-25 rounded-lg">
          <h1 className="text-wht text-2xl">Dashboard</h1>
          {sEvent == null ? (
            <div className="event-list flex flex-row flex-grow gap-4 py-4 overflow-auto minimal-scrollbar">
              {/* {events.map((event) => (
                                <Ecard 
                                    key={event.id} 
                                    event={event} 
                                    onClick={() => setSEvent(event)} 
                                />
                            ))} */}
              <div className="hover:cursor-pointer w-1/5"
                onClick={() => {
                  console.log("Ecard clicked");
                  navigate("/Event");
                }}><Ecard/></div>
            </div>
          ) : (
            <></>
            // <AddEvent/>
          )}
          <div className="flex justify-center items-center h-12 w-12 bg-ylw rounded-md absolute bottom-16 right-12">
            <h1
              className="text-4xl font-bold text-blk hover:cursor-pointer"
              onClick={() => {
                navigate("/add");
              }}
            >
              +
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
