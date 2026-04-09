import React, { useState, useEffect } from "react";
import { api } from "../api";
import { toast } from "react-toastify";
// ADDED FiPackage to the list below
import { FiSearch, FiCheckCircle, FiShield, FiCamera, FiX, FiUser, FiPackage } from "react-icons/fi";
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
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-200">
  <tr>
    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider text-center border-r border-slate-100">Bib No</th>
    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100">First Name</th>
    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100">Last Name</th>
    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100 text-center">Category</th>
    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100">Member Email</th>
    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100 text-center">Identity</th>
    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100 text-center">T-Shirt</th>
    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider border-r border-slate-100 text-center">Kit</th>
    <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">Status</th>
  </tr>
</thead>
                <tbody>
  {allRunners.map((r) => (
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
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
            <FiPackage className="mx-auto text-slate-300 mb-4" size={50} />
            <h3 className="text-slate-400 font-black uppercase tracking-widest">Inventory Tracking Coming Soon</h3>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExpoManagement;