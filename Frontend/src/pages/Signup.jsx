import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, ConfigProvider, message } from "antd";
import Navbar from "../components/Navbar";
const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || "Attendee");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setprofilePicture] = useState(null); // State to store the selected file

  const handleRegister = () => {
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("password", password);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture); // Append the file
    }
    if (role === "Organizer") {
      formData.append("address", address);
    }

    const url =
      role === "Attendee"
        ? "http://localhost:9002/api/v1/attendees/register"
        : "http://localhost:9002/api/v1/organizers/register";

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          message.error(data.error);
        } else {
          message.success(data.message);
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="bg-blk min-h-screen text-wht">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#E0AF31",
            borderRadius: 2,
          },
        }}
      >
        <Navbar page='Signup'/>
        <div className="flex justify-between mx-4 md:mx-20 my-5">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer text-[1.2rem]"
          >
            &lt; Back
          </button>
          <div className="flex gap-[6px] cursor-pointer hover:text-ylw hover:font-semibold">
            <div>{role === "Attendee" ? "Organizer?" : "Attendee?"}</div>
            <div
              className="hover:text-wht hover:font-normal"
              onClick={() => {
                setRole(role === "Attendee" ? "Organizer" : "Attendee");
              }}
            >
              Click Here
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row h-auto lg:h-[55vh] mx-4 md:mx-20 mt-5">
          <div className="p-5 px-6 rounded border-wht border h-full lg:w-[55%] flex flex-col w-full">
            <div className="cursor-default text-[1.4rem] flex justify-between w-full">
              <div>Sign Up</div>
              <div className="opacity-25">
                {role === "Attendee" ? "Attendee" : "Organizer"}
              </div>
            </div>
            {role === "Attendee" && (
              <div className="h-auto lg:h-[75%] mt-8 flex flex-col gap-[1rem]">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 "
                  />
                </div>
                <div className="flex flex-col lg:flex-row gap-[1rem]">
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full lg:w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 "
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full lg:w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 "
                  />
                </div>
                <div className="flex flex-col lg:flex-row gap-[1rem]">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full lg:w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full lg:w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2"
                  />
                </div>
                <div className="flex flex-col lg:flex-row justify-between items-center">
                <div className="flex flex-col lg:flex-row items-center w-full my-4">
                    <label
                      htmlFor="profilePicture"
                      className="w-full lg:w-[50%] cursor-pointer flex items-center justify-center bg-ylw hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-sm transition duration-300 ease-in-out"
                    >
                      Select Profile Picture
                    </label>
                    <input
                      id="profilePicture"
                      type="file"
                      onChange={(e) => setprofilePicture(e.target.files[0])}
                      className="hidden"
                    />

                    {profilePicture && (
                      <p className="text-sm text-gray-700 mt-2 lg:mt-0 lg:ml-4">
                        Selected file:{" "}
                        <span className="font-medium">
                          {profilePicture.name}
                        </span>
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleRegister}
                    type="primary"
                    size="large"
                    className="font-bold text-blk hover:!text-blk mt-4 lg:mt-0"
                  >
                    Register
                  </Button>
                </div>
              </div>
            )}
            {role === "Organizer" && (
              <div className="h-auto lg:h-[75%] mt-4 flex flex-col">
                <div className="flex gap-[50px]">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 "
                  />
                </div>
                <div className="flex flex-col lg:flex-row gap-[0.6rem]">
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full lg:w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 "
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full lg:w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 "
                  />
                </div>
                <div className="flex flex-col lg:flex-row gap-[0.6rem]">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full lg:w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full lg:w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2"
                />
                <div className="flex flex-col lg:flex-row justify-between items-center">
                  <div className="flex flex-col lg:flex-row items-center w-full my-4">
                    <label
                      htmlFor="profilePicture"
                      className="w-full lg:w-[50%] cursor-pointer flex items-center justify-center bg-ylw hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-sm transition duration-300 ease-in-out"
                    >
                      Select Profile Picture
                    </label>
                    <input
                      id="profilePicture"
                      type="file"
                      onChange={(e) => setprofilePicture(e.target.files[0])}
                      className="hidden"
                    />

                    {profilePicture && (
                      <p className="text-sm text-gray-700 mt-2 lg:mt-0 lg:ml-4">
                        Selected file:{" "}
                        <span className="font-medium">
                          {profilePicture.name}
                        </span>
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleRegister}
                    type="primary"
                    size="large"
                    className="font-bold text-blk hover:!text-blk mt-4 lg:mt-0"
                  >
                    Register
                  </Button>
                </div>
              </div>
            )}
          </div>
          <img
            className="w-full lg:w-[40%] h-auto lg:h-[140%] mt-4 lg:mt-[-5%]"
            src="cal.png"
            alt=""
          />
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Signup;
