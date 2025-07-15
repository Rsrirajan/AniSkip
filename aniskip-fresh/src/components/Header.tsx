import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-white/90 border-b border-gray-200/80 backdrop-blur-md sticky top-0 z-10">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 min-w-[180px]">
        <Link href="/" className="text-2xl font-extrabold text-gray-700 flex items-center gap-2 tracking-tight hover:text-gray-900 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-skip-forward"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" x2="19" y1="5" y2="19"></line></svg>
          AnimeSkip
        </Link>
      </div>
      {/* Center: Home */}
      <nav className="flex-1 flex items-center justify-center gap-6">
        <Link href="/" className="text-violet-500 font-semibold text-lg">Home</Link>
      </nav>
      {/* Right: Auth/Profile */}
      <div className="flex items-center gap-2 min-w-[180px] justify-end">
        {isLoggedIn ? (
          <>
            <Link href="/pricing" className="px-4 py-2 rounded bg-yellow-400/80 text-yellow-900 font-bold text-sm hover:bg-yellow-400 transition shadow border border-yellow-300">Premium</Link>
            <ProfileDropdown />
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-700 flex items-center gap-1 hover:text-violet-500 text-lg">
              <span className="text-lg">→</span> Log In
            </Link>
            <Link href="/signup" className="ml-2 px-4 py-2 rounded bg-violet-500 text-white font-semibold hover:bg-violet-600 transition text-lg">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
} 