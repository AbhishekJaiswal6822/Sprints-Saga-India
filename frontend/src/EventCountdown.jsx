//C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\EventCountdown.jsx
import React, { useEffect, useState } from "react";

function EventCountdown() {
 const targetDate = "2026-04-12T00:00:00";

  // Function to calculate remaining time
  const getTimeLeft = () => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
    }

    const secTotal = Math.floor(diff / 1000);
    const days = Math.floor(secTotal / 86400);
    const hours = Math.floor((secTotal % 86400) / 3600);
    const minutes = Math.floor((secTotal % 3600) / 60);
    const seconds = secTotal % 60;

    return { days, hours, minutes, seconds, finished: false };
  };

  // State for countdown
  const [time, setTime] = useState(getTimeLeft());

  // Update every second
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        const next = getTimeLeft();
        // stop interval once finished
        if (next.finished && !prev.finished) {
          clearInterval(id);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, []); // targetDate is constant here

  // Box Component
  const Box = ({ value, label }) => (
    <div className="w-28 h-28 bg-white rounded-xl shadow flex flex-col items-center justify-center">
      <div className="text-teal-700 text-3xl font-extrabold">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-slate-400 text-xs tracking-wider mt-1 uppercase">
        {label}
      </div>
    </div>
  );

  return (
    <section className="py-14 bg-transparent  max-h-screen">
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-slate-800 mb-3">
          {time.finished ? "Happy New Year 2026! 🎉" : "Event Starts In"}
        </h2>

        {!time.finished && (
          <>
            <p className="text-slate-500 mb-8">
              Countdown to LokRaja 2026
            </p>

            {/* Countdown Boxes */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <Box value={time.days} label="Days" />
                <Box value={time.hours} label="Hours" />
                <Box value={time.minutes} label="Minutes" />
                <Box value={time.seconds} label="Seconds" />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default EventCountdown;
