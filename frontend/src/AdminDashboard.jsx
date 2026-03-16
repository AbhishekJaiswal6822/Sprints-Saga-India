import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import for Excel support
import {
  FiUsers, FiDownload, FiSearch, FiActivity, FiHeart, FiAward,
  FiTrendingUp, FiGrid, FiClock, FiXCircle, FiCheckCircle,
  FiAlertCircle, FiX, FiEye, FiInfo, FiExternalLink, FiMapPin, FiCreditCard, FiRotateCcw,
  FiTag, FiPlus, FiTrash2, FiZap
} from "react-icons/fi";

function AdminDashboard() {
// --- MOVE THESE 3 LINES HERE (Line 13) ---
    const PROD_BACKEND_URL = "https://backend.sprintssagaindia.com";
    const API_BASE_URL = window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : PROD_BACKEND_URL;

    const [activeTab, setActiveTab] = useState("users");
  const [regFilter, setRegFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState({ users: [], registrations: [], stats: {} });

  const [selectedReg, setSelectedReg] = useState(null);

  const [couponData, setCouponData] = useState({ code: '', discountType: 'PERCENT', discountValue: 0 });
  const [coupons, setCoupons] = useState([]); // To list existing coupons
  const [couponLoading, setCouponLoading] = useState(false);
  
  // NEW STATE: Specific search for coupons to avoid interfering with global search
  const [couponSearch, setCouponSearch] = useState("");

  // 1. Fetch coupons list
  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setCoupons(res.data.data);
    } catch (err) { console.error("Fetch Coupons Error:", err.message); }
  };

  // 2. Toggle Status
  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE_URL}/api/coupons/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons(); // Refresh list
    } catch (err) { alert("Failed to toggle status"); }
  };

  // 3. Delete Coupon
  const deleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons(); // Refresh list
    } catch (err) { alert("Failed to delete coupon"); }
  };

  // 4. Update useEffect to fetch coupons when tab changes
  useEffect(() => {
    if (activeTab === "coupons") fetchCoupons();
  }, [activeTab]);

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

  /**
   * Handles the creation of a new discount coupon.
   * Triggered by the "Generate Coupon" form in the Admin Panel.
   */
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponLoading(true);
    try {
      const token = localStorage.getItem("token");
      const PROD_BACKEND_URL = "https://backend.sprintssagaindia.com";
      const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:8000" : PROD_BACKEND_URL;

      const res = await axios.post(`${API_BASE_URL}/api/coupons`, couponData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert("Coupon Generated Successfully!");
        setCouponData({ code: '', discountType: 'PERCENT', discountValue: 0 });
        fetchCoupons(); // refresh the list
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to create coupon"));
    } finally {
      setCouponLoading(false);
    }
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
    // SMART CATEGORY FILTER: Handles variations like 21k, half, 21.097, etc.
    // STRICT CATEGORY FILTER: Ensures 5K does not show 35K
    const matchesCategory = (() => {
      if (catFilter === "all") return true;

      // Normalize the text from the database to lowercase and trim spaces
      const rawData = (r.displayDetails?.raceCategory || r.raceCategory || "").toLowerCase().trim();

      // STRICT 5K: Match only if it is exactly "5k" or includes specific "5 km" text
      if (catFilter === "5k") {
        return rawData === "5k" || rawData === "5 km" || rawData.includes("5k fun run");
      }

      if (catFilter === "10k") {
        return rawData === "10k" || rawData === "10 km" || rawData.includes("10k challenge");
      }

      if (catFilter === "21k") {
        return rawData === "21k" ||
          rawData.includes("21.097") ||
          rawData.includes("half marathon") ||
          rawData === "half";
      }

      if (catFilter === "35k") {
        return rawData === "35k" || rawData.includes("35k ultra") || rawData === "35 km";
      }

      if (catFilter === "42k") {
        return rawData === "42k" ||
          rawData.includes("full marathon") ||
          rawData === "full" ||
          rawData === "42.195";
      }

      return rawData === catFilter;
    })();
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
      r.displayDetails?.parentPhone, r.registrationType,
      r.displayDetails?.raceCategory,
      r.raceCategory,
      r.groupName,
      r.paymentStatus, r.paymentDetails?.paymentId, r.paymentDetails?.orderId,
      r.idProof?.idNumber, r.idProof?.idType, r.amount?.toString(), (r.displayDetails?.dob ? formatDate(r.displayDetails.dob) : "")
    ].join(" ").toLowerCase();

    return matchesType && matchesCategory && matchesStatus && searchBlob.includes(s);
  });

  // NEW: Filtered Coupons for the dedicated Coupon Search
  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(couponSearch.toLowerCase())
  );

  // --- DYNAMIC STATS BASED ON CURRENT TAB ---
  const dynamicStats = (() => {
    if (activeTab === "users") {
      return {
        "Total Users": filteredUsers.length,
        "Search Matches": filteredUsers.length
      };
    } else if (activeTab === "coupons") {
      return {
        "Total Coupons": coupons.length,
        "Active Codes": coupons.filter(c => c.isActive).length,
        "Percentage Coupon": coupons.filter(c => c.discountType === 'PERCENT').length,
        "Flat Coupon": coupons.filter(c => c.discountType === 'FLAT').length
      };
    } else {
      return {
        matches: filteredRegistrations.length,
        individual: filteredRegistrations.filter(r => r.registrationType === 'individual').length,
        group: [...new Set(filteredRegistrations.filter(r => r.registrationType === 'group').map(r => r._id))].length,
        charity: filteredRegistrations.filter(r => r.registrationType === 'charity').length,
        paid: [...new Set(filteredRegistrations.filter(r => r.paymentStatus === 'paid').map(r => r._id))].length,
        pending: [...new Set(filteredRegistrations.filter(r => r.paymentStatus === 'pending' || r.paymentStatus === 'Pending Payment').map(r => r._id))].length,
        rejected: [...new Set(filteredRegistrations.filter(r => r.paymentStatus === 'rejected').map(r => r._id))].length,
        revenue: filteredRegistrations.filter(r => r.paymentStatus === 'paid')
          .reduce((acc, curr) => {
            const isFirstMember = !curr.isGroupMember || curr.memberPosLabel === "Member 1";
            return isFirstMember ? acc + (Number(curr.amount) || Number(curr.runnerDetails?.amount) || 0) : acc;
          }, 0)
      };
    }
  })();

  // --- EXPORT LOGIC (UNCHANGED) ---
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
        "Joined At": new Date(u.createdAt).toLocaleDateString()
      }));
    } else {
      fileName = `SSI_Registrations_${new Date().toLocaleDateString()}`;
      exportData = filteredRegistrations.map(r => ({
        "First Name": r.displayDetails?.firstName || "N/A",
        "Last Name": r.displayDetails?.lastName || "N/A",
        "Group Name/Individual Account": r.groupName ? `${r.groupName} (${r.memberPosLabel})` : "Individual Account",
        "Registration Type": r.registrationType || "N/A",
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
    <main className="min-h-screen bg-[#fcfdfe] pb-16 font-sans text-slate-900 selection:bg-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-16">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Admin <span className="text-teal-600 underline decoration-teal-200 underline-offset-8">Panel</span></h1>
            <p className="mt-2 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Official Sprints Saga India Event Management</p>
          </div>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-[11px] font-black tracking-widest text-white hover:bg-slate-800 transition shadow-2xl active:scale-95"
          >
            <FiDownload /> DOWNLOAD EXCEL
          </button>
        </div>

        {/* DYNAMIC STATS SECTION */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-10 text-slate-900">
          {Object.entries(dynamicStats).map(([key, val]) => (
            <div key={key} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 transition hover:shadow-md group">
              <p className="text-[9px] uppercase font-black text-slate-400 mb-1.5 tracking-widest group-hover:text-teal-500 transition-colors">{key}</p>
              <p className="text-xl font-black text-slate-900 tracking-tighter">{key === 'revenue' ? `₹${val.toFixed(2)}` : val}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 mb-8">
          {/* Tab Switcher */}
          <div className="bg-slate-100 rounded-4xl p-2 flex gap-3 w-full border border-slate-200 shadow-inner">
            <button className={`flex-1 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "users" ? "bg-white text-teal-700 shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setActiveTab("users")}>Users Accounts</button>
            <button className={`flex-1 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "registrations" ? "bg-white text-teal-700 shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setActiveTab("registrations")}>Registrations</button>
            <button className={`flex-1 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "coupons" ? "bg-white text-teal-700 shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setActiveTab("coupons")}>Coupons</button>
          </div>

          {/* --- COUPONS TAB: UI UPDATED WITH LOCAL SEARCH --- */}
          {activeTab === "coupons" && (
            <div className="grid lg:grid-cols-[400px_1fr] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Left Side: Create Form */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <FiZap size={120} />
                </div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-200">
                        <FiPlus />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Create Coupon</h2>
                </div>
                
                <form onSubmit={handleCreateCoupon} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. SUMMER20"
                      className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-teal-500 bg-slate-50/50 outline-none transition-all font-black uppercase text-slate-700 placeholder:text-slate-300"
                      value={couponData.code}
                      onChange={(e) => setCouponData({ ...couponData, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Type</label>
                      <select
                        className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-teal-500 bg-slate-50/50 outline-none transition-all font-bold text-slate-700"
                        value={couponData.discountType}
                        onChange={(e) => setCouponData({ ...couponData, discountType: e.target.value })}
                      >
                        <option value="PERCENT">PERCENTAGE %</option>
                        <option value="FLAT">FLAT ₹</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Value</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-teal-500 bg-slate-50/50 outline-none transition-all font-black text-slate-700"
                        value={couponData.discountValue}
                        onChange={(e) => setCouponData({ ...couponData, discountValue: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={couponLoading} className="w-full py-5 rounded-2xl bg-slate-900 text-teal-400 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                    {couponLoading ? "Establishing..." : "Deploy Coupon"}
                  </button>
                </form>
              </div>

              {/* Right Side: List and SEARCH */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        type="text" 
                        placeholder="Search coupon identity..." 
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                        value={couponSearch}
                        onChange={(e) => setCouponSearch(e.target.value)}
                      />
                  </div>
                  <span className="px-4 py-1.5 bg-teal-50 text-teal-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-teal-100">
                    {filteredCoupons.length} Active Records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[9px] tracking-widest border-b border-slate-50">
                      <tr>
                        <th className="p-6">Identity</th>
                        <th className="p-6">Method</th>
                        <th className="p-6">Benefit</th>
                        <th className="p-6 text-center">Status Control</th>
                        <th className="p-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredCoupons.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/80 transition-all group">
                          <td className="p-6">
                            <span className="font-black text-slate-800 uppercase tracking-tighter text-lg">{c.code}</span>
                            <p className="text-[9px] text-slate-300 font-mono mt-0.5 tracking-widest uppercase">Ref: {c._id.substring(c._id.length - 6)}</p>
                          </td>
                          <td className="p-6">
                            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">{c.discountType}</span>
                          </td>
                          <td className="p-6">
                            <span className="text-xl font-black text-teal-600 tracking-tighter">
                                {c.discountType === 'FLAT' ? `₹${c.discountValue}` : `${c.discountValue}%`}
                            </span>
                          </td>
                          <td className="p-6 text-center">
                            <button
                              onClick={() => toggleStatus(c._id)}
                              className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${
                                  c.isActive 
                                  ? 'bg-teal-50 text-teal-600 border border-teal-200 shadow-sm shadow-teal-100' 
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'}`}
                            >
                              {c.isActive ? 'ONLINE' : 'OFFLINE'}
                            </button>
                          </td>
                          <td className="p-6 text-right">
                            <button onClick={() => deleteCoupon(c._id)} className="p-3 text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                              <FiTrash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCoupons.length === 0 && (
                      <div className="py-24 text-center flex flex-col items-center">
                          <FiInfo className="text-slate-200 mb-4" size={48} />
                          <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No matching coupons found</p>
                      </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- USERS & REGISTRATIONS SECTIONS: UNTOUCHED --- */}
        {activeTab !== "coupons" && (
            <>
                <div className="mb-6 relative text-slate-900">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder={`Search records...`}
                        className="w-full pl-11 pr-12 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 transition bg-white text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"><FiX /></button>}
                </div>

                {activeTab === "registrations" && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 mb-6 text-slate-900">
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
                        <tbody className="divide-y divide-slate-100 text-slate-900 font-bold uppercase">
                        {(activeTab === "users" ? filteredUsers : filteredRegistrations).map((r) => (
                            <tr key={r.rowId || r._id} className="hover:bg-slate-50 transition text-[12px] uppercase">
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
                                <td className="p-5">
                                    {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? `₹${r.registrationFee || r.displayDetails?.registrationFee || 0}` : "—"}
                                </td>
                                <td className="p-5 italic text-slate-400">
                                    {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (r.couponCode || "N/A") : "—"}
                                </td>
                                <td className="p-5 text-slate-400">
                                    {(!r.isGroupMember || r.memberPosLabel === "Member 1") ? (
                                    r.registrationType === "individual"
                                        ? `₹${r.discountAmount || 0}` 
                                        : `${r.discountPercent || 0}%` 
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
                    <div className="py-20 text-center flex flex-col items-center justify-center text-slate-900"><FiAlertCircle className="text-slate-200 size-12 mb-4" /><p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching records found</p></div>
                )}
                </div>
            </>
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;