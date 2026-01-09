import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { api } from "../api";
import { toast } from "react-toastify";

const typeLabels = {
        individual: "Individual Registration",
        group: "Group Registration",
        charity: "Charity Registration"
    };

const UserDashboard = () => {
    const { token, user } = useAuth();
    const [registrations, setRegistrations] = useState([]); // Changed: State is now an array
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api("/api/register/my-registration", { token });
                // Store the array of data
                if (response.success) setRegistrations(response.data);
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

    // Change: Check array length
    if (registrations.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <p className="text-xl text-slate-600">No active registrations found.</p>
            <a href="/register" className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold">Register Now</a>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
                    <p className="text-slate-500">You have {registrations.length} registration(s) for LokRaja Marathon 2026.</p>
                </header>

                {/* Map through all registrations */}
                {registrations.map((reg) => (
                    <div key={reg._id} className="grid md:grid-cols-3 gap-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-6">
                        {/* --- REGISTRATION SUMMARY --- */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold mb-6">📋 {reg.raceCategory} Details</h2>
                            <div className="grid grid-cols-2 gap-8 text-sm">
                                <div>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Payment Status</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${reg.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {reg.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">BIB Number</p>
                                    <p className="text-lg font-bold text-teal-600">{reg.bibNumber || "Pending Verification"}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Type</p>
                                    <p className="font-semibold">{typeLabels[reg.registrationType] || reg.registrationType}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Date</p>
                                    <p className="font-semibold">{new Date(reg.registeredAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* --- DOWNLOAD ACTION --- */}
                        <div className="flex flex-col justify-center text-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                            <p className="text-slate-400 text-xs font-bold uppercase mb-2">Invoice</p>
                            <p className="text-xl font-bold mb-4">₹{reg.runnerDetails?.amount || reg.amount || "0"}</p>
                            <button
                                onClick={() => {
                                    toast.info("Generating your invoice...");
                                    handleDownload(reg._id);
                                }}
                                disabled={reg.paymentStatus !== 'paid'}
                                className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg"
                            >
                                Download Invoice
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default UserDashboard;