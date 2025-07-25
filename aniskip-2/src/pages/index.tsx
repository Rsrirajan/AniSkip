import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";


const newEpisodes = [
  { title: "Panty & Stocking 2", image: "/placeholder-ep1.jpg", watched: 13 },
  { title: "Clevatess", image: "/placeholder-ep2.jpg", watched: 184 },
  { title: "Tensei Shitara...", image: "/placeholder-ep3.jpg", watched: 110 },
  // Add more new episodes here
];

const popularAnime = [
  { title: "Jujutsu Kaisen", image: "/placeholder-pop1.jpg", score: 8.7 },
  { title: "Attack on Titan", image: "/placeholder-pop2.jpg", score: 9.1 },
  { title: "Demon Slayer", image: "/placeholder-pop3.jpg", score: 8.5 },
  // Add more popular anime here
];



const Home: React.FC = () => {
  // Remove dynamic trending fetch for static build
  const [featuredAnime] = useState<any[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const navigate = useNavigate();

  // Removed axios fetch for build compatibility

  // Carousel navigation handlers
  const nextSlide = () => setCarouselIndex((i) => (i + 1) % featuredAnime.length);
  const prevSlide = () => setCarouselIndex((i) => (i - 1 + featuredAnime.length) % featuredAnime.length);

  const handleLogin = () => {
    navigate('/signup');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 backdrop-blur-xl bg-white/10 border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-white tracking-wide">AniSkip</span>
          <nav className="hidden md:flex gap-6 ml-8 text-purple-200">
            <button onClick={() => navigate('/search')} className="hover:text-white transition">Anime</button>
            <button onClick={() => navigate('/search')} className="hover:text-white transition">Movies</button>
            <button onClick={() => navigate('/search')} className="hover:text-white transition">Trending</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogin} className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition">
            <LogIn className="w-5 h-5" /> Login
          </button>
          <button onClick={handleSignUp} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition">
            <UserPlus className="w-5 h-5" /> Sign Up
          </button>
        </div>
      </header>

      {/* Carousel */}
      <section className="relative max-w-6xl mx-auto mt-8 rounded-3xl overflow-hidden shadow-xl">
        <div className="relative h-[340px] bg-black/30 flex items-center">
          <AnimatePresence initial={false}>
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full flex"
            >
              <img
                src={featuredAnime[carouselIndex]?.coverImage?.large}
                alt={featuredAnime[carouselIndex]?.title?.english || featuredAnime[carouselIndex]?.title?.romaji}
                className="object-cover w-1/2 h-full rounded-l-3xl"
              />
              <div className="flex-1 flex flex-col justify-center px-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-2">
                  {featuredAnime[carouselIndex]?.title?.english || featuredAnime[carouselIndex]?.title?.romaji}

                </h2>
                <div className="text-lg text-purple-200 mb-1">{featuredAnime[carouselIndex].episode} <span className="ml-2 text-purple-300">{featuredAnime[carouselIndex].subtitle}</span></div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">{featuredAnime[carouselIndex]?.episodes ? `Episodes: ${featuredAnime[carouselIndex]?.episodes}` : "Ongoing"}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Carousel controls */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 shadow-lg">
            &#8592;
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 shadow-lg">
            &#8594;
          </button>
        </div>
      </section>

      {/* New Episodes */}
      <section className="max-w-6xl mx-auto mt-12">
        <h3 className="text-2xl font-bold text-white mb-4">New Episodes</h3>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {newEpisodes.map((ep, i) => (
            <div key={i} className="min-w-[180px] bg-white/10 rounded-xl p-3 flex flex-col items-center border border-white/10 shadow hover:scale-105 transition">
              <img src={ep.image} alt={ep.title} className="w-32 h-44 object-cover rounded-lg mb-2" />
              <div className="text-white font-semibold text-center mb-1">{ep.title}</div>
              <div className="text-xs text-purple-200">{ep.watched} watched</div>
            </div>
          ))}
        </div>
      </section>

      {/* Most Popular Anime */}
      <section className="max-w-6xl mx-auto mt-12 mb-16">
        <h3 className="text-2xl font-bold text-white mb-4">Most Popular Anime</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {popularAnime.map((anime, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-3 flex flex-col items-center border border-white/10 shadow hover:scale-105 transition">
              <img src={anime.image} alt={anime.title} className="w-32 h-44 object-cover rounded-lg mb-2" />
              <div className="text-white font-semibold text-center mb-1">{anime.title}</div>
              <div className="text-xs text-purple-200">Score: {anime.score}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 