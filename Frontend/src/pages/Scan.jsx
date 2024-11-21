import { useEffect, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { useNavigate } from 'react-router';
const Scan = () => {
    const [data, setData] = useState('No result');
    const navigate=useNavigate();
    useEffect(() => {
        if (!localStorage.username || localStorage.role == 'Attendee') {
            navigate('/login');
        }
    }, []);
    const handleScan = (result) => {
        if (result) {
            setData(result.text);
            // Fetch data from the QR code result
            fetch(`https://api.example.com/data?code=${result.text}`)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error('Error fetching data:', error));
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
            <div className="bg-ylw p-2 rounded-lg">
                <QrScanner
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