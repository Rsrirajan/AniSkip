import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Plus, Minus } from "lucide-react";
import { Anime } from "../services/anilist";

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
  variant?: "default" | "trending" | "recommended";
  showSignInButton?: boolean;
  isInWatchlist?: boolean;
  onAddToWatchlist?: (anime: Anime) => void;
  onRemoveFromWatchlist?: (anime: Anime) => void;
  currentStatus?: string;
  currentEpisode?: number;
}

export default function AnimeCard({ 
  anime, 
  onClick, 
  variant = "default", 
  showSignInButton = false,
  isInWatchlist = false,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  currentStatus = "Plan to Watch",
  currentEpisode = 1,
}: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
  }, [currentStatus, currentEpisode]);

  const getTitle = () => anime.title.english || anime.title.romaji || anime.title.native;
  const getScore = () => (anime.averageScore ? (anime.averageScore / 10).toFixed(1) : "N/A");
  


  const handleWatchlistAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    
    if (isInWatchlist && onRemoveFromWatchlist) {
      onRemoveFromWatchlist(anime);
    } else if (!isInWatchlist && onAddToWatchlist) {
      onAddToWatchlist(anime);
    }
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.03, boxShadow: "0 8px 32px 0 rgba(80,0,120,0.25)" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="group relative overflow-hidden rounded-xl glass-effect border border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
      onClick={() => onClick(anime)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <motion.img
          src={anime.coverImage.large}
          alt={getTitle()}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Watchlist Action Button */}
        {!showSignInButton && (onAddToWatchlist || onRemoveFromWatchlist) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              scale: isHovered ? 1 : 0.8,
              backgroundColor: isAnimating 
                ? (isInWatchlist ? "#ef4444" : "#22c55e") 
                : isInWatchlist ? "#ef4444" : "#3b82f6"
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              backgroundColor: { duration: 0.3 }
            }}
            onClick={handleWatchlistAction}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20"
          >
            <motion.div
              animate={{ 
                rotate: isAnimating ? 180 : 0,
                scale: isAnimating ? 1.2 : 1
              }}
              transition={{ 
                rotate: { duration: 0.3 },
                scale: { duration: 0.2 }
              }}
            >
              {isInWatchlist ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </motion.div>
          </motion.button>
        )}
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {variant === "trending" && (
            <div className="bg-orange-500/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> Trending
            </div>
          )}
          {variant === "recommended" && (
            <div className="bg-purple-500/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" /> Recommended
            </div>
          )}
        </div>
        {/* Score Badge */}
        {anime.averageScore && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            {getScore()}
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {getTitle()}
        </h3>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span>{anime.episodes || "?"} eps</span>
          <span className="capitalize">{anime.status?.toLowerCase()}</span>
        </div>
        {/* Genres */}
        <div className="flex flex-wrap gap-1">
          {anime.genres?.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-purple-500/30 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
} 