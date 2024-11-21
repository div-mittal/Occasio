import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import RSVP from "../components/RSVP.jsx";

const EventDetails = ({ event }) => {
  const [user, setUser] = useState("Attendee"); // Example: Default set as "organizer" for testing
  const [editableEvent, setEditableEvent] = useState(event);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setUser(savedRole);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setEditableEvent({ ...editableEvent, [field]: value });
  };

  const handleConfirm = () => {
    // Implement the RSVP functionality here
    console.log("RSVP Confirmed");
  };

  const handleDeleteEvent = () => {
    // Implement the delete functionality
    console.log("Event deleted");
    navigate("/events"); // Example: Redirecting to events list
  };

  return (
    <div className="h-[100vh] bg-blk flex flex-col">
      <Navbar />
      <div className="dash w-full px-20 py-12 flex-grow">
        <div className="relative flex flex-col w-full h-full p-8 border border-solid border-wht border-opacity-25 rounded-lg">
          {user === "organizer" ? (
            <>
              <div className="org-opt flex flex-col md:flex-row gap-8 h-full">
                <div className="w-1/4">
                  <img
                    src="/image.png"
                    alt="event.title"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="h-full w-2/4 flex flex-col justify-between border border-wht rounded border-opacity-25 p-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-wht font-medium text-2xl">Send Update</h1>
                    <div className="flex flex-row items-center gap-1 ">
                      <textarea className="w-full rounded"/>
                      <button className="bg-ylw p-3 font-bold">send</button>
                    </div>
                  </div>
                  <div className="flex h-full gap-1 pt-2">
                    <div className="w-1/2 p-2 border border-solid border-wht border-opacity-25 rounded-lg text-wht">Options</div>
                    <div className="w-1/2 p-2 border border-solid border-wht border-opacity-25 rounded-lg text-wht">Share Qr</div>
                  </div>
                </div>
                <div className="h-full w-1/4 flex flex-col">
                  <div className="h-full flex flex-col gap-4 justify-between">
                    <div>
                      <div>
                        <label className="text-wht text-lg font-semibold">
                          Title:
                        </label>
                        <input
                          type="text"
                          value={editableEvent.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="w-full p-2 border border-wht border-opacity-50 rounded-lg bg-blk text-wht"
                        />
                      </div>
                      <div>
                        <label className="text-wht text-lg font-semibold">
                          Location:
                        </label>
                        <input
                          type="text"
                          value={editableEvent.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          className="w-full p-2 border border-wht border-opacity-50 rounded-lg bg-blk text-wht"
                        />
                      </div>
                      <div className="flex flex-row gap-4">
                        <div>
                          <label className="text-wht text-lg font-semibold">
                            Date:
                          </label>
                          <input
                            type="date"
                            value={editableEvent.date}
                            onChange={(e) =>
                              handleInputChange("date", e.target.value)
                            }
                            className="w-full p-2 border border-wht border-opacity-50 rounded-lg bg-blk text-wht"
                          />
                        </div>
                        <div>
                          <label className="text-wht text-lg font-semibold">
                            Time:
                          </label>
                          <input
                            type="time"
                            value={editableEvent.time}
                            onChange={(e) =>
                              handleInputChange("time", e.target.value)
                            }
                            className="w-full p-2 border border-wht border-opacity-50 rounded-lg bg-blk text-wht"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <button
                        onClick={handleDeleteEvent}
                        className="mt-4 px-6 py-2 bg-ylw text-blk font-bold rounded-lg"
                      >
                        Update Event
                      </button>
                      <button
                        onClick={handleDeleteEvent}
                        className="mt-4 px-6 py-2 bg-red-800 text-wht font-bold rounded-lg"
                      >
                        Delete Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
                  <h1 className="text-wht text-6xl font-bold">editableEvent.title</h1>
                  <p className="text-wht text-lg">editableEvent.location</p>
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
                    <h3 className="text-wht text-2xl">editableEvent.date</h3>
                    <p className="text-wht text-lg">Dec</p>
                  </div>

                  <div className="flex flex-col items-center justify-center border border-solid border-wht border-opacity-25 rounded-lg p-4">
                    <h3 className="text-wht text-2xl">editableEvent.time</h3>
                    <p className="text-wht text-lg">onwards</p>
                  </div>
                </div>
              </div>
              <RSVP handleConfirm={handleConfirm} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;