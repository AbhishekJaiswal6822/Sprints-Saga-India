import React, { useState, useEffect, useMemo } from "react";
import { api } from "../api";
import { toast } from "react-toastify";
// ADDED FiPackage to the list below
import { FiSearch, FiCheckCircle, FiShield, FiCamera, FiX, FiUser, FiPackage, FiEye, } from "react-icons/fi";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { useAuth } from "../AuthProvider";


const ExpoManagement = () => {
  // Runner Insights
  const [activeTab, setActiveTab] = useState("checkin"); // "checkin", "insights", "inventory"
  const [allRunners, setAllRunners] = useState([]); // To store the list for the insights tab

  const { token } = useAuth();

  useEffect(() => {
    if (activeTab === "insights") {
      const fetchRunners = async () => {
        try {
          const res = await api("/api/expo/all-runners", { token }); // Ensure this endpoint exists
          if (res.success) setAllRunners(res.data);
        } catch (err) {
          toast.error("Failed to load runner insights");
        }
      };
      fetchRunners();
    }
  }, [activeTab, token]);

  const [searchQuery, setSearchQuery] = useState("");
  const [runner, setRunner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [facingMode, setFacingMode] = useState("user"); // "user" is front, "environment" is back

  const [checklist, setChecklist] = useState({
    isVerified: false,
    tshirtIssued: false,
    kitIssued: false,
  });


  // Inventory Dynamic Stats Calculation
  const totalInventory = 700;
  const shirtsAllocated = allRunners.filter(r => r.expoDetails?.tshirtIssued).length;
  const kitsAllocated = allRunners.filter(r => r.expoDetails?.kitIssued).length;

  const stats = [
    { label: "Total Inventory", value: totalInventory, color: "text-slate-900", bg: "bg-slate-100" },
    { label: "Shirts Allocated", value: shirtsAllocated, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Shirts Left", value: totalInventory - shirtsAllocated, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Kits Allocated", value: kitsAllocated, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Kits Left", value: totalInventory - kitsAllocated, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  // view logs
  const [showLogModal, setShowLogModal] = useState(false);

  const distributionLogs = allRunners
    .filter(r => r.expoDetails?.kitIssued)
    .sort((a, b) => new Date(b.expoDetails.collectedAt) - new Date(a.expoDetails.collectedAt))
    .slice(0, 50); // Show only the latest 50 to keep it fast

  const [logSearch, setLogSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "issued", "pending"

  const filteredLogs = allRunners.filter(r => {
    const fullName = `${r.runnerDetails?.firstName} ${r.runnerDetails?.lastName}`.toLowerCase();
    const bib = (r.expoDetails?.bibNumber || "").toString();
    const matchesSearch = fullName.includes(logSearch.toLowerCase()) || bib.includes(logSearch);

    const isIssued = r.expoDetails?.kitIssued;
    const matchesStatus =
      statusFilter === "all" ? true :
        statusFilter === "issued" ? isIssued : !isIssued;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sort issued ones to the top by time, then pending ones
    if (a.expoDetails?.kitIssued && b.expoDetails?.kitIssued) {
      return new Date(b.expoDetails.collectedAt) - new Date(a.expoDetails.collectedAt);
    }
    return a.expoDetails?.kitIssued ? -1 : 1;
  });


  // insights
  const [insightsSearch, setInsightsSearch] = useState("");

  const filteredInsights = allRunners.filter(r => {
    const fullName = `${r.runnerDetails?.firstName} ${r.runnerDetails?.lastName}`.toLowerCase();
    const email = (r.runnerDetails?.email || "").toLowerCase();
    const bib = (r.expoDetails?.bibNumber || "").toString();
    const search = insightsSearch.toLowerCase();

    return fullName.includes(search) || email.includes(search) || bib.includes(search);
  });

  const [viewingIdUrl, setViewingIdUrl] = useState(null);


  // inventory tshirt insights
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Define the sizes we want to track
  const tShirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Calculate stats per size based on allRunners data
  // 1. Get ALL unique sizes present in the data (Dynamic detection)
  const uniqueSizes = [...new Set(allRunners.map(r => r.runnerDetails?.tshirtSize?.toUpperCase()))]
    .filter(Boolean) // Remove null/undefined
    .sort(); // Sorts them alphabetically/logical order

  // 2. Calculate stats based on EVERY runner found
  const sizeBreakdown = uniqueSizes.map(size => {
    const runnersForSize = allRunners.filter(r =>
      r.runnerDetails?.tshirtSize?.toUpperCase() === size
    );

    const collected = runnersForSize.filter(r => r.expoDetails?.tshirtIssued).length;
    const total = runnersForSize.length;

    return {
      size,
      total,
      collected,
      remaining: total - collected
    };
  });

  // 3. Optional: Add a "Missing Info" row if any runners have no size selected
  const missingSizeCount = allRunners.filter(r => !r.runnerDetails?.tshirtSize).length;
  if (missingSizeCount > 0) {
    sizeBreakdown.push({
      size: "N/A",
      total: missingSizeCount,
      collected: allRunners.filter(r => !r.runnerDetails?.tshirtSize && r.expoDetails?.tshirtIssued).length,
      remaining: missingSizeCount
    });
  }


  useEffect(() => {
    let html5QrCode = null;

    if (showScanner) {
      // This initializes the core logic on the 'reader' div
      html5QrCode = new Html5Qrcode("reader");

      const qrCodeSuccessCallback = async (decodedText) => {
        try {
          const decryptedData = atob(decodedText);
          const salt = "SPRINTS_SAGA_2026_";

          if (decryptedData.startsWith(salt)) {
            const cleanData = decryptedData.replace(salt, "");
            const [registrationId, memberId] = cleanData.split("_");

            if (html5QrCode && html5QrCode.isScanning) {
              await html5QrCode.stop();
            }

            setShowScanner(false);
            setSearchQuery(registrationId); // Set the UI input to the main ID

            // CALL with both IDs
            performSearch(registrationId, memberId);
            toast.success("Code Decoded!");
          } else {
            toast.error("Invalid QR Code.");
          }
        } catch (e) {
          console.error("Decryption error:", e);
          toast.error("Unreadable QR.");
        }
      };

      // Forces HP Wide Vision / Laptop Camera
      html5QrCode.start(
        { facingMode: facingMode }, // Uses the dynamic state
        { fps: 10, qrbox: { width: 250, height: 250 } },
        qrCodeSuccessCallback
      ).catch(err => {
        console.error("Camera start error:", err);
      });
    }

    return () => {
      // Cleanup when component closes
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Stop error:", err));
      }
    };
  }, [showScanner, facingMode]);

  const performSearch = async (regId, memberId = null) => {
    const searchVal = regId || searchQuery;
    if (!searchVal) return;

    setLoading(true);
    setRunner(null);
    try {
      const url = memberId
        ? `/api/expo/search/${searchVal}?memberId=${memberId}`
        : `/api/expo/search/${searchVal}`;

      const res = await api(url, { token });

      if (res.success) {
        const runnerData = {
          ...res.data,
          activeMemberId: memberId
        };
        setRunner(runnerData);
        setChecklist({ isVerified: false, tshirtIssued: false, kitIssued: false });
      }
    } catch (err) {
      toast.error(err.message || "Runner not found");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!checklist.isVerified) {
      toast.warning("Please verify the Physical ID first!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api(`/api/expo/checkin/${runner._id}`, {
        method: "POST",
        token: token,
        body: {
          ...checklist,
          memberId: runner.activeMemberId // Use the ID we attached in performSearch
        },
      });

      if (res.success) {
        toast.success(`Success! Bib Assigned: ${res.bibAssigned}`);
        setRunner(null);
        setSearchQuery("");
      }
    } catch (err) {
      toast.error(err.message || "Check-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="max-w-[90%] mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
            EXPO <span className="text-teal-600">CHECK-IN</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Volunteer Command Center</p>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 border border-slate-200">
          {[
            { id: "checkin", label: "Check-In", icon: <FiCamera /> },
            { id: "insights", label: "Runner Insights", icon: <FiUser /> },
            { id: "inventory", label: "Inventory", icon: <FiPackage /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setRunner(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab.id
                ? "bg-white text-teal-600 shadow-xl"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "checkin" && (
          <>
            {/* CONTROLS */}
            <div className="flex flex-col gap-4 mb-8">
              <button
                onClick={() => setShowScanner(!showScanner)}
                className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg ${showScanner ? "bg-rose-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
              >
                {showScanner ? <><FiX /> Cancel Scan</> : <><FiCamera /> Use QR Scanner</>}
              </button>

              {showScanner && (
                <div className="relative group">
                  <div
                    key={facingMode}
                    id="reader"
                    className="rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-black min-h-[300px]"
                  ></div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const newMode = facingMode === "user" ? "environment" : "user";
                      setFacingMode(newMode);

                      // ADDED TOAST MESSAGE
                      toast.info(`Switching to ${newMode === "user" ? "Front" : "Back"} Camera`, {
                        position: "bottom-center",
                        autoClose: 1000,
                        hideProgressBar: true
                      });
                    }}
                    style={{ zIndex: 100 }}
                    className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-md text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/20 shadow-2xl active:scale-95 transition-all"
                  >
                    Flip Camera
                  </button>
                </div>
              )}

              {!showScanner && (
                <form onSubmit={(e) => { e.preventDefault(); performSearch(); }} className="relative">
                  <input
                    type="text"
                    placeholder="Scan QR or Enter Mobile/Email"
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-lg shadow-sm focus:border-teal-500 focus:ring-0 transition-all font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-3 bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <FiSearch size={20} />}
                  </button>
                </form>
              )}
            </div>

            {/* RUNNER DISPLAY CARD */}
            {runner && (
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Dynamic Status Header */}
                <div className={`p-8 ${runner.expoDetails?.bibCollected ? "bg-rose-600" : "bg-teal-600"} text-white`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Participant</p>
                      <h2 className="text-3xl font-black uppercase italic leading-none mt-1">
                        {runner.runnerDetails?.firstName} {runner.runnerDetails?.lastName}
                      </h2>
                    </div>
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md text-right min-w-[100px]">
                      <p className="text-[10px] font-black uppercase opacity-70">Category</p>
                      <p className="text-xl font-black leading-none">{runner.raceCategory}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {runner.expoDetails?.bibCollected ? (
                    <div className="text-center py-10">
                      <div className="bg-rose-100 text-rose-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiShield size={40} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 uppercase">Already Collected</h3>
                      <div className="mt-4 inline-block bg-slate-100 px-6 py-2 rounded-full border border-slate-200">
                        <p className="text-slate-600 font-bold uppercase tracking-widest">
                          Bib Number: <span className="text-rose-600">{runner.expoDetails.bibNumber}</span>
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-6 uppercase tracking-widest">Handed over at {new Date(runner.expoDetails.collectedAt).toLocaleTimeString()}</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Detailed Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shirt Size</p>
                          <p className="text-2xl font-black text-teal-600 uppercase">{runner.runnerDetails?.tshirtSize}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg ID</p>
                          <p className="text-sm font-mono font-bold text-slate-800 break-all">{runner._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                          <FiCheckCircle className="text-teal-500" /> Distribution Checklist
                        </h4>

                        {[
                          { id: 'isVerified', title: 'Identity Verified', desc: 'Aadhaar / Passport confirmed', icon: <FiUser /> },
                          { id: 'tshirtIssued', title: 'T-Shirt Issued', desc: `Handed over ${runner.runnerDetails?.tshirtSize} size`, icon: <FiPackage /> },
                          { id: 'kitIssued', title: 'Kit Issued', desc: 'Goodie bag & Timing chip', icon: <FiPackage /> }
                        ].map(item => (
                          <label key={item.id} className="flex items-center gap-4 p-5 rounded-3xl border-2 border-slate-50 hover:border-teal-100 hover:bg-teal-50/30 cursor-pointer transition-all">
                            <input
                              type="checkbox"
                              className="w-7 h-7 rounded-xl text-teal-600 border-slate-300 focus:ring-teal-500 transition-all"
                              checked={checklist[item.id]}
                              onChange={(e) => setChecklist({ ...checklist, [item.id]: e.target.checked })}
                            />
                            <div className="flex-1">
                              <p className="font-black text-slate-900 uppercase text-sm leading-none">{item.title}</p>
                              <p className="text-xs text-slate-500 font-medium italic mt-1">{item.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>

                      {/* ACTION */}
                      <button
                        onClick={handleCheckIn}
                        disabled={!checklist.isVerified || submitting}
                        className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl transition-all ${checklist.isVerified
                          ? "bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-teal-200"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                      >
                        {submitting ? "Writing to Database..." : "Assign Bib & Confirm"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "insights" && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-black uppercase italic tracking-tighter text-xl text-white">Runner Master List</h3>
              <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase">{allRunners.length} Total</span>
            </div>
            <div className="overflow-x-auto">
              {/* SEARCH FILTER BAR */}
              <div className="p-6 bg-slate-50 border-b border-slate-200">
                <div className="relative w-full">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by BIB, Name, or Email..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-teal-500 outline-none transition-all font-bold text-sm shadow-sm"
                    value={insightsSearch}
                    onChange={(e) => setInsightsSearch(e.target.value)}
                  />
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider text-center border-r border-slate-100">Bib No</th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100">First Name</th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100">Last Name</th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100 text-center">Category</th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100">Member Email</th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100 text-center">ID Type</th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100 text-center">Verification</th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100 text-center">Identity</th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100 text-center">T-Shirt</th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100 text-center">Kit</th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInsights.map((r) => (
                    <tr key={r._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">

                      {/* BIB NO */}
                      <td className="px-4 py-4 text-center border-r border-slate-100">
                        <span className={`font-black text-base ${r.expoDetails?.bibNumber ? 'text-teal-600' : 'text-slate-300'}`}>
                          {r.expoDetails?.bibNumber || "---"}
                        </span>
                      </td>

                      {/* FIRST NAME */}
                      <td className="px-4 py-4 border-r border-slate-100">
                        <p className="font-black text-slate-900 uppercase text-[12px]">{r.runnerDetails?.firstName}</p>
                      </td>

                      {/* LAST NAME */}
                      <td className="px-4 py-4 border-r border-slate-100">
                        <p className="font-black text-slate-900 uppercase text-[12px]">{r.runnerDetails?.lastName}</p>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-4 py-4 border-r border-slate-100 text-center">
                        <span className="font-black text-teal-600 text-[11px] uppercase">{r.raceCategory}</span>
                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-4 border-r border-slate-100">
                        <p className="text-[11px] font-medium text-slate-600 lowercase">{r.runnerDetails?.email}</p>
                      </td>

                      {/* ID TYPE */}
                      <td className="px-4 py-4 border-r border-slate-100 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {r.idProof?.idType || "---"}
                        </span>
                      </td>

                      {/* VERIFICATION POPUP TRIGGER */}
                      <td className="px-4 py-4 border-r border-slate-100 text-center">
                        {r.idProof?.path ? (
                          <button
                            onClick={() => setViewingIdUrl(r.idProof.path)}
                            className="bg-teal-50 text-teal-600 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all flex items-center gap-1 mx-auto"
                          >
                            <FiEye size={12} /> View ID
                          </button>
                        ) : (
                          <span className="text-slate-300 text-[9px] font-black italic">No ID</span>
                        )}
                      </td>

                      {/* IDENTITY */}
                      <td className="px-4 py-4 border-r border-slate-100 text-center">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${r.expoDetails?.isVerified ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                          {r.expoDetails?.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>

                      {/* T-SHIRT */}
                      <td className="px-4 py-4 border-r border-slate-100 text-center">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${r.expoDetails?.tshirtIssued ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                          {r.expoDetails?.tshirtIssued ? 'Issued' : 'Pending'}
                        </span>
                        <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">{r.runnerDetails?.tshirtSize}</p>
                      </td>

                      {/* KIT */}
                      <td className="px-4 py-4 border-r border-slate-100 text-center">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${r.expoDetails?.kitIssued ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                          {r.expoDetails?.kitIssued ? 'Issued' : 'Pending'}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4">
                        {r.expoDetails?.bibCollected ? (
                          <div>
                            <p className="text-[10px] font-black text-green-600 uppercase leading-tight">Allocated</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase italic">
                              {new Date(r.expoDetails.collectedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-black uppercase italic tracking-tighter">Incomplete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className={`${stat.bg} p-6 rounded-[2rem] border border-white shadow-sm`}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* T-SHIRT TRACKER */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <FiPackage size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-teal-600 text-white p-4 rounded-2xl shadow-lg shadow-teal-200">
                      <FiPackage size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic">T-Shirt Inventory</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stock Level: {((totalInventory - shirtsAllocated) / totalInventory * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-6">
                    <div
                      className="bg-teal-600 h-full transition-all duration-1000"
                      style={{ width: `${(shirtsAllocated / totalInventory) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-4xl font-black text-slate-900">{totalInventory - shirtsAllocated}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Units Available</p>
                    </div>
                    <button
                      onClick={() => setShowSizeModal(true)}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                    >
                      Manage Sizes
                    </button>
                  </div>
                </div>
              </div>

              {/* RACE KIT TRACKER */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <FiShield size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200">
                      <FiShield size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic">Race Kit Inventory</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stock Level: {((totalInventory - kitsAllocated) / totalInventory * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-6">
                    <div
                      className="bg-blue-600 h-full transition-all duration-1000"
                      style={{ width: `${(kitsAllocated / totalInventory) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-4xl font-black text-slate-900">{totalInventory - kitsAllocated}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Units Available</p>
                    </div>
                    <button
                      onClick={() => setShowLogModal(true)}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                    >
                      View Log
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      {showSizeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 animate-in fade-in duration-300">
          {/* Increased max-width and added height constraints */}
          <div className="bg-white rounded-[2.5rem] w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-white">
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">T-Shirt Insights</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Inventory Distribution by Size</p>
              </div>
              <button
                onClick={() => setShowSizeModal(false)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="space-y-3">
                {/* Table Header */}
                <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Size</span>
                  <span className="text-center">Total Registered</span>
                  <span className="text-center">Collected</span>
                  <span className="text-right">Remaining</span>
                </div>

                {/* Size Rows */}
                {sizeBreakdown.map((item) => (
                  <div key={item.size} className="grid grid-cols-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-teal-200 transition-all">
                    <span className="font-black text-slate-900 text-lg">{item.size}</span>
                    <span className="text-center font-bold text-slate-600">{item.total}</span>
                    <span className="text-center">
                      <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-black text-xs">
                        {item.collected}
                      </span>
                    </span>
                    <span className="text-right font-black text-rose-600">{item.remaining}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowSizeModal(false)}
                className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl"
              >
                Close Insights
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white flex flex-col max-h-[90vh]">

            {/* Header with Search */}
            <div className="bg-blue-600 p-8 text-white">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Distribution Master Log</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-2">Live Registry Status</p>
                </div>
                <button onClick={() => setShowLogModal(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all">
                  <FiX size={24} />
                </button>
              </div>

              {/* SEARCH BAR */}
              <div className="relative mb-4">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  type="text"
                  placeholder="Search by Name or BIB..."
                  className="w-full bg-blue-700/50 border border-blue-400/30 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                />
              </div>

              {/* FILTERS */}
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'issued', label: 'Issued' },
                  { id: 'pending', label: 'Pending' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === tab.id ? "bg-white text-blue-600 shadow-lg" : "bg-blue-700/50 text-blue-200 hover:bg-blue-700"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LIST CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="space-y-3">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => {
                    const isIssued = log.expoDetails?.kitIssued;
                    return (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
                        <div className={`p-3 rounded-full font-black text-xs h-12 w-12 flex items-center justify-center border-2 ${isIssued ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-50 text-slate-400 border-slate-100"
                          }`}>
                          {log.expoDetails?.bibNumber || '---'}
                        </div>

                        <div className="flex-1">
                          <p className="font-black text-slate-900 uppercase text-sm leading-none mb-1">
                            {log.runnerDetails?.firstName} {log.runnerDetails?.lastName}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {log.raceCategory} {isIssued && `| Handed at ${new Date(log.expoDetails.collectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${isIssued
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-orange-50 text-orange-600 border-orange-100"
                            }`}>
                            {isIssued ? "Issued" : "Pending"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20">
                    <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">No runners match your search</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <button
                onClick={() => setShowLogModal(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Close Registry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ID DOCUMENT POPUP */}
      {viewingIdUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col max-h-full">

            {/* Popup Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black uppercase italic text-slate-800 tracking-tighter">Identity Verification</h3>
              <button
                onClick={() => setViewingIdUrl(null)}
                className="bg-slate-200 hover:bg-rose-500 hover:text-white p-2 rounded-xl transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* --- PLACE THE NEW DEBUG CODE HERE --- */}
            <div className="flex-1 overflow-auto p-4 bg-slate-200/50 flex justify-center items-center">
  {viewingIdUrl?.toLowerCase().endsWith('.pdf') ? (
    /* PDF VIEWER */
    <iframe
      src={`${viewingIdUrl}#toolbar=0`}
      className="w-full h-full rounded-lg shadow-lg min-h-[500px]"
      title="ID PDF"
    />
  ) : (
    /* IMAGE VIEWER */
    <img
      src={viewingIdUrl}
      alt="Runner ID"
      className="max-w-full h-auto rounded-lg shadow-lg"
      onLoad={() => console.log("ID LOAD SUCCESS:", viewingIdUrl)}
      onError={(e) => {
        console.error("S3 FETCH ERROR:", viewingIdUrl);
        e.target.src = "https://placehold.co/600x400?text=S3+Access+Denied+or+Missing+File";
        toast.error("Format mismatch or S3 Block");
      }}
    />
  )}
</div>
            {/* --------------------------------------- */}

            {/* Footer */}
            <div className="p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sprints Saga India Security Protocol</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpoManagement;