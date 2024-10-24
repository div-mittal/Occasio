import React from "react";
import Navbar from "../components/Navbar";
const About = () => {
  return (
    <div className="bg-blk h-screen">
      <Navbar page="About"/>
      <div className="bg-blk text-white p-20 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4">About Us</h1>
        <div className="w-full max-w-4xl text-center">
          <p className="text-lg mb-6">
            Occasio is your go-to platform for managing and tracking event
            attendance, including conferences, workshops, and private
            gatherings. Our seamless, user-friendly interface allows you to
            effortlessly create events, send invites, manage RSVPs, and keep
            track of guest preferences, all in one place.
          </p>
          <p className="text-lg mb-6">
            Our mission is to empower event organizers with the tools they need
            to create memorable experiences for their guests. From small
            gatherings to large conferences, we provide all the features
            necessary to make your event a success.
          </p>
          <p className="text-lg mb-6">
            At Occasio, we believe that event planning should be simple,
            efficient, and enjoyable. Join us and discover how easy managing
            events can be.
          </p>
        </div>
        <div className="pt-10">
        <img src="OCCASIO.png" />
        </div>
      </div>
    </div>
  );
};

export default About;
