import React, { useEffect, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_17_40)">
      <path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24V29.1H37.1C36.5 32.1 34.6 34.6 31.8 36.3V42.1H39.5C44 38.1 47.5 32.1 47.5 24.5Z" fill="#4285F4"/>
      <path d="M24 48C30.6 48 36.1 45.9 39.5 42.1L31.8 36.3C29.9 37.5 27.3 38.3 24 38.3C17.7 38.3 12.2 34.2 10.3 28.7H2.3V34.7C5.7 41.1 14.1 48 24 48Z" fill="#34A853"/>
      <path d="M10.3 28.7C9.7 26.9 9.4 24.9 9.4 23C9.4 21.1 9.7 19.1 10.3 17.3V11.3H2.3C0.8 14.1 0 17.4 0 21C0 24.6 0.8 27.9 2.3 30.7L10.3 28.7Z" fill="#FBBC05"/>
      <path d="M24 9.7C27.7 9.7 30.7 11 32.7 12.8L39.7 6.1C36.1 2.7 30.6 0 24 0C14.1 0 5.7 6.9 2.3 13.3L10.3 17.3C12.2 11.8 17.7 7.7 24 7.7V9.7Z" fill="#EA4335"/>
    </g>
    <defs>
      <clipPath id="clip0_17_40">
        <rect width="48" height="48" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const Spinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

const JoinPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [mode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  // Listen for auth state changes and handle profile creation/redirect
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true);
        setUser(session.user);
        // Check if profile exists
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (!data) {
          // Create profile row
          await supabase.from('profiles').insert([
            {
              id: session.user.id,
              display_name: session.user.user_metadata?.full_name || session.user.email,
              avatar_url: session.user.user_metadata?.avatar_url || null,
              plan: 'free',
            }
          ]);
        }
        setLoading(false);
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });
    // Check current user on mount
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
      setLoading(false);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          prompt: 'select_account',
        }
      }
    });
    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    navigate('/'); // Redirect to landing page instead of staying on sign in page
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    // Delete from profiles table
    await supabase.from('profiles').delete().eq('id', user.id);
    // Delete from auth.users (must use admin API or call RPC if enabled)
    // For now, sign out and show a message (Supabase client cannot delete auth.users directly)
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    navigate('/');
    alert('Account deleted (profile row removed, but full deletion requires admin privileges).');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else setSuccess('Signed in!');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess('Check your email to confirm your account!');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, { redirectTo: window.location.origin + '/reset' });
    if (error) setForgotMsg(error.message);
    else setForgotMsg('Password reset email sent!');
    setLoading(false);
  };

  if (loading) return <Spinner />;

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f8fb]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#232b42] flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-white">AnimeSkip Pro</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#181f32] mb-1 text-center">Signed in as</h1>
          <div className="text-[#6b7280] mb-6 text-center">{user.email}</div>
          <button onClick={handleSignOut} className="w-full bg-[#181f32] text-white rounded-lg py-2 font-bold hover:bg-[#232b42] transition mb-2">Sign out</button>
          <button onClick={handleDeleteAccount} className="w-full bg-red-500 text-white rounded-lg py-2 font-bold hover:bg-red-600 transition mb-2">Delete Account</button>
          <div className="text-sm text-[#7b8cff]">Want to use another account? Sign out and sign in again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fb]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="w-20 h-20 rounded-full bg-[#232b42] flex items-center justify-center mb-6">
          <span className="text-2xl font-bold text-white">AnimeSkip Pro</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#181f32] mb-1 text-center">Welcome to AnimeSkip Pro</h1>
        <div className="text-[#6b7280] mb-6 text-center">Sign in to continue</div>
        <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 border border-[#e5e7eb] rounded-lg py-2 mb-4 font-semibold text-[#232b42] hover:bg-[#f1f3f7] transition">
          <GoogleIcon /> Continue with Google
        </button>
        <div className="flex items-center w-full mb-4">
          <div className="flex-1 h-px bg-[#e5e7eb]" />
          <span className="mx-3 text-[#bfc8e6] text-xs font-semibold">OR</span>
          <div className="flex-1 h-px bg-[#e5e7eb]" />
        </div>
        {error && <div className="text-red-500 text-sm mb-2 w-full text-center">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-2 w-full text-center">{success}</div>}
        <form className="w-full flex flex-col gap-4" onSubmit={handleEmailAuth}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfc8e6] w-5 h-5" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-3 py-2 rounded-lg border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#7b8cff] text-[#181f32]" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfc8e6] w-5 h-5" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full pl-10 pr-3 py-2 rounded-lg border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#7b8cff] text-[#181f32]" required />
          </div>
          <button type="submit" className="w-full bg-[#181f32] text-white rounded-lg py-2 font-bold hover:bg-[#232b42] transition" disabled={loading}>
            {mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        <div className="flex justify-between w-full mt-4 text-sm">
          <button type="button" className="text-[#7b8cff] hover:underline" onClick={() => setShowForgot(true)}>Forgot password?</button>
          <Link to="/signup" className="text-[#7b8cff] hover:underline">Need an account? Sign up</Link>
        </div>
        {/* Forgot password modal/inline */}
        {showForgot && (
          <div className="w-full mt-6 bg-[#f1f3f7] rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-lg font-bold text-[#181f32] mb-2">Reset Password</h2>
            <form className="w-full flex flex-col gap-2" onSubmit={handleForgotPassword}>
              <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="Your email" className="w-full px-3 py-2 rounded border border-[#e5e7eb]" required />
              <button type="submit" className="w-full bg-[#181f32] text-white rounded-lg py-2 font-bold hover:bg-[#232b42] transition">Send reset link</button>
            </form>
            {forgotMsg && <div className="text-sm mt-2 text-center text-green-600">{forgotMsg}</div>}
            <button className="text-xs text-[#7b8cff] mt-2 hover:underline" onClick={() => setShowForgot(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinPage; 