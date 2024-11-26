import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Ecard from "../components/Ecard.jsx";
const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [sEvent, setSEvent] = useState(null);
  const [role,setRole]=useState(localStorage.role)
  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const apiUrl =
          role === "Attendee"
            ? "http://15.207.134.38/api/v1/users/get-events"
            : "http://15.207.134.38/api/v1/organizers/events";

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        {
          role === "Attendee"
            ? setEvents(data.data.attendedEvents)
            : setEvents(data.data.events);
        }
        // setEvents(data); // Update your state here
      } catch (err) {
        console.error("Error fetching events:", err);
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
          {events != null ? (
            <div className="event-list flex flex-row flex-grow gap-4 py-4 overflow-auto minimal-scrollbar">
              {events.map((event) => (
                <Ecard
                  key={event._id}
                  id={event._id}
                  title={event.title}
                  date={event.date}
                  cover={event.coverImage}
                  location={event.city + ' , ' + event.state}
                  onClick={() => setSEvent(event)}
                />
              ))}
            </div>
          ) : (
            <div className="event-list flex flex-col items-center justify-center h-full">
              <h1 className="text-6xl font-bold text-gray-600">No Events to Show</h1>
              <h1 className="text-md font-normal text-gray-400">Click "Add Event" to join public Events</h1>
            </div>
          )}
          <div className="flex justify-center items-center bg-ylw p-2 rounded-md absolute bottom-16 right-12">
            {role=="Organizer"?(
              <h1
              className="text-4xl font-bold text-blk hover:cursor-pointer"
              onClick={() => {
                navigate("/add");
              }}
            >
              +
            </h1>
            )
            :(
              <h1
              className="text-3xl font-bold text-blk hover:cursor-pointer"
              onClick={() => {
                navigate("/events");
              }}
            >
              Add Event
            </h1>
            )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
