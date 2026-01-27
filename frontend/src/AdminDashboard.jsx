// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiDownload, FiSearch, FiFilter, FiTag } from "react-icons/fi";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState({ users: [], registrations: [], stats: {} });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found! Redirecting to login...");
          return;
        }

        const PROD_BACKEND_URL = "https://backend.sprintssagaindia.com";

        // Dynamic base URL logic
        const API_BASE_URL = window.location.hostname === "localhost"
          ? "http://localhost:8000"
          : PROD_BACKEND_URL;

        const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard-data`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Admin Data Received:", res.data); // DEBUG LOG

        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Fetch Error Detail:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Filter Logic based on search input
  const filteredRegistrations = (data.registrations || []).filter((r) => {
    // 1. Determine the searchable name based on registration type
    const firstName = r.runnerDetails?.firstName || "";
    const lastName = r.runnerDetails?.lastName || "";
    const groupName = r.groupName || "";

    const searchableName = r.registrationType === 'individual'
      ? `${firstName} ${lastName}`.toLowerCase()
      : groupName.toLowerCase();

    // 2. Safe check with .includes()
    return searchableName.includes((searchTerm || "").toLowerCase());
  });

  const tabClasses = (tab) =>
    `flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition
     ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`;

  const renderStatusBadge = (status) => {
    const displayStatus = status === "paid" ? "Paid" : status;
    let color = "bg-teal-600"; // For 'paid' or 'Verified'
    if (status === "pending" || status === "Pending Payment") color = "bg-amber-500";
    if (status === "failed") color = "bg-rose-500";

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white ${color}`}>
        {displayStatus}
      </span>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-700 mb-4"></div>
      <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Accessing SSI Database...</p>
    </div>
  );

  const statsCards = [
    { label: "Total", value: data.stats.total || 0 },
    { label: "Individual", value: data.stats.individual || 0 },
    { label: "Group", value: data.stats.group || 0 },
    { label: "Paid", value: data.stats.paid || 0 },
    { label: "Pending", value: data.stats.pending || 0 },
    { label: "Revenue", value: `₹${Math.round(data.stats.revenue || 0)}` },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-16">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight ">Admin <span className="text-teal-600 underline decoration-teal-200 underline-offset-8">Panel</span></h1>
            <p className="mt-2 text-slate-400 text-sm font-medium">Sprints Saga India Event Management System</p>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition shadow-lg">
            <FiDownload /> DOWNLOAD CSV
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {statsCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 transition hover:shadow-md">
              <p className="text-[10px] uppercase font-black text-slate-300 mb-1 tracking-widest">{card.label}</p>
              <p className="text-xl font-bold text-slate-800">{card.value}</p>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="bg-slate-200/50 rounded-full p-1 flex gap-1 w-full md:w-80 border border-slate-200">
            <button className={tabClasses("users")} onClick={() => setActiveTab("users")}>Users</button>
            <button className={tabClasses("registrations")} onClick={() => setActiveTab("registrations")}>Registrations</button>
          </div>

          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search by ${activeTab === 'users' ? 'name or email' : 'participant or team name'}...`}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  {activeTab === "users" ? (
                    <>
                      <th className="p-5">Account User</th>
                      <th className="p-5">Email Address</th>
                      <th className="p-5">Phone</th>
                      <th className="p-5">Join Date</th>
                    </>
                  ) : (
                    <>
                      <th className="p-5">Participant / Group</th>
                      <th className="p-5">Race</th>
                      <th className="p-5">Status</th>
                      <th className="p-5">Payment ID</th>
                      <th className="p-5">T-Shirt</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTab === "users" ? (
                  data.users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 transition">
                      <td className="p-5 font-bold text-teal-800">{u.name}</td>
                      <td className="p-5 text-slate-600">{u.email}</td>
                      <td className="p-5 text-slate-500 font-mono">{u.phone || "---"}</td>
                      <td className="p-5 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  filteredRegistrations.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50 transition">
                      <td className="p-5">
                        <div className="font-bold text-slate-800">
                          {r.registrationType === 'individual' ? `${r.runnerDetails?.firstName} ${r.runnerDetails?.lastName}` : r.groupName}
                        </div>
                        <span className="text-[9px] uppercase font-black text-slate-300 px-1.5 py-0.5 border rounded-md">{r.registrationType}</span>
                      </td>
                      <td className="p-5"><span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-teal-100 uppercase">{r.raceCategory}</span></td>
                      <td className="p-5">{renderStatusBadge(r.paymentStatus)}</td>
                      <td className="p-5 font-mono text-[11px] text-slate-400">{r.paymentDetails?.paymentId || "Pending"}</td>
                      <td className="p-5 font-bold text-slate-600 uppercase">
                        {r.registrationType === 'individual' ? r.runnerDetails?.tshirtSize : `${r.groupMembers?.length} Tees`}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;