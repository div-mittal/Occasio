import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { message } from "antd";

const RSVP = (props) => {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(true);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:9002/api/v1/events/check/${props.eventid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.statusCode === 200) {
          setConfirm(true);
        } else {
          setConfirm(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getDetail();
  }, []);

  const handleConfirm = async () => {
    if (!localStorage.username) {
      message.error("Login First");
      navigate("/login");
    } else {
      try {
        const response = await fetch(
          `http://localhost:9002/api/v1/events/register/${props.eventid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log(data);
        setConfirm(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleUnregister = async () => {
    try {
      const response = await fetch(
        `http://localhost:9002/api/v1/events/unregister/${props.eventid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      setConfirm(false);
    } catch (err) {
      console.log(err);
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
            <img className="rounded-lg" src="/qr.png" />
            <button
              onClick={() => handleUnregister()}
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
