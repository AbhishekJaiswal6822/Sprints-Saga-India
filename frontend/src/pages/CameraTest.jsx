import React, { useEffect, useRef } from "react";

const CameraTest = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        // This is the direct browser command to turn on the camera
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
            .then((stream) => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            })
            .catch((err) => {
                alert("Camera Error: " + err.message);
                console.error(err);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
            <h1 className="mb-4 text-xl font-bold">Hardware Camera Test</h1>
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full max-w-md rounded-3xl border-4 border-teal-500 shadow-2xl bg-black"
            />
            <p className="mt-4 text-slate-400 text-sm italic">If you see yourself here, your hardware is 100% fine.</p>
            <a href="/expo" className="mt-6 text-teal-400 underline uppercase font-black">Back to Expo</a>
        </div>
    );
};

export default CameraTest;