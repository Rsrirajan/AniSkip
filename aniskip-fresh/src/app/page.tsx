"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AnimeList from '../components/AnimeList';
import Header from '../components/Header';

export default function Home() {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with real auth

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchQuery(search);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <Header isLoggedIn={false} />
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 bg-transparent p-0 mt-10">
          {/* Left: Text and Search */}
          <div className="flex-1 flex flex-col items-start justify-center max-w-xl">
            <h1 className="text-[3rem] md:text-[3.6rem] font-extrabold text-gray-700 mb-3 leading-[1.08] tracking-tight" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em'}}>
              Never watch a filler<br />episode again.
            </h1>
            <p className="text-base text-gray-500 mb-6 font-medium" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em', lineHeight: '1.3'}}>
              Instantly generate skippable filler lists and correct watch orders for any anime.
            </p>
            <form className="w-full flex gap-3 mb-4" onSubmit={handleSearch}>
              <input
                type="text"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm bg-white/80 shadow-sm font-medium placeholder-gray-400 transition"
                placeholder="e.g., Naruto, One Piece, Bleach..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em', lineHeight: '1.2'}}
              />
              <button
                className="px-6 py-2.5 rounded-xl bg-violet-500 text-white font-bold text-sm flex items-center gap-2 hover:bg-violet-600 transition shadow-lg cursor-pointer"
                type="submit"
                style={{fontFamily: 'Inter, sans-serif'}}
              >
                <span className="text-lg">»</span> Generate
              </button>
            </form>
          </div>
          {/* Right: Anime Image */}
          <div className="flex-1 flex items-center justify-center relative min-w-[500px] min-h-[370px]">
            <div className="rounded-2xl shadow-xl overflow-hidden w-[600px] h-[450px] bg-gray-200 flex items-center justify-center relative">
              <Image
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80"
                alt="Anime collage"
                width={600}
                height={450}
                className="object-cover w-full h-full"
                style={{filter: 'brightness(1.08) contrast(1.12)'}}
                priority
              />
              {/* Right-to-left fade effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </main>
      {/* Anime Search & Cards */}
      <AnimeList searchQuery={searchQuery} />
      {/* Premium Upsell Section */}
      <section className="w-full flex flex-col items-center justify-center py-20 px-4">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg flex flex-col items-center py-14 px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-700 mb-6 text-center tracking-tight" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em'}}>Unlock Your Full Potential</h2>
          <p className="text-xl text-gray-500 mb-8 text-center max-w-2xl font-medium" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em', lineHeight: '1.3'}}>
            Go premium to sync your watch history, get personalized recommendations, and enjoy an ad-free experience.
          </p>
          <Link href="/pricing" className="px-10 py-4 rounded-xl bg-violet-500 text-white font-bold text-lg hover:bg-violet-600 transition shadow-lg" style={{fontFamily: 'Inter, sans-serif'}}>
            View Premium Plans
          </Link>
        </div>
      </section>
    </div>
  );
}