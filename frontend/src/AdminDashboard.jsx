// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import for Excel support
import {
  FiUsers, FiDownload, FiSearch, FiActivity, FiHeart, FiAward,
  FiTrendingUp, FiGrid, FiClock, FiXCircle, FiCheckCircle,
  FiAlertCircle, FiX, FiEye, FiInfo, FiExternalLink, FiMapPin, FiCreditCard, FiRotateCcw
} from "react-icons/fi";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [regFilter, setRegFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState({ users: [], registrations: [], stats: {} });

  const [selectedReg, setSelectedReg] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // If there is no token, don't even try to fetch; redirect to login
        if (!token) {
          window.location.href = "/signin";
          return;
        }

        const PROD_BACKEND_URL = "https://backend.sprintssagaindia.com";
        const API_BASE_URL = window.location.hostname === "localhost"
          ? "http://localhost:8000"
          : PROD_BACKEND_URL;

        const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard-data`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err.message);
        // If the server says 401, the token is expired/invalid. Redirect to login.
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/signin";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  const formatDate = (dateObj) => {
    if (!dateObj) return "N/A";
    const raw = dateObj.$date || dateObj;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return "N/A";

    // Since we saved at 12:00 PM, these will ALWAYS return the correct Day/Month
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    if (year === 1900) return "N/A";
    return `${day}/${month}/${year}`;
};

  const resetFilters = () => {
    setRegFilter("all");
    setCatFilter("all");
    setStatusFilter("all");
    setSearchTerm("");
  };

  // --- FILTERED USERS ---
  const filteredUsers = (data.users || []).filter(u => {
    const s = searchTerm.toLowerCase();
    const joinDate = formatDate(u.createdAt).toLowerCase();
    return (
      u.name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u._id?.toLowerCase().includes(s) ||
      u.phone?.toLowerCase().includes(s) ||
      joinDate.includes(s)
    );
  });

  const regs = data.registrations || [];

  // TRANSFORM DATA: Flatten Group Members into individual rows for the Admin Panel
  const tableRows = regs.flatMap((r) => {
    if (r.registrationType === 'group' && r.groupMembers && r.groupMembers.length > 0) {
      return r.groupMembers.map((member, index) => ({
        ...r,
        displayDetails: member,
        isGroupMember: true,
        memberPosLabel: `Member ${index + 1}`,
        rowId: `${r._id}-${index}`
      }));
    }
    return [{
      ...r,
      displayDetails: r.runnerDetails,
      isGroupMember: false,
      memberPosLabel: "Individual",
      rowId: r._id
    }];
  });

  // --- FILTERED REGISTRATIONS ---
  const filteredRegistrations = tableRows.filter((r) => {
    const matchesType = regFilter === "all" || r.registrationType === regFilter;
    const matchesCategory = catFilter === "all" || r.raceCategory === catFilter;
    const matchesStatus = statusFilter === "all" || r.paymentStatus === statusFilter;
    const s = searchTerm.toLowerCase();
    if (!s) return matchesType && matchesCategory && matchesStatus;

    const searchBlob = [
      r.displayDetails?.firstName, r.displayDetails?.lastName, r.displayDetails?.email,
      r.displayDetails?.phone, r.displayDetails?.whatsapp, r.displayDetails?.gender,
      r.displayDetails?.bloodGroup, r.displayDetails?.nationality, r.displayDetails?.address,
      r.displayDetails?.city, r.displayDetails?.state, r.displayDetails?.pincode,
      r.displayDetails?.country, r.displayDetails?.experience, r.displayDetails?.finishTime,
      r.displayDetails?.dietary, r.displayDetails?.tshirtSize, r.displayDetails?.parentName,
      r.displayDetails?.parentPhone, r.registrationType, r.raceCategory, r.groupName,
      r.paymentStatus, r.paymentDetails?.paymentId, r.paymentDetails?.orderId,
      r.idProof?.idNumber, r.idProof?.idType, r.amount?.toString(), (r.displayDetails?.dob ? formatDate(r.displayDetails.dob) : "")
    ].join(" ").toLowerCase();

    return matchesType && matchesCategory && matchesStatus && searchBlob.includes(s);
  });

  // --- DYNAMIC STATS BASED ON CURRENT TAB ---
  const dynamicStats = activeTab === "users" ? {
    "Total Users": filteredUsers.length,
    "Search Matches": filteredUsers.length
  } : {
    matches: filteredRegistrations.length,
    individual: filteredRegistrations.filter(r => r.registrationType === 'individual').length,
    group: [...new Set(filteredRegistrations.filter(r => r.registrationType === 'group').map(r => r._id))].length,
    charity: filteredRegistrations.filter(r => r.registrationType === 'charity').length,
    // paid: filteredRegistrations.filter(r => r.paymentStatus === 'paid').length,
    // pending: filteredRegistrations.filter(r => r.paymentStatus === 'pending' || r.paymentStatus === 'Pending Payment').length,
    // rejected: filteredRegistrations.filter(r => r.paymentStatus === 'rejected').length,
    paid: [...new Set(filteredRegistrations.filter(r => r.paymentStatus === 'paid').map(r => r._id))].length,
    pending: [...new Set(filteredRegistrations.filter(r => r.paymentStatus === 'pending' || r.paymentStatus === 'Pending Payment').map(r => r._id))].length,
    rejected: [...new Set(filteredRegistrations.filter(r => r.paymentStatus === 'rejected').map(r => r._id))].length,
    revenue: filteredRegistrations.filter(r => r.paymentStatus === 'paid')
      .reduce((acc, curr) => {
        const isFirstMember = !curr.isGroupMember || curr.memberPosLabel === "Member 1";
        return isFirstMember ? acc + (Number(curr.amount) || Number(curr.runnerDetails?.amount) || 0) : acc;
      }, 0)
  };

  // --- EXPORT LOGIC (SWITCHES DATA BASED ON ACTIVE TAB) ---
  const handleExportExcel = () => {
    let exportData = [];
    let fileName = "";

    if (activeTab === "users") {
      fileName = `SSI_Users_Accounts_${new Date().toLocaleDateString()}`;
      exportData = filteredUsers.map(u => ({
        "Name": u.name || "N/A",
        "Email": u.email || "N/A",
        "User ID": u._id || "N/A",
        "Phone": u.phone || "N/A",
        "Joined At": new Date(u.createdAt).toLocaleDateString(),
        "DOB": (r.displayDetails?.dob ? formatDate(r.displayDetails.dob) : "N/A"), // For Registrations
        "Paid Date": (r.paymentDetails?.paidAt ? formatDate(r.paymentDetails.paidAt) : "N/A")
      }));
    } else {
      fileName = `SSI_Registrations_${new Date().toLocaleDateString()}`;
      exportData = filteredRegistrations.map(r => ({
        "First Name": r.displayDetails?.firstName || "N/A",
        "Last Name": r.displayDetails?.lastName || "N/A",
        "Group Name/Individual Account": r.groupName ? `${r.groupName} (${r.memberPosLabel})` : "Individual Account",
        "Registration Type": r.registrationType || "N/A",
        // "Race Category": r.raceCategory || "N/A",
        "Race Category": r.displayDetails?.raceCategory || r.raceCategory || "N/A",
        "Email": r.displayDetails?.email || "N/A",
        "Phone": r.displayDetails?.phone || "N/A",
        "WhatsApp": r.displayDetails?.whatsapp || "N/A",
        "DOB": formatDate(r.displayDetails?.dob),
        "Gender": r.displayDetails?.gender || "N/A",
        "Blood Group": r.displayDetails?.bloodGroup || "N/A",
        "Nationality": r.displayDetails?.nationality || "N/A",
        "Address": r.displayDetails?.address || r.runnerDetails?.address || "N/A",
        "City": r.displayDetails?.city || "N/A",
        "State": r.displayDetails?.state || "N/A",
        "Pincode": r.displayDetails?.pincode || "N/A",
        "Experience": r.displayDetails?.experience || "N/A",
        "T-Shirt Size": r.displayDetails?.tshirtSize || "N/A",
        "Parent Name": r.displayDetails?.parentName || "N/A",
        "Parent Phone": r.displayDetails?.parentPhone || "N/A",
        "Registration Fee": (!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.registrationFee || 0) : "—",
        "Coupon": r.couponCode || "N/A",
        "Discount": (!r.isGroupMember || r.memberPosLabel === "Member 1")
          ? (r.registrationType === "individual" ? `₹${r.discountAmount || 0}` : `${r.discountPercent || 0}%`)
          : "—",
        "Total Amount Paid": (!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.amount || 0) : "—",
        "Order ID": r.paymentDetails?.orderId || "N/A",
        "Payment ID": r.paymentDetails?.paymentId || "N/A",
        "Payment Status": r.paymentStatus || "N/A",
        "Paid Date": formatDate(r.paymentDetails?.paidAt)
      }));
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab === "users" ? "Users" : "Registrations");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const subTabClasses = (isActive) =>
    `px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border transition flex items-center gap-2 ${isActive
      ? "bg-teal-600 border-teal-600 text-white shadow-md"
      : "bg-white border-slate-200 text-slate-500 hover:border-teal-500"}`;

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 tracking-widest animate-pulse">SYNCING SSI DATABASE...</div>;

  return (
    <main className="min-h-screen bg-slate-50 pb-16 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-16">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin <span className="text-teal-600 underline decoration-teal-200 underline-offset-8">Panel</span></h1>
            <p className="mt-2 text-slate-400 text-sm font-medium italic">Official Sprints Saga India Event Management</p>
          </div>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition shadow-lg active:scale-95"
          >
            <FiDownload /> DOWNLOAD EXCEL
          </button>
        </div>

        {/* DYNAMIC STATS SECTION */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-10 text-slate-900">
          {Object.entries(dynamicStats).map(([key, val]) => (
            <div key={key} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 transition hover:shadow-md">
              <p className="text-[9px] uppercase font-black text-slate-400 mb-1 tracking-widest">{key}</p>
              <p className="text-lg font-bold text-slate-900">{key === 'revenue' ? `₹${val.toFixed(2)}` : val}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-slate-200/50 rounded-full p-1 flex gap-1 w-full md:w-80 border border-slate-200">
            <button className={`flex-1 py-2 rounded-full text-xs font-bold transition ${activeTab === "users" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`} onClick={() => setActiveTab("users")}>Users Accounts</button>
            <button className={`flex-1 py-2 rounded-full text-xs font-bold transition ${activeTab === "registrations" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`} onClick={() => setActiveTab("registrations")}>Registrations</button>
          </div>

          {activeTab === "registrations" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                  <FiGrid className="text-teal-600" /> Active Filters
                </span>
                <button onClick={resetFilters} className="text-[10px] font-bold text-rose-500 flex items-center gap-1 hover:underline">
                  <FiRotateCcw size={12} /> Reset All
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase text-slate-400">Filter By Type</span>
                <div className="flex flex-wrap gap-2">
                  {['all', 'individual', 'group', 'charity'].map(t => (
                    <button key={t} onClick={() => setRegFilter(t)} className={subTabClasses(regFilter === t)}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase text-slate-400">Payment Status</span>
                <div className="flex flex-wrap gap-2">
                  {['all', 'paid', 'pending', 'rejected'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={subTabClasses(statusFilter === s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase text-slate-400">Race Distance</span>
                <div className="flex flex-wrap gap-2">
                  {['all', '5k', '10k', '21k', '35k', '42k'].map(r => (
                    <button key={r} onClick={() => setCatFilter(r)} className={subTabClasses(catFilter === r)}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 relative text-slate-900">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search by any member field, Payment ID, or Address...`}
            className="w-full pl-11 pr-12 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 transition bg-white text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"><FiX /></button>}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {((activeTab === "users" && filteredUsers.length > 0) || (activeTab === "registrations" && filteredRegistrations.length > 0)) ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className={`min-w-full text-sm text-left table-fixed ${activeTab === "registrations" ? "min-w-[6500px]" : ""}`}>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-widest">
                  <tr>
                    {activeTab === "users" ? (
                      <><th className="p-5 w-48">Name</th><th className="p-5 w-64">Email</th><th className="p-5 w-48">User ID</th><th className="p-5 w-48">Phone</th><th className="p-5 w-48">Created At</th></>
                    ) : (
                      <>
                        <th className="p-5 sticky left-0 bg-slate-50 z-30 w-48 border-r">First Name</th>
                        <th className="p-5 sticky left-48 bg-slate-50 z-30 w-48 border-r">Last Name</th>
                        <th className="p-5 w-48 text-teal-700">Group Name Individual Account</th>
                        <th className="p-5 w-40">Registration Type</th>
                        <th className="p-5 w-48 text-teal-600">Registration Category</th>
                        <th className="p-5 w-64">Member Email</th>
                        <th className="p-5 w-48">Phone Number</th>
                        <th className="p-5 w-48">WhatsApp Number</th>
                        <th className="p-5 w-40">DOB</th>
                        <th className="p-5 w-32">Gender</th>
                        <th className="p-5 w-40 text-rose-600">Blood Group</th>
                        <th className="p-5 w-40">Nationality</th>
                        <th className="p-5 w-[500px]" style={{ minWidth: '500px' }}>Address</th>
                        <th className="p-5 w-48">City</th>
                        <th className="p-5 w-48">State</th>
                        <th className="p-5 w-40">Pincode</th>
                        <th className="p-5 w-40">Country</th>
                        <th className="p-5 w-40">Experience</th>
                        <th className="p-5 w-40">Finish Time</th>
                        <th className="p-5 w-40">Dietary</th>
                        <th className="p-5 w-40 font-black">T-Shirt Size</th>
                        <th className="p-5 w-64">Parent Name</th>
                        <th className="p-5 w-64">Parent Phone Number</th>
                        <th className="p-5 w-48">Registration Fee</th>
                        <th className="p-5 w-48 text-slate-400">Coupon Code</th>
                        {/* <th className="p-5 w-48 text-slate-400">Discount Percent</th> */}
                        <th className="p-5 w-48 text-slate-400">Discount</th>
                        <th className="p-5 w-48 text-slate-400">Platform Fee</th>
                        <th className="p-5 w-48 text-slate-400">PG Fee</th>
                        <th className="p-5 w-48 text-slate-400">GST Amount</th>
                        <th className="p-5 w-48 font-black text-slate-900 bg-slate-50">Amount</th>
                        <th className="p-5 w-40">ID Type</th>
                        <th className="p-5 w-64">ID Number</th>
                        <th className="p-5 w-64">ID Path</th>
                        <th className="p-5 w-64">Order ID</th>
                        <th className="p-5 w-64">Payment ID</th>
                        <th className="p-5 w-40">Status</th>
                        <th className="p-5 w-64">Paid At</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeTab === "users" ? filteredUsers : filteredRegistrations).map((r) => (
                    <tr key={r.rowId || r._id} className="hover:bg-slate-50 transition text-[12px] font-bold text-slate-900 uppercase">
                      {activeTab === "users" ? (
                        <>
                          <td className="p-5 font-bold text-teal-800 uppercase">{r.name}</td>
                          <td className="p-5 text-slate-700 font-medium lowercase">{r.email}</td>
                          <td className="p-5 text-slate-900 font-mono text-[12px] font-bold tracking-tight">{r._id}</td>
                          <td className="p-5 text-slate-900 font-bold font-mono">{r.phone || "N/A"}</td>
                          <td className="p-5 text-slate-900 font-bold">{formatDate(r.createdAt)}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-5 sticky left-0 bg-white z-10 border-r" style={{ width: '192px', minWidth: '192px' }}>{r.displayDetails?.firstName || "N/A"}</td>
                          <td className="p-5 sticky left-48 bg-white z-10 border-r" style={{ width: '192px', minWidth: '192px' }}>{r.displayDetails?.lastName || "N/A"}</td>
                          <td className="p-5 text-teal-700 font-black">{r.groupName ? `${r.groupName} (${r.memberPosLabel})` : "Individual Account"}</td>
                          <td className="p-5 text-slate-400 font-black">{r.registrationType || "N/A"}</td>
                          {/* <td className="p-5 text-teal-600 font-black">{r.raceCategory || "N/A"}</td> */}
                          <td className="p-5 text-teal-600 font-black">
                            {r.displayDetails?.raceCategory || r.raceCategory || "N/A"}
                          </td>
                          <td className="p-5 lowercase font-medium">{r.displayDetails?.email || "N/A"}</td>
                          <td className="p-5 font-mono">{r.displayDetails?.phone || "N/A"}</td>
                          <td className="p-5 font-mono">{r.displayDetails?.whatsapp || "N/A"}</td>
                          <td className="p-5">{formatDate(r.displayDetails?.dob)}</td>
                          <td className="p-5">{r.displayDetails?.gender || "N/A"}</td>
                          <td className="p-5 text-rose-600">{r.displayDetails?.bloodGroup || "N/A"}</td>
                          <td className="p-5">{r.displayDetails?.nationality || "N/A"}</td>
                          <td className="p-5 whitespace-normal wrap-break-words" style={{ width: '500px', minWidth: '500px' }}>{r.displayDetails?.address || r.runnerDetails?.address || "N/A"}</td>
                          <td className="p-5">{r.displayDetails?.city || r.runnerDetails?.city || "N/A"}</td>
                          <td className="p-5">{r.displayDetails?.state || r.runnerDetails?.state || "N/A"}</td>
                          <td className="p-5">{r.displayDetails?.pincode || r.runnerDetails?.pincode || "N/A"}</td>
                          <td className="p-5">{r.displayDetails?.country || r.runnerDetails?.country || "N/A"}</td>
                          <td className="p-5">{r.displayDetails?.experience || "N/A"}</td>
                          <td className="p-5">{r.displayDetails?.finishTime || "N/A"}</td>
                          <td className="p-5">{r.displayDetails?.dietary || "N/A"}</td>
                          <td className="p-5 font-black">{r.displayDetails?.tshirtSize || "N/A"}</td>
                          <td className="p-5">{r.displayDetails?.parentName || "N/A"}</td>
                          <td className="p-5">{r.displayDetails?.parentPhone || "N/A"}</td>
                          {/* Scenario 1: Financial data only for Leader or Individual */}
                          <td className="p-5">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${r.registrationFee || r.displayDetails?.registrationFee || 0}` : "—"}
                          </td>
                          <td className="p-5 italic text-slate-400">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.couponCode || "N/A") : "—"}
                          </td>
                          <td className="p-5 text-slate-400">
                            {/* {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `${r.discountPercent || 0}%` : "—"} */}
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (
                              r.registrationType === "individual"
                                ? `₹${r.discountAmount || 0}` // Show amount for individual
                                : `${r.discountPercent || 0}%`  // Show percentage for group
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="p-5 text-slate-500">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${r.platformFee || 0}` : "—"}
                          </td>
                          <td className="p-5 text-slate-500">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${r.pgFee || 0}` : "—"}
                          </td>
                          <td className="p-5 text-slate-500">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${r.gstAmount || 0}` : "—"}
                          </td>
                          <td className="p-5 font-black bg-slate-50 border-x">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${(r.amount || r.runnerDetails?.amount || 0).toFixed(2)}` : "—"}
                          </td>
                          <td className="p-5 text-slate-500">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.idProof?.idType || "N/A") : "—"}
                          </td>
                          <td className="p-5 font-mono tracking-tighter">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.idProof?.idNumber || "N/A") : "—"}
                          </td>
                          <td className="p-5">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (
                              <a href={r.idProof?.path} target="_blank" rel="noreferrer"
                                className="text-teal-600 hover:underline flex items-center gap-1">
                                <FiExternalLink /> VIEW FILE
                              </a>
                            ) : "—"}
                          </td>
                          <td className="p-5 font-mono text-[10px] text-slate-400">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.paymentDetails?.orderId || "N/A") : "—"}
                          </td>
                          <td className="p-5 font-mono text-teal-700">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.paymentDetails?.paymentId || "N/A") : "—"}
                          </td>
                          <td className="p-5 text-center">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white ${r.paymentStatus === 'paid' ? 'bg-teal-600' : 'bg-amber-500'}`}>
                                {r.paymentStatus || "N/A"}
                              </span>
                            ) : "—"}
                          </td>
                          <td className="p-5 text-slate-400">
                            {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? formatDate(r.paymentDetails?.paidAt) : "—"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <FiAlertCircle className="text-slate-200 size-12 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching records found</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;