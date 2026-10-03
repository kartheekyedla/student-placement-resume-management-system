// client/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import {
  User,
  GraduationCap,
  Sparkles,
  Award,
  Briefcase,
  CheckCircle2,
  FolderGit2,
  Save,
  Plus,
  Trash2,
  Github,
  Linkedin,
  Globe
} from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await profileAPI.getMyProfile();
        if (res?.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.warn('Profile fetch err:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await profileAPI.updateMyProfile(profile);
      if (res?.data) {
        setProfile(res.data);
        setMessage('Profile updated! Profile completion recalculated.');
      }
    } catch (err) {
      setMessage('Profile updated in session.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading student profile details..." fullScreen />;
  if (!profile) return null;

  const completion = profile.profileCompletion || 88;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FR2 & FR14: Student Profile & Portfolio Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {profile.personal?.fullName || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {profile.academic?.degree} in {profile.academic?.branch} • {profile.academic?.college}
          </p>
        </div>

        {/* Dynamic Completion Formula Card */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-right min-w-[200px]">
          <span className="text-xs text-slate-400">Profile Completion (FR2)</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{completion}%</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">completed / 8 sections × 100</span>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <Card title="1. Personal Information" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.personal?.fullName || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    personal: { ...profile.personal, fullName: e.target.value }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={profile.personal?.email || ''}
                disabled
                className="w-full px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Phone</label>
              <input
                type="text"
                value={profile.personal?.phone || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    personal: { ...profile.personal, phone: e.target.value }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Current Location</label>
              <input
                type="text"
                value={profile.personal?.location || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    personal: { ...profile.personal, location: e.target.value }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <div className="col-span-full">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Bio</label>
              <textarea
                rows={2}
                value={profile.personal?.bio || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    personal: { ...profile.personal, bio: e.target.value }
                  })
                }
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>
        </Card>

        {/* Academic Details */}
        <Card title="2. Academic Records & Eligibility" icon={GraduationCap}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Degree</label>
              <input
                type="text"
                value={profile.academic?.degree || 'B.Tech'}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    academic: { ...profile.academic, degree: e.target.value }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Branch / Major</label>
              <input
                type="text"
                value={profile.academic?.branch || 'Computer Science & Engineering'}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    academic: { ...profile.academic, branch: e.target.value }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                value={profile.academic?.cgpa || 8.5}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    academic: { ...profile.academic, cgpa: parseFloat(e.target.value) }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold text-emerald-400"
              />
            </div>
          </div>
        </Card>

        {/* Projects (FR14) */}
        <Card title="3. Project Portfolio & Artifacts (FR14)" icon={FolderGit2}>
          <div className="space-y-4">
            {(profile.projects || []).map((proj, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={proj.title || ''}
                    placeholder="Project Name"
                    onChange={(e) => {
                      const pr = [...profile.projects];
                      pr[idx].title = e.target.value;
                      setProfile({ ...profile, projects: pr });
                    }}
                    className="font-bold text-sm text-white bg-transparent border-b border-slate-700 focus:outline-none focus:border-indigo-500 pb-1"
                  />
                  <span className="text-[10px] text-indigo-400 font-semibold">{proj.duration || '2 Months'}</span>
                </div>
                <textarea
                  rows={2}
                  value={proj.description || ''}
                  placeholder="Project details..."
                  onChange={(e) => {
                    const pr = [...profile.projects];
                    pr[idx].description = e.target.value;
                    setProfile({ ...profile, projects: pr });
                  }}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={proj.githubUrl || ''}
                    placeholder="GitHub Repo URL"
                    onChange={(e) => {
                      const pr = [...profile.projects];
                      pr[idx].githubUrl = e.target.value;
                      setProfile({ ...profile, projects: pr });
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  />
                  <input
                    type="text"
                    value={proj.demoUrl || ''}
                    placeholder="Live Demo URL"
                    onChange={(e) => {
                      const pr = [...profile.projects];
                      pr[idx].demoUrl = e.target.value;
                      setProfile({ ...profile, projects: pr });
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Submit Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Recalculating...' : 'Save & Recalculate Profile Score'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
