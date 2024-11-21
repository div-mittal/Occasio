import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Scard from "../components/Scard";

const Events = () => {
    const [events, setEvents] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:9002/api/v1/events/open', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                console.log(data.data);
                setEvents(data.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="bg-blk h-screen">
            <Navbar page="Events" />
            <div className="content h-[85vh] flex flex-wrap py-12 px-2 gap-8 justify-center overflow-auto">
                {events ? (
                    events.map((event) => (
                        <Scard key={event.id} event={event} />
                    ))
                ) : (
                    <p>Loading events...</p>
                )}
            </div>
        </div>
    );
};

export default Events;
