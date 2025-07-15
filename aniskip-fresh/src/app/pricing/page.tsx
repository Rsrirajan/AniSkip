'use client';

import Link from 'next/link';

export default function PricingPage() {
  // TODO: Replace with real auth
  const isLoggedIn = false;

  const handleGetStarted = (plan: string) => {
    if (!isLoggedIn) {
      window.location.href = '/signup';
      return;
    }
    if (plan === 'free') {
      // Already on free plan
      return;
    }
    // TODO: Implement premium payment flow
    alert('Premium payment coming soon!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-4 bg-transparent border-b border-gray-200/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-extrabold text-gray-700 flex items-center gap-2 tracking-tight hover:text-gray-900 transition">
            {/* Purple skip-forward logo */}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-skip-forward"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" x2="19" y1="5" y2="19"></line></svg>
            AnimeSkip
          </Link>
        </div>
        <nav className="flex-1 flex items-center justify-center gap-6">
          <Link href="/" className="text-violet-500 font-semibold text-lg">Home</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-gray-700 flex items-center gap-1 hover:text-violet-500 text-lg">
            <span className="text-lg">→</span> Log In
          </Link>
          <Link href="/signup" className="ml-2 px-4 py-2 rounded bg-violet-500 text-white font-semibold hover:bg-violet-600 transition text-lg">Sign Up</Link>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-700 mb-4 tracking-tight" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em'}}>Find the perfect plan</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em', lineHeight: '1.3'}}>Start for free and upgrade to unlock powerful features that will supercharge your anime viewing experience.</p>
        </div>
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div
            className={`bg-white rounded-2xl p-8 shadow-xl transition-all duration-200 transform border ${isLoggedIn ? 'border-green-500' : 'border-gray-200'} ${isLoggedIn ? '' : 'hover:-translate-y-2 hover:shadow-2xl cursor-pointer'}`}
            onClick={() => { if (!isLoggedIn) handleGetStarted('free'); }}
            style={{ position: 'relative' }}
          >
            {isLoggedIn && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow">Current</span>
              </div>
            )}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-1">/month</span>
              </div>
              <p className="text-gray-600 text-sm">
                For casual viewers who want to skip fillers and get basic watch orders.
              </p>
            </div>

            <button
              onClick={e => { e.stopPropagation(); handleGetStarted('free'); }}
              className={`w-full border border-purple-600 text-purple-600 py-3 px-4 rounded-lg hover:bg-purple-50 transition-colors font-medium mb-8 ${!isLoggedIn ? 'cursor-pointer' : 'cursor-default'}`}
              disabled={isLoggedIn}
            >
              {isLoggedIn ? 'Current Plan' : 'Get Started for Free'}
            </button>

            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Basic filler lists & watch orders</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Up to 5 favorite anime</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Ads supported</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Unlimited favorites & history</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Cross-device sync</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Printable watch guides</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Priority support</span>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div
            className={`bg-white rounded-2xl p-8 shadow-xl transition-all duration-200 transform border-2 border-violet-500 relative ${isLoggedIn ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl' : 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl'}`}
            onClick={() => handleGetStarted('premium')}
          >
            {/* Most Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-violet-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$4.99</span>
                <span className="text-gray-600 ml-1">/month</span>
              </div>
              <p className="text-gray-600 text-sm">
                For dedicated fans who want the ultimate, uninterrupted anime tracking experience.
              </p>
            </div>

            <button
              onClick={e => { e.stopPropagation(); handleGetStarted('premium'); }}
              className="w-full bg-violet-500 text-white py-3 px-4 rounded-lg hover:bg-violet-600 transition-colors font-medium mb-8 cursor-pointer"
            >
              Get Started with Premium
            </button>

            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Basic filler lists & watch orders</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Unlimited favorites & history</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Ad-free experience</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Cross-device sync</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Printable watch guides</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Personalized recommendations</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Priority customer support</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Early access to new features</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 