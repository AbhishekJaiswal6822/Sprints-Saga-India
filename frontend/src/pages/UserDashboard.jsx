// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\pages\UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { api } from "../api";
import { toast } from "react-toastify";



const UserDashboard = () => {
    const { token, user } = useAuth();
    const [reg, setReg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api("/api/register/my-registration", { token });
                if (response.success) setReg(response.data);
            } catch (err) {
                console.error("Dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [token]);

    const handleDownload = () => {
        window.open(`${import.meta.env.VITE_API_BASE_URL}/api/payments/invoice/${reg._id}`, "_blank");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;

    if (!reg) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <p className="text-xl text-slate-600">No active registration found.</p>
            <a href="/register" className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold">Register Now</a>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
                    <p className="text-slate-500">View your LokRaja Marathon 2026 details.</p>
                </header>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* --- REGISTRATION SUMMARY --- */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold mb-6">📋 Registration Summary</h2>
                        <div className="grid grid-cols-2 gap-8 text-sm">
                            <div>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Race Category</p>
                                <p className="text-lg font-semibold">{reg.raceCategory}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Payment Status</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${reg.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {reg.paymentStatus.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Registration Type</p>
                                <p className="text-lg font-semibold capitalize">{reg.registrationType}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">BIB Number</p>
                                <p className="text-lg font-bold text-teal-600">{reg.bibNumber || "Pending Verification"}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- SIDEBAR: PAYMENT & SUPPORT --- */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                            <h3 className="font-bold text-slate-900 mb-2">Invoice & Payment</h3>
                            <p className="text-2xl font-bold text-slate-900 mb-6">
                                ₹{reg.runnerDetails?.amount || reg.amount || "0"}
                            </p>
                            <button
                                onClick={() => {
                                    toast.info("Generating your invoice...");
                                    handleDownload();
                                }}
                                disabled={reg.paymentStatus !== 'paid'}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg active:scale-[0.98]"
                            >
                                Download Invoice
                            </button>
                        </div>

                        <div className="bg-teal-600 p-8 rounded-3xl text-white">
                            <h3 className="font-bold mb-2">Support Contact</h3>
                            <div className="text-sm space-y-2 opacity-90">
                                <p>📧 registration@sprintssaga.com</p>
                                <p>📞 +91 90764 02682</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RACE INFO & INSTRUCTIONS --- */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-6">🏁 Race Day Instructions</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-600">
                        <div className="bg-slate-50 p-6 rounded-2xl">
                            <h4 className="font-bold text-slate-900 mb-2">Expo & Kit Collection</h4>
                            <p>Collect your BIB and T-shirt on Jan 20th at the Marathon Expo. Carry a copy of your Registration ID.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl">
                            <h4 className="font-bold text-slate-900 mb-2">Race Start</h4>
                            <p>Participants must report by 5:30 AM. Bag drop facilities are available at the holding area.</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default UserDashboard;