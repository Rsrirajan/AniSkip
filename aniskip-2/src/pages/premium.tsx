import React, { useState } from "react";
import { Check, X, CreditCard, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  { name: "Track Anime", free: true, pro: true },
  { name: "Episode Progress", free: true, pro: true },
  { name: "Monthly Goal Tracker", free: true, pro: true },
  { name: "Filler / Recap Detection", free: false, pro: true },
  { name: "Smart Watch Guides", free: false, pro: true },
  { name: "New Episode Notifications", free: false, pro: true },
  { name: "Time Saved Tracker", free: false, pro: true },
  { name: "Skip Suggestions", free: false, pro: true },
];

const PremiumPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleUpgrade = () => {
    // For demo purposes, show a payment modal
    // In production, this would integrate with Stripe or another payment processor
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    // Simulate payment processing
    alert("Payment processing... This is a demo. In production, this would integrate with a payment processor.");
    setShowPaymentModal(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="bg-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-6">Choose Your Plan</h1>
        <table className="w-full mb-8 border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="text-left text-lg text-white font-semibold">&nbsp;</th>
              <th className="text-center text-lg text-white font-semibold">Free</th>
              <th className="text-center text-lg text-purple-300 font-semibold">AniSkip Pro</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.name}>
                <td className="text-white py-2 text-base">{f.name}</td>
                <td className="text-center">{f.free ? <Check className="text-green-500 inline w-6 h-6" /> : <X className="text-red-500 inline w-6 h-6" />}</td>
                <td className="text-center">{f.pro ? <Check className="text-green-500 inline w-6 h-6" /> : <X className="text-red-500 inline w-6 h-6" />}</td>
              </tr>
            ))}
            <tr>
              <td className="text-white font-bold py-2">Price</td>
              <td className="text-center font-bold text-white">Free</td>
              <td className="text-center font-bold text-purple-300">$2.99/mo</td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg py-3 font-bold text-lg shadow-lg transition mb-2"
        >
          Upgrade to Pro
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full text-purple-300 hover:text-white mt-2 text-sm"
        >
          Maybe later
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h2>
              <p className="text-slate-300">Get access to all premium features for just $2.99/month</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">AniSkip Pro</span>
                  <span className="text-purple-300 font-bold">$2.99/month</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Pay Now
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPage; 