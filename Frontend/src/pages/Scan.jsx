import { useEffect, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

const Scan = () => {
    const { id } = useParams();
    const [eventId, eventName] = id.split('-');
    const [data, setData] = useState('');
    const [scannerKey, setScannerKey] = useState(Date.now());
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.username || localStorage.role === 'Attendee') {
            navigate('/login');
        }
    }, [navigate]);

    const handleScan = async (result) => {
        if (result) {
            try {
                const response = await fetch(`http://localhost:9002/api/v1/events/verify-rsvp/${eventId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ qrCode: result.text })
                });
                const data = await response.json();
                setData(data.message);
                console.log(data.message);
                setScannerKey(Date.now()); // Reset the scanner
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const previewStyle = {
        height: 240,
        width: 320,
    };

    return (
        <div className="bg-blk min-h-screen flex flex-col items-center justify-center gap-10">
            <h1 className="text-ylw text-4xl font-bold">Scan QR Code</h1>
            <h1 className="text-gray-500 text-2xl">{localStorage.username}</h1>
            <h1 className="text-gray-500 text-2xl">{eventName}</h1>
            <div className="bg-ylw p-2 rounded-lg">
                <QrScanner
                    key={scannerKey}
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={previewStyle}
                />
            </div>
            <p className="text-white mt-4">{data}</p>
        </div>
    );
};

export default Scan;