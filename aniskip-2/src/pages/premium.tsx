import React from "react";
import { Star, Gift, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  '🔍 Search & browse anime with cover cards',
  '📃 Anime summaries, genres, and status', 
  '✅ Track your anime progress (watchlist)',
  '🖼️ View posters, episode counts, and studios',
  '⚙️ User account with login/signup (email + Google)',
  '🧠 Smart Episode Breakdowns',
  '💡 Smart Watch Guides',
  '⏱️ Time Saved Estimations',
  '🔗 Streaming Site Links',
  '📊 Progress tracking and statistics',
  '🎯 Filler/Canon/Recap tagging',
  '🚫 NSFW content filtering'
];

const FreeLaunchPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="bg-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-4xl flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full">
              <Gift className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">🎉 Everything is FREE!</h1>
          <p className="text-xl text-green-300 mb-2 font-semibold">All Premium Features Now Included</p>
          <p className="text-slate-300 mb-6 max-w-2xl">
            We've made the decision to make all AniSkip features completely free! 
            Enjoy smart episode breakdowns, filler guides, progress tracking, and more at no cost.
          </p>
        </div>

        <div className="w-full max-w-3xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What You Get - All FREE:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-green-500/20">
                <Star className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg py-4 font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            Start Using Free Features
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            No subscription required • No hidden fees • All features included
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeLaunchPage;
