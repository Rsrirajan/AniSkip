import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarks(saved);
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 hover:ring-2 hover:ring-violet-400 transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="Profile"
      >
        <span className="text-lg font-bold text-gray-600">G</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4">
          <div className="font-semibold text-gray-700 mb-2">Saved Anime</div>
          {bookmarks.length === 0 ? (
            <div className="text-gray-400 text-sm">No bookmarks yet.</div>
          ) : (
            <ul className="max-h-48 overflow-y-auto">
              {bookmarks.map((anime) => (
                <li key={anime.id} className="flex items-center gap-2 py-1">
                  <img src={anime.image} alt={anime.title} className="w-8 h-10 object-cover rounded border border-gray-200" />
                  <span className="text-gray-700 text-sm truncate" title={anime.title}>{anime.title}</span>
                  <Link href="#" className="ml-auto text-violet-500 text-xs hover:underline">View</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 