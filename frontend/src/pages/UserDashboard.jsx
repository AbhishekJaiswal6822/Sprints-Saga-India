import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { api } from "../api";
import { toast } from "react-toastify";
import { QRCodeSVG } from 'qrcode.react'; 

const secretSalt = "SPRINTS_SAGA_2026_"; // Keep this private

const typeLabels = {
    individual: "Individual Registration",
    group: "Group Registration",
    charity: "Charity Registration"
};

const categoryLabels = {
    "5k": "5K Fun Run",
    "10k": "10K Challenge",
    "21k": "Half Marathon (21.097K)",
    "35k": "35K Ultra",
    "42k": "Full Marathon (42K)"
};

const UserDashboard = () => {
    const { token, user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api("/api/register/my-registration", { token });
                if (response.success) {
                    const normalizedData = Array.isArray(response.data)
                        ? response.data
                        : response.data ? [response.data] : [];
                    setRegistrations(normalizedData);
                }
            } catch (err) {
                console.error("Dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [token]);

    const handleDownload = (regId) => {
        window.open(`${import.meta.env.VITE_API_BASE_URL}/api/payment/invoice/${regId}`, "_blank");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;

    if (registrations.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <p className="text-xl text-slate-600 font-bold">No active registrations found.</p>
            <a href="/register" className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-teal-700 transition-all">Register Now</a>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                            Welcome, <span className="text-teal-600">{user.name.split(' ')[0]}</span>
                        </h1>
                        <p className="text-slate-500 font-medium italic">LokRaja Marathon 2026 Runner Command Center</p>
                    </div>
                </header>

                {registrations.map((reg) => {
                    // --- FIX: ENCRYPT ID INSIDE THE MAP LOOP ---
                    const encryptedID = btoa(secretSalt + reg._id);

                    return (
                        <div key={reg._id} className="grid md:grid-cols-4 gap-8 bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 mb-8 relative overflow-hidden transition-all hover:shadow-2xl">
                            
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase italic">
                                        {categoryLabels[reg.raceCategory?.toLowerCase()] || reg.raceCategory}
                                    </h2>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        {typeLabels[reg.registrationType] || reg.registrationType}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1">Status</p>
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${reg.paymentStatus === 'paid' ? 'bg-teal-100 text-teal-700 border border-teal-200' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                                            {reg.paymentStatus}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1">BIB Number</p>
                                        <p className="text-xl font-black text-slate-900">
                                            {reg.expoDetails?.bibNumber || "Process Pending"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1">Shirt Size</p>
                                        <p className="font-bold text-slate-700 text-lg uppercase">{reg.runnerDetails?.tshirtSize || reg.groupMembers?.[0]?.tshirtSize || "NA"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1">Reg Date</p>
                                        <p className="font-bold text-slate-700">{new Date(reg.registeredAt).toLocaleDateString('en-IN')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="flex flex-col items-center justify-center bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-200">
                                {reg.paymentStatus === 'paid' ? (
                                    <>
                                        <p className="text-[10px] font-black text-teal-600 uppercase mb-3 tracking-widest">Digital Entry QR</p>
                                        <div className="bg-white p-3 rounded-2xl shadow-sm">
                                            <QRCodeSVG 
                                                value={encryptedID} 
                                                size={120} 
                                                fgColor="#0d9488"
                                                level="H" 
                                            />
                                        </div>
                                        <p className="mt-3 text-[9px] font-bold text-slate-400 uppercase italic text-center">Scan at Bib Counter</p>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-rose-500 uppercase leading-tight">QR Locked<br/>Complete Payment</p>
                                    </div>
                                )}
                            </div> */}
<div className="flex flex-col items-center justify-center bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-200">
    {reg.paymentStatus === 'paid' ? (
        <div className="space-y-6 w-full">
            {/* If Group, show all members. If individual, show the main runner */}
            {reg.registrationType === 'group' && reg.groupMembers?.length > 0 ? (
                reg.groupMembers.map((member, idx) => (
                    <div key={member._id || idx} className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-teal-600 uppercase mb-2 tracking-widest text-center">
                            {member.firstName} {member.lastName}
                        </p>
                        <QRCodeSVG 
                            value={btoa(secretSalt + reg._id + "_" + (member._id || idx))} 
                            size={100} 
                            fgColor="#0d9488"
                            level="H" 
                        />
                        <p className="mt-2 text-[8px] font-bold text-slate-400 uppercase italic">Member QR</p>
                    </div>
                ))
            ) : (
                /* Standard Individual View */
                <div className="flex flex-col items-center">
                    <p className="text-[10px] font-black text-teal-600 uppercase mb-3 tracking-widest">Digital Entry QR</p>
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                        <QRCodeSVG 
                            value={encryptedID} 
                            size={120} 
                            fgColor="#0d9488"
                            level="H" 
                        />
                    </div>
                    <p className="mt-3 text-[9px] font-bold text-slate-400 uppercase italic text-center">Scan at Bib Counter</p>
                </div>
            )}
        </div>
    ) : (
        <div className="text-center">
            <p className="text-xs font-bold text-rose-500 uppercase leading-tight">QR Locked<br/>Complete Payment</p>
        </div>
    )}
</div>
                            <div className="flex flex-col justify-center gap-4 text-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                                <div>
                                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Total Paid</p>
                                    <p className="text-3xl font-black text-slate-900">₹{reg.amount}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        toast.info("Opening invoice...");
                                        handleDownload(reg._id);
                                    }}
                                    disabled={reg.paymentStatus !== 'paid'}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl active:scale-95"
                                >
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default UserDashboard;