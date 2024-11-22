import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import RSVP from "../components/RSVP.jsx";
import { useParams } from "react-router-dom";
import { message } from "antd";

const EventDetails = () => {
  const [user, setUser] = useState("Attendee"); // Example: Default set as "organizer" for testing
  const [event, setEvent] = useState(null);
  const [editableEvent, setEditableEvent] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setUser(savedRole);
    }
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:9002/api/v1/events/info/${id}`
        );
        const data = await response.json();
        console.log(data.data);
        setEvent(data.data);
        setEditableEvent({
          ...data.data,
          date: data.data.date, // Keep raw date for parsing
        });
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleScan = () => {
    navigate(`/scan/${id +'-'+event.title}`);
  }

  const handleInputChange = (field, value) => {
    if (field === "time") {
      // Extract the date part from the existing editableEvent.date
      const currentDate = new Date(editableEvent.date);
      const [hours, minutes] = value.split(":");
      currentDate.setHours(hours);
      currentDate.setMinutes(minutes);

      setEditableEvent({ ...editableEvent, date: currentDate.toISOString() });
    } else if (field === "date") {
      // Merge the updated date with the existing time
      const currentDate = new Date(editableEvent.date);
      const newDate = new Date(value);
      currentDate.setFullYear(newDate.getFullYear());
      currentDate.setMonth(newDate.getMonth());
      currentDate.setDate(newDate.getDate());

      setEditableEvent({ ...editableEvent, date: currentDate.toISOString() });
    } else {
      setEditableEvent({ ...editableEvent, [field]: value });
    }
  };

  const handleConfirm = () => {
    // Implement the RSVP functionality here

    console.log("RSVP Confirmed");
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(
        `http://localhost:9002/api/v1/events/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        console.log("Event deleted successfully");
        navigate("/dashboard"); // Redirecting to events list
      } else {
        console.error("Error deleting event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await fetch(
        `http://localhost:9002/api/v1/events/update/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editableEvent),
        }
      );
      console.log(response);
      if (response.ok) {
        const updatedEvent = await response.json();
        console.log(updatedEvent.data);
        setEvent(updatedEvent.data);
        console.log("Event updated successfully");
      } else {
        console.error("Error updating event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleSendUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:9002/api/v1/events/send-mail/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ message: updateMessage }),
        }
      );
      if (response.ok) {
        console.log("Update message sent successfully");
        message.success("Update sent successfully");
      } else {
        const data = await response.json();
        console.error("Error sending update message", data.message);
        message.error(`${data.message}`);
      }
    } catch (error) {
      console.error("Error sending update message:", error.message);
    }
  };

  return (
    <div className="h-[100vh] bg-blk flex flex-col">
      <Navbar />
      <div className="dash w-full px-20 py-4 flex-grow ">
        <div className="relative flex flex-col w-full h-full p-8 border border-solid border-wht border-opacity-25 rounded-lg">
          {event ? ( // Check if event is loaded
            user === "Organizer" ? (
              <>
                <div className="org-opt flex flex-col md:flex-row gap-8 h-full">
                  <div className="w-1/4">
                    <img
                      src={event.coverImage.url}
                      alt={event.coverImage.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="h-full w-2/4 flex flex-col justify-between border border-wht rounded border-opacity-25 p-4">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-wht font-medium text-2xl">
                        Send Update
                      </h1>
                      <div className="flex flex-row items-center gap-1">
                        <textarea
                          className="w-full rounded"
                          value={updateMessage}
                          onChange={(e) => setUpdateMessage(e.target.value)}
                        />
                        <button
                          className="bg-ylw p-3 font-bold"
                          onClick={handleSendUpdate}
                        >
                          send
                        </button>
                      </div>
                    </div>
                    <div className="flex h-full gap-1 pt-2 justify-center">
                      {/* <div className="w-1/2 p-2 border border-solid border-wht border-opacity-25 rounded-lg text-wht">
                        <h1 className="text-2xl font-medium">Options</h1>
                      </div> */}
                      <div className="flex flex-col w-1/2 p-2 border border-solid border-wht border-opacity-25 rounded-lg text-wht">
                        <h1 className="text-2xl font-medium">Share QR Code</h1>
                        {event.qrCode && (
                          <img
                            src={event.qrCode}
                            alt="Event QR Code"
                            className="w-full h-full object-scale-down rounded-lg"
                          />
                        )}
                        <div className="flex justify-between mt-2 gap-2 p-2">
                        <button
                          className="bg-ylw w-1/2 p-2 font-bold rounded-lg text-blk"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = event.qrCode;
                            link.download = "event-qr-code.png";
                            link.click();
                          }}
                        >
                          Download QR
                        </button>
                        <button
                          className="bg-ylw w-1/2 p-2 font-bold rounded-lg text-blk"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            message.success("QR Code URL copied to clipboard");
                          }}
                        >
                          Copy Link
                        </button>
                      </div>
                      </div>
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
                            value={editableEvent.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
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
                              value={
                                editableEvent
                                  ? new Date(editableEvent.date)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
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
                              value={
                                editableEvent
                                  ? new Date(editableEvent.date)
                                      .toLocaleTimeString("en-US", {
                                        hour12: false,
                                      })
                                      .slice(0, 5)
                                  : ""
                              }
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
                          onClick={handleUpdateEvent}
                          className="mt-4 px-6 py-2 bg-ylw text-blk font-bold rounded-lg"
                        >
                          Update Event
                        </button>
                        <button
                          onClick={handleScan}
                          className="mt-4 px-6 py-2 bg-ylw text-blk font-bold rounded-lg"
                        >
                          Event Scaning
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
                    src={event.coverImage.url}
                    alt={event.coverImage.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col w-2/3 justify-between">
                  <div>
                    <h1 className="text-wht text-6xl font-bold">
                      {event.title}
                    </h1>
                    <p className="text-wht text-lg">
                      {event.location + ", " + event.city + ", " + event.state}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h2 className="text-wht text-xl font-semibold">
                      About the Event
                    </h2>
                    <p className="text-wht border border-solid border-wht border-opacity-25 rounded-lg p-4 mt-2 h-24">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex flex-row gap-8 mt-4">
                    <div className="flex flex-col items-center justify-center border border-solid border-wht border-opacity-25 rounded-lg p-4">
                      <h3 className="text-wht text-2xl">
                        {new Date(event.date).toLocaleDateString()}
                      </h3>
                      <p className="text-wht text-lg">Dec</p>
                    </div>

                    <div className="flex flex-col items-center justify-center border border-solid border-wht border-opacity-25 rounded-lg p-4">
                      <h3 className="text-wht text-2xl">
                        {new Date(event.date).toLocaleTimeString()}
                      </h3>
                      <p className="text-wht text-lg">onwards</p>
                    </div>
                  </div>
                </div>
                <RSVP eventid={id}/>
              </div>
            )
          ) : (
            <p>Loading event details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
