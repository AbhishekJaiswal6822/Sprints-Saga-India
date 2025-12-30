  import React, { useState } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import { api } from "../api";
  import { useAuth } from "../AuthProvider";

  // --- Helper function to ensure Razorpay script is loaded ---
  const loadRazorpayScript = () => {
    if (document.getElementById("razorpay-checkout-script")) {
      return true;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.head.appendChild(script);
    return new Promise((resolve) => {
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
    });
  };

  function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const {
      amount = 0,
      raceCategory = "",
      registrationType = "",
      registrationId = null,
      groupName = "",
    } = location.state || {};

    if (!location.state || amount <= 0 || !registrationId) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-600 font-semibold">
            Invalid access. Please ensure registration is complete.
          </p>
        </div>
      );
    }

    const verifyPayment = async (paymentDetails) => {
      try {
        const response = await api("/api/payment/verify", {
          method: "POST",
          body: {
            ...paymentDetails,
            registrationId,
          },
          token,
        });

        if (response.success) {
          navigate("/payment-success", {
            replace: true,
            state: { registrationId },
          });
        }
      } catch (error) {
        console.error("Payment Verification Error:", error);
      }
    };

    const handlePayment = async () => {
      if (loading) return;
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) return setLoading(false);

      try {
        const response = await api("/api/payment/order", {
          method: "POST",
          body: {
            amount,
            registrationId,
          },
          token,
        });

        const { key, order } = response;
        const orderId = order.id;
        const orderAmount = order.amount;

        if (!key || !orderId || !orderAmount) {
          throw new Error("Invalid order response from backend");
        }

      const options = {
          key,
          amount: orderAmount,
          currency: "INR",
          name: "Sprints Saga India",
          description: `Marathon Reg for ${raceCategory}`,
          order_id: orderId,
          // ✅ Add this here to hide the methods in the UI
          config: {
            display: {
              hide: [
                { method: "emi" },
                { method: "paylater" },
                { method: "wallet" },
              ],
            },
          },
          handler: function (response) {
            verifyPayment(response);
          },
          theme: {
            color: "#0d9488",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("Payment Failed:", response.error);
        });
        rzp.open();
      } catch (err) {
        console.error("Payment Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <main className="min-h-screen bg-slate-50 flex justify-center items-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <h1 className="text-2xl font-extrabold text-teal-700 mb-6 text-center">
            Payment Summary
          </h1>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Registration Type:</span>
              <span className="font-semibold capitalize">{registrationType}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">Race Category:</span>
              <span className="font-semibold">{raceCategory}</span>
            </div>

            {groupName && (
              <div className="flex justify-between">
                <span className="text-slate-600">Group Name:</span>
                <span className="font-semibold">{groupName}</span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t">
              <span className="text-slate-700 font-semibold">Total Amount:</span>
              <span className="text-xl font-extrabold text-teal-700">₹{amount}</span>
            </div>
          </div>

          <button
            className={`mt-8 w-full rounded-full py-3 text-white font-semibold transition ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay ₹${amount}`}
          </button>

          <button
            className="mt-3 w-full text-sm text-slate-500 hover:underline"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  export default PaymentPage;