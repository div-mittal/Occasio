import React from "react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { message } from "antd";
import {useNavigate} from "react-router-dom";

const Add = () => {
    const navigate=useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [venue, setVenue] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [type, setType] = useState("");
    const [capacity, setCapacity] = useState("");
    const [image, setImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [gallery, setGallery] = useState([]);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("date", date);
        formData.append("time", time);
        formData.append("location", venue);
        formData.append("state", state);
        formData.append("city", city);
        formData.append("type", type);
        formData.append("capacity", capacity);
        if (image) formData.append("image", image);
        if (coverImage) formData.append("coverImage", coverImage);
        if (gallery) formData.append("gallery", gallery);
        console.log(formData)
        try {
            const response = await fetch(
                "http://localhost:9002/api/v1/events/create",
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                }
            );
            console.log(response)
            if (response.ok) {
                const data = await response.json();
                console.log("Event registered successfully:", data);
                message.success("Event registered successfully");
                navigate("/dashboard");
                
            } else {
                const data = await response.json();
                console.log(data)
                message.error(data.message);
                console.error("Failed to register event:", response.statusText);
            }
        } catch (error) {
            message.error(error)
            console.error("Error:", error);
        }
    };

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setGallery(files);
    };

    return (
        <div className="flex flex-col min-h-[100vh] bg-blk">
            <Navbar />
            <div className="w-full px-20 py-8 flex-grow">
                <div className="flex flex-col w-full h-full p-6 border border-solid border-wht border-opacity-25 rounded-lg ">
                    <h1 className="text-wht text-2xl mb-4">Add Event</h1>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div>
                            <div className="flex flex-wrap -mx-2">
                                <div className="w-full md:w-1/3 px-2">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-transparent text-wht p-2 px-6 border border-wht border-opacity-25 rounded my-2 w-full"
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2">
                                    <input
                                        type="text"
                                        placeholder="Venue"
                                        value={venue}
                                        onChange={(e) => setVenue(e.target.value)}
                                        className="bg-transparent text-wht p-2 px-6 border border-wht border-opacity-25 rounded my-2 w-full"
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2">
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className="bg-transparent text-wht p-2 px-6 border border-wht border-opacity-25 rounded my-2 w-full"
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="bg-transparent text-wht p-2 px-6 border border-wht border-opacity-25 rounded my-2 w-full"
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2">
                                    <input
                                        type="date"
                                        value={date}
                                        style={{ colorScheme: "dark" }}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="bg-transparent p-2 px-6 border text-wht border-wht border-opacity-25 rounded my-2 w-full"
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2">
                                    <input
                                        type="time"
                                        value={time}
                                        style={{ colorScheme: "dark" }}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="bg-transparent p-2 px-6 border border-wht text-wht border-opacity-25 rounded my-2 w-full"
                                    />
                                </div>
                                <div className="w-full px-2">
                                    <textarea
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="bg-transparent text-wht p-2 px-6 border border-wht border-opacity-25 rounded my-2 w-full"
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2">
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="bg-transparent text-wht p-2 px-6 border border-wht border-opacity-25 rounded my-2 w-full"
                                    >
                                        <option value="" disabled>
                                            Select Event Type
                                        </option>
                                        <option value="open">Open</option>
                                        <option value="invite-only">invite-only</option>
                                    </select>
                                </div>
                                <div className="w-full md:w-1/3 px-2">
                                    <input
                                        type="number"
                                        placeholder="Capacity"
                                        value={capacity}
                                        style={{ colorScheme: "dark" }}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        className="bg-transparent text-wht p-2 px-6 border border-wht border-opacity-25 rounded my-2 w-full"
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2 my-auto">
                                    <label
                                        htmlFor="image"
                                        className="w-full lg:w-[100%] cursor-pointer flex items-center justify-center bg-ylw hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-sm transition duration-300 ease-in-out"
                                    >
                                        {(!image)?`Select Event Picture`:`Picture Uploaded`}
                                    </label>
                                    <input
                                        id="image"
                                        type="file"
                                        onChange={(e) => handleFileChange(e, setImage)}
                                        className="hidden"
                                        placeholder="Event Photo"
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2">
                                    <label
                                        htmlFor="coverImage"
                                        className="w-full lg:w-[100%] cursor-pointer flex items-center justify-center bg-ylw hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-sm transition duration-300 ease-in-out"
                                    >
                                        {(!coverImage)?`Select Cover Picture`:`Cover Uploaded`}
                                    </label>
                                    <input
                                        id="coverImage"
                                        type="file"
                                        onChange={(e) => handleFileChange(e, setCoverImage)}
                                        className="hidden"
                                        placeholder="Cover Pic"
                                    />
                                </div>
                                <div className="w-full md:w-2/3 px-2">
                                    <label
                                        htmlFor="gallery"
                                        className="w-full lg:w-[100%] cursor-pointer flex items-center justify-center bg-ylw hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-sm transition duration-300 ease-in-out"
                                    >
                                        {(gallery.length==0)?`Select Gallery Pictures`:`Gallery Pics Uploaded`}
                                    </label>
                                    <input
                                        id="gallery"
                                        type="file"
                                        multiple
                                        onChange={handleGalleryChange}
                                        className="hidden"
                                        placeholder="Gallery (Optional)"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <img src="event.png" alt="Event" />
                        </div>
                    </div>
                    <button
                        className="text-blk text-2xl font-bold bg-ylw my-6 py-1 rounded-sm transform transition-transform duration-200 active:scale-95"
                        onClick={handleSubmit}
                    >
                        Register Event
                    </button>
                </div>
                </div>
            </div>
    );
};

export default Add;
