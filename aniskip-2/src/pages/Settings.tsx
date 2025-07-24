import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Crown } from "lucide-react";

const themes = ["Auto", "Light", "Dark"];
const timeZones = ["UTC", "Central Time", "Eastern Time", "Pacific Time"];

const Settings: React.FC = () => {
  const [, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [watchGoal, setWatchGoal] = useState(15);
  const [theme, setTheme] = useState("Auto");
  const [timeZone, setTimeZone] = useState("UTC");
  const [notifications, setNotifications] = useState(false);
  const [createdAt, setCreatedAt] = useState("");

  // Add new state for NSFW toggle
  const [showNsfw, setShowNsfw] = useState(false);
  // Add new state for new episode notifications
  const [newEpisodeNotifications, setNewEpisodeNotifications] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Not logged in");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        setError("Could not fetch profile");
        setLoading(false);
        return;
      }
      setProfile(data);
      setDisplayName(data.display_name || "");
      setEmail(user.email || "");
      setWatchGoal(data.watch_goal || 15);
      setTheme(data.theme ? data.theme.charAt(0).toUpperCase() + data.theme.slice(1) : "Auto");
      setTimeZone(data.time_zone || "UTC");
      setNotifications(data.notifications_enabled || false);
      setCreatedAt(data.created_at ? new Date(data.created_at).toLocaleDateString() : "");
      setShowNsfw(data.show_nsfw || false);
      setNewEpisodeNotifications(data.new_episode_notifications || false);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not logged in");
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        watch_goal: watchGoal,
        theme: theme.toLowerCase(),
        time_zone: timeZone,
        notifications_enabled: notifications,
        show_nsfw: showNsfw,
        new_episode_notifications: newEpisodeNotifications,
      })
      .eq("id", user.id);
    if (error) {
      setError("Failed to save settings");
      console.error(error);
    } else {
      setSuccess("Settings saved!");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Main Settings */}
          <div className="md:col-span-2 flex flex-col gap-8">
            {/* Account Settings */}
            <div className="bg-white/10 rounded-2xl p-8 shadow-xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><SettingsIcon className="w-6 h-6 text-purple-300" /> Account Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-purple-200 mb-1">Full Name</label>
                  <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-purple-200 mb-1">Email</label>
                  <input type="email" value={email} disabled className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-purple-800 opacity-60" />
                </div>
                <div>
                  <label className="block text-purple-200 mb-1">Monthly Watch Goal (hours)</label>
                  <input type="number" value={watchGoal} onChange={e => setWatchGoal(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              {/* New Episode Notifications - Now free for all */}
              <div className="flex items-center gap-3 mt-4">
                <label className="text-purple-200">New Episode Notifications</label>
                <input
                  type="checkbox"
                  checked={newEpisodeNotifications}
                  onChange={e => setNewEpisodeNotifications(e.target.checked)}
                  className="accent-purple-500 w-5 h-5"
                />
                <span className="text-xs text-green-400">✨ Free for everyone!</span>
              </div>
              {/* NSFW Toggle */}
              <div className="flex items-center gap-3 mt-4">
                <label className="text-purple-200">Show NSFW Titles</label>
                <input
                  type="checkbox"
                  checked={showNsfw}
                  onChange={e => setShowNsfw(e.target.checked)}
                  className="accent-purple-500 w-5 h-5"
                />
                <span className="text-xs text-slate-400">(Uncheck to hide Ecchi, Hentai, etc.)</span>
              </div>
            </div>
            {/* Preferences */}
            <div className="bg-white/10 rounded-2xl p-8 shadow-xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-purple-200 mb-1">Theme</label>
                  <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {themes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-purple-200 mb-1">Time Zone</label>
                  <select value={timeZone} onChange={e => setTimeZone(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {timeZones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
              </div>
              {error && <div className="text-red-400 mb-2">{error}</div>}
              {success && <div className="text-green-400 mb-2">{success}</div>}
              <div className="flex gap-4 mt-4">
                <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold flex items-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  Save
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar: Quick Stats */}
          <div className="flex flex-col gap-8">
            <div className="bg-white/10 rounded-2xl p-8 shadow-xl border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-green-400" /> All Features Free!
              </h2>
              <ul className="text-green-200 text-sm mb-4">
                <li>✅ Unlimited tracking</li>
                <li>✅ Episode breakdowns</li>
                <li>✅ Smart watch guides</li>
                <li>✅ Progress tracking</li>
                <li>✅ NSFW filtering</li>
                <li>✅ Episode notifications</li>
              </ul>
              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 text-center">
                <span className="text-green-300 font-medium text-sm">🎉 Everything included at no cost!</span>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-8 shadow-xl border border-white/10">
              <h2 className="text-lg font-bold text-white mb-2">Account Info</h2>
              <div className="text-purple-200 text-sm mb-2">Member since <span className="text-white font-semibold">{createdAt}</span></div>
              <div className="text-purple-200 text-sm">All features <span className="text-green-400 font-semibold">free</span></div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Settings; 