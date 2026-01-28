import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiUsers, FiDownload, FiSearch, FiActivity, FiHeart, FiAward,
  FiTrendingUp, FiGrid, FiClock, FiXCircle, FiCheckCircle,
  FiAlertCircle, FiX, FiEye, FiInfo, FiExternalLink, FiMapPin, FiCreditCard
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
        const PROD_BACKEND_URL = "https://backend.sprintssagaindia.com";
        const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:8000" : PROD_BACKEND_URL;

        const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard-data`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatDate = (dateObj) => {
    if (!dateObj) return "---";
    const dateStr = dateObj.$date || dateObj;
    return new Date(dateStr).toLocaleDateString();
  };

  const filteredUsers = (data.users || []).filter(u => {
    const s = searchTerm.toLowerCase();
    const joinDate = new Date(u.createdAt).toLocaleDateString().toLowerCase();
    return (
      u.name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u._id?.toLowerCase().includes(s) ||
      u.phone?.toLowerCase().includes(s) ||
      joinDate.includes(s)
    );
  });

  const regs = data.registrations || [];
  const filteredRegistrations = regs.filter((r) => {
    const matchesType = regFilter === "all" || r.registrationType === regFilter;
    const matchesCategory = catFilter === "all" || r.raceCategory === catFilter;
    const matchesStatus = statusFilter === "all" || r.paymentStatus === statusFilter;
    const s = searchTerm.toLowerCase();
    const firstName = r.runnerDetails?.firstName || r.groupMembers?.[0]?.firstName || "";
    const lastName = r.runnerDetails?.lastName || r.groupMembers?.[0]?.lastName || "";
    const groupName = r.groupName || "";
    const email = r.runnerDetails?.email || r.groupMembers?.[0]?.email || "";
    const payId = r.paymentDetails?.paymentId || "";

    const matchesSearch =
      firstName.toLowerCase().includes(s) ||
      lastName.toLowerCase().includes(s) ||
      groupName.toLowerCase().includes(s) ||
      email.toLowerCase().includes(s) ||
      payId.toLowerCase().includes(s);

    return matchesType && matchesCategory && matchesSearch && matchesStatus;
  });

  const statsToDisplay = {
    matches: filteredRegistrations.length,
    individual: filteredRegistrations.filter(r => r.registrationType === 'individual').length,
    group: filteredRegistrations.filter(r => r.registrationType === 'group').length,
    charity: filteredRegistrations.filter(r => r.registrationType === 'charity').length,
    paid: filteredRegistrations.filter(r => r.paymentStatus === 'paid').length,
    pending: filteredRegistrations.filter(r => r.paymentStatus === 'pending' || r.paymentStatus === 'Pending Payment').length,
    rejected: filteredRegistrations.filter(r => r.paymentStatus === 'rejected').length,
    revenue: filteredRegistrations.filter(r => r.paymentStatus === 'paid').reduce((acc, curr) => acc + (Number(curr.amount) || Number(curr.runnerDetails?.amount) || 0), 0)
  };

  const subTabClasses = (isActive) =>
    `px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border transition flex items-center gap-2 ${isActive
      ? "bg-teal-600 border-teal-600 text-white shadow-md"
      : "bg-white border-slate-200 text-slate-500 hover:border-teal-500"}`;

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 tracking-widest animate-pulse">SYNCING SSI DATABASE...</div>;

  return (
    <main className="min-h-screen bg-slate-50 pb-16 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-16">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin <span className="text-teal-600 underline decoration-teal-200 underline-offset-8">Panel</span></h1>
            <p className="mt-2 text-slate-400 text-sm font-medium italic">Official Sprints Saga India Event Management</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition shadow-lg">
            <FiDownload /> EXPORT CSV
          </button>
        </div>

        {/* STATS SECTION */}
        {activeTab === "registrations" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-10 text-slate-900">
            {[
              { label: "Matches", value: statsToDisplay.matches },
              { label: "Individual", value: statsToDisplay.individual },
              { label: "Group", value: statsToDisplay.group },
              { label: "Charity", value: statsToDisplay.charity },
              { label: "Paid", value: statsToDisplay.paid },
              { label: "Pending", value: statsToDisplay.pending },
              { label: "Rejected", value: statsToDisplay.rejected },
              { label: "Revenue", value: `₹${Math.round(statsToDisplay.revenue)}` },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 transition hover:shadow-md">
                <p className="text-[9px] uppercase font-black text-slate-400 mb-1 tracking-widest">{card.label}</p>
                <p className="text-lg font-bold text-slate-900">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* FILTERS */}
        <div className="space-y-6 mb-8">
          <div className="bg-slate-200/50 rounded-full p-1 flex gap-1 w-full md:w-80 border border-slate-200">
            <button className={`flex-1 py-2 rounded-full text-xs font-bold transition ${activeTab === "users" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`} onClick={() => setActiveTab("users")}>Users Accounts</button>
            <button className={`flex-1 py-2 rounded-full text-xs font-bold transition ${activeTab === "registrations" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`} onClick={() => setActiveTab("registrations")}>Registrations</button>
          </div>

          {activeTab === "registrations" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
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

        {/* SEARCH */}
        <div className="mb-6 relative text-slate-900">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search by Name, Email, ID, or Phone...`}
            className="w-full pl-11 pr-12 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 transition bg-white text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"><FiX /></button>}
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {((activeTab === "users" && filteredUsers.length > 0) || (activeTab === "registrations" && filteredRegistrations.length > 0)) ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className={`min-w-full text-sm text-left table-fixed ${activeTab === "registrations" ? "min-w-[5500px]" : ""}`}>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-widest">
                  <tr>
                    {activeTab === "users" ? (
                      <><th className="p-5 w-48">Name</th><th className="p-5 w-64">Email</th><th className="p-5 w-48">User ID</th><th className="p-5 w-48">Phone</th><th className="p-5 w-48">Created At</th></>
                    ) : (
                      <>
                        {/* CONSTANT COLUMNS - STICKY WITHOUT OVERLAP */}
                        <th className="p-5 sticky left-0 bg-slate-50 z-30 w-40 border-r">First Name</th>
                        <th className="p-5 sticky left-40 bg-slate-50 z-30 w-40 border-r">Last Name</th>

                        {/* MOVABLE COLUMNS - SCROLL STARTS HERE */}
                        <th className="p-5 w-40">Registration Type</th>
                        <th className="p-5 w-48 text-teal-600">Registration Category</th>
                        <th className="p-5 w-64">Email</th>
                        <th className="p-5 w-48">Phone Number</th>
                        <th className="p-5 w-48">WhatsApp Number</th>
                        <th className="p-5 w-40">DOB</th>
                        <th className="p-5 w-32">Gender</th>
                        <th className="p-5 w-40 text-rose-600">Blood Group</th>
                        <th className="p-5 w-40">Nationality</th>
                        {/* <th className="p-5 w-96">Address</th> */}
                        <th className="p-5 w-[400px]" style={{ minWidth: '400px' }}>Address</th>
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
                        <th className="p-5 w-48 text-slate-400">Discount Percent</th>
                        <th className="p-5 w-48 text-slate-400">Platform Fee</th>
                        <th className="p-5 w-48 text-slate-400">PG Fee</th>
                        <th className="p-5 w-48 text-slate-400">GST Amount</th>
                        <th className="p-5 w-48 font-black text-slate-900">Amount</th>
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
                  {activeTab === "users" ? (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50 transition">
                        <td className="p-5 font-bold text-teal-800 uppercase">{u.name}</td>
                        <td className="p-5 text-slate-700 font-medium">{u.email}</td>
                        <td className="p-5 text-slate-900 font-mono text-[12px] font-bold tracking-tight">{u._id}</td>
                        <td className="p-5 text-slate-900 font-bold font-mono">{u.phone || "---"}</td>
                        <td className="p-5 text-slate-900 font-bold">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    filteredRegistrations.map((r) => (
                      <tr key={r._id} className="hover:bg-slate-50 transition text-[12px] font-bold text-slate-900 uppercase">
                        {/* CONSTANT DATA - STICKY CELLS */}
                        {/* <td className="p-5 sticky left-0 bg-white z-10 border-r">{r.runnerDetails?.firstName || r.groupMembers?.[0]?.firstName || "---"}</td>
                        <td className="p-5 sticky left-40 bg-white z-10 border-r">{r.runnerDetails?.lastName || r.groupMembers?.[0]?.lastName || "---"}</td> */}
                        {/* FIRST NAME: Set width to 150px and lock at 0 */}
                        <th className="p-5 sticky left-0 bg-slate-50 z-30 border-r" style={{ minWidth: '150px', width: '150px' }}>{r.runnerDetails?.firstName || r.groupMembers?.[0]?.firstName || "---"}</th>

                        {/* LAST NAME: Lock at exactly 150px (the end of First Name) */}
                        <th className="p-5 sticky left-[150px] bg-slate-50 z-30 border-r" style={{ minWidth: '150px', width: '150px' }}>{r.runnerDetails?.lastName || r.groupMembers?.[0]?.lastName || "---"}</th>

                        {/* MOVABLE DATA - STARTS HERE */}
                        <td className="p-5 text-slate-400 font-black">{r.registrationType}</td>
                        <td className="p-5 text-teal-600 font-black">{r.raceCategory}</td>
                        <td className="p-5 lowercase font-medium">{r.runnerDetails?.email || "---"}</td>
                        <td className="p-5 font-mono">{r.runnerDetails?.phone || "---"}</td>
                        <td className="p-5 font-mono">{r.runnerDetails?.whatsapp || "---"}</td>
                        <td className="p-5">{formatDate(r.runnerDetails?.dob)}</td>
                        <td className="p-5">{r.runnerDetails?.gender || "---"}</td>
                        <td className="p-5 text-rose-600">{r.runnerDetails?.bloodGroup || "---"}</td>
                        <td className="p-5">{r.runnerDetails?.nationality || "---"}</td>
                        <td className="p-5 truncate max-w-[250px]">{r.runnerDetails?.address || "---"}</td>
                        <td className="p-5">{r.runnerDetails?.city || "---"}</td>
                        <td className="p-5">{r.runnerDetails?.state || "---"}</td>
                        <td className="p-5">{r.runnerDetails?.pincode || "---"}</td>
                        <td className="p-5">{r.runnerDetails?.country || "---"}</td>
                        <td className="p-5">{r.runnerDetails?.experience || "---"}</td>
                        <td className="p-5">{r.runnerDetails?.finishTime || "---"}</td>
                        <td className="p-5">{r.runnerDetails?.dietary || "---"}</td>
                        <td className="p-5 font-black">{r.runnerDetails?.tshirtSize || "---"}</td>
                        <td className="p-5">{r.runnerDetails?.parentName || "---"}</td>
                        <td className="p-5">{r.runnerDetails?.parentPhone || "---"}</td>
                        <td className="p-5">₹{r.runnerDetails?.registrationFee || r.registrationFee || 0}</td>
                        <td className="p-5 italic text-slate-400">{r.runnerDetails?.couponCode || r.couponCode || "NONE"}</td>
                        <td className="p-5 text-slate-400">{r.runnerDetails?.discountPercent || 0}%</td>
                        <td className="p-5 text-slate-500">₹{r.runnerDetails?.platformFee || r.platformFee || 0}</td>
                        <td className="p-5 text-slate-500">₹{r.runnerDetails?.pgFee || r.pgFee || 0}</td>
                        <td className="p-5 text-slate-500">₹{r.runnerDetails?.gstAmount || r.gstAmount || 0}</td>
                        <td className="p-5 font-black bg-slate-50">₹{r.amount || r.runnerDetails?.amount || 0}</td>
                        <td className="p-5 text-slate-500">{r.idProof?.idType || "---"}</td>
                        <td className="p-5 font-mono tracking-tighter">{r.idProof?.idNumber || "---"}</td>
                        <td className="p-5 text-center">
                          <a href={r.idProof?.path} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline flex items-center gap-1">
                            <FiExternalLink /> VIEW FILE
                          </a>
                        </td>
                        <td className="p-5 font-mono text-[10px] text-slate-400">{r.paymentDetails?.orderId || "---"}</td>
                        <td className="p-5 font-mono text-teal-700">{r.paymentDetails?.paymentId || "PENDING"}</td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white ${r.paymentStatus === 'paid' ? 'bg-teal-600' : 'bg-amber-500'}`}>
                            {r.paymentStatus}
                          </span>
                        </td>
                        <td className="p-5 text-slate-400">{formatDate(r.paymentDetails?.paidAt)}</td>
                      </tr>
                    ))
                  )}
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