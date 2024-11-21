import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { message } from "antd";

const RSVP = (props) => {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [qrCodeLink, setQrCodeLink] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("going");

  useEffect(() => {
    const getDetail = async () => {
      setLoading(true);
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
        console.log(data)
        if (data.statusCode === 200) {
          setConfirm(true);
          setQrCodeLink(data.data.qrCode);
          setRsvpStatus(data.data.rsvpStatus);
        } else {
          setConfirm(false);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getDetail();
  }, [props.eventid]);

  const handleConfirm = async () => {
    if (!localStorage.username) {
      message.error("Login First");
      navigate("/login");
    } else {
      setLoading(true);
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
        setQrCodeLink(data.data.qrCode);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUnregister = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-1/3 items-center justify-between border border-solid border-wht border-opacity-25 rounded-lg p-6">
      <h2 className="text-wht text-3xl font-semibold">RSVP</h2>
      {loading ? (
        <p className="text-wht text-2xl mt-4 mb-8 italic">Loading...</p>
      ) : rsvpStatus === "checked-in" ? (
        <p className="text-wht text-2xl text-center mt-4 mb-8 pb-7 italic">Thank you for attending our Event! Hope to see you again soon....</p>
      ) : !confirm ? (
        <>
          <p className="text-wht mt-4 mb-8 italic">
            I am pleased to confirm my attendance at the upcoming event and
            look forward to joining you.
          </p>
          <button
            onClick={handleConfirm}
            className="bg-ylw text-blk text-lg w-full font-bold rounded-md px-6 py-2 hover:cursor-pointer"
          >
            Confirm
          </button>
        </>
      ) : (
        <>
          <h1 className="text-wht w-full text-center text-xl">Scan the Qr Code</h1>
          <img className="rounded-lg" src={qrCodeLink} alt="QR Code" />
          <button
            onClick={handleUnregister}
            className="bg-red-800 text-wht text-lg w-full font-bold rounded-md px-6 py-2 hover:cursor-pointer"
          >
            Cancel RSVP
          </button>
        </>
      )}
    </div>
  );
};

export default RSVP;
