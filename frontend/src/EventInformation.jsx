import { LuCalendarDays, LuMapPin, LuUsers, LuClock } from "react-icons/lu";

function EventInformation() {
  return (
    <>
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto text-center px-4">

          {/* Heading */}
          <h2 className="text-4xl font-extrabold text-slate-800">
            Event Information
          </h2>

          {/* Subtitle */}
          <p className="text-slate-500 mt-2 mb-12 text-lg">
            Everything you need to know about LokRaja Marathon - Chapter Pune 2026
          </p>

          {/* 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Card 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-10 text-center">
              <LuCalendarDays className="text-teal-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800">Date & Time</h3>
              <p className="text-slate-700 font-medium mt-2">April 12, 2026</p>
              {/* <p className="text-slate-400 mt-1">10:00 AM Start</p> */}
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-10 text-center">
              <LuMapPin className="text-teal-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800">Location</h3>
              <p className="text-slate-700 font-medium mt-2">Maharashtra</p>
              <p className="text-slate-400 mt-1">Pune City</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-10 text-center">
              <LuUsers className="text-teal-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800">Expected Runners</h3>
              <p className="text-slate-700 font-medium mt-2">500+</p>
              <p className="text-slate-400 mt-1">Participants</p>
            </div>

            {/* Card 4 */}
             <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-10 text-center">
              <LuClock className="text-teal-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800">Cut-off Time</h3>
              <p className="text-slate-700 font-medium mt-2">6 Hours</p>
              <p className="text-slate-400 mt-1">Maximum</p>
            </div>
            

          </div>
        </div>
      </section>
    </>
  );
}

export default EventInformation;
