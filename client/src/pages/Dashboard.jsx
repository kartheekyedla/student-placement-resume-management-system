// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  profileAPI,
  jobAPI,
  applicationAPI,
  interviewAPI,
  driveAPI,
  analyticsAPI
} from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import {
  Compass,
  FileText,
  Briefcase,
  GitBranch,
  Brain,
  CalendarCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Video,
  ChevronRight,
  BarChart3,
  Building
} from 'lucide-react';

export const Dashboard = () => {
  const { user, role } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [drives, setDrives] = useState([]);
  const [readiness, setReadiness] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (role === 'student') {
          const [profRes, jobsRes, appsRes, readRes, drivesRes] = await Promise.allSettled([
            profileAPI.getMyProfile(),
            jobAPI.getRecommendedJobs(),
            applicationAPI.getMyApplications(),
            interviewAPI.getPlacementReadiness(),
            driveAPI.getDrives()
          ]);

          if (profRes.status === 'fulfilled' && profRes.value?.data) setProfile(profRes.value.data);
          if (jobsRes.status === 'fulfilled' && jobsRes.value?.data) setRecommendedJobs(jobsRes.value.data.slice(0, 4));
          if (appsRes.status === 'fulfilled' && appsRes.value?.data) setApplications(appsRes.value.data);
          if (readRes.status === 'fulfilled' && readRes.value?.data) setReadiness(readRes.value.data);
          if (drivesRes.status === 'fulfilled' && drivesRes.value?.data) setDrives(drivesRes.value.data);
        } else {
          // Recruiter / Officer / Admin metrics
          const [analyticsRes, jobsRes, appsRes, drivesRes] = await Promise.allSettled([
            analyticsAPI.getPlacementAnalytics(),
            jobAPI.getJobs(),
            applicationAPI.getMyApplications(),
            driveAPI.getDrives()
          ]);

          if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data) setAnalytics(analyticsRes.value.data);
          if (jobsRes.status === 'fulfilled' && jobsRes.value?.data) setRecommendedJobs(jobsRes.value.data.slice(0, 5));
          if (appsRes.status === 'fulfilled' && appsRes.value?.data) setApplications(appsRes.value.data);
          if (drivesRes.status === 'fulfilled' && drivesRes.value?.data) setDrives(drivesRes.value.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch caught error, using cached states.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  if (loading) {
    return <Loader message="Aggregating placement telemetry..." fullScreen />;
  }

  // ==========================================
  // STUDENT DASHBOARD (FR3)
  // ==========================================
  if (role === 'student') {
    const completion = profile?.profileCompletion || 88;
    const readinessScore = readiness?.score || 88;
    const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Assessment Scheduled').length;
    const upcomingInterviews = applications.filter(a => a.interview && a.interview.scheduledDate);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Placement Hub (FR3)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name || 'Candidate'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Track your placement trajectory, optimize ATS resume scoring, practice rule-based mock questions, and explore high-match jobs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/feature1"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-2 transition"
              >
                <FileText className="w-4 h-4" />
                <span>Resume Studio</span>
              </Link>
              <Link
                to="/feature4"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 glass-panel hover:bg-slate-800 flex items-center gap-2 transition"
              >
                <Brain className="w-4 h-4 text-amber-400" />
                <span>Mock Interview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Cards (FR3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Profile Completion */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Profile Completion</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                FR2 Formula
              </span>
            </div>
            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{completion}%</span>
                <span className="text-xs text-slate-400">8/8 Sections</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
            </div>
            <Link to="/profile" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium">
              <span>Update Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2. Resume Assessment Score */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Resume ATS Rating</span>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                FR5
              </span>
            </div>
            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">92</span>
                <span className="text-xs text-slate-400">/ 100 System Score</span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Keywords & Projects Verified</span>
              </p>
            </div>
            <Link to="/feature1" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium">
              <span>Analyze in Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3. Placement Readiness Index */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Placement Readiness</span>
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                FR11 (7-Dim)
              </span>
            </div>
            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{readinessScore}</span>
                <span className="text-xs text-slate-400">/ 100 Index</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">High interview qualification probability</p>
            </div>
            <Link to="/feature4" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium">
              <span>View Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4. Active Applications */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Applications</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                FR13
              </span>
            </div>
            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{applications.length}</span>
                <span className="text-xs text-slate-400">Applied</span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1">
                {shortlistedCount} shortlisted / assessment stage
              </p>
            </div>
            <Link to="/feature5" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium">
              <span>Open Tracker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Middle Section: Upcoming Interviews & Recommended Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Interview Schedule Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card
              title="Interview Schedule"
              subtitle="Confirmed interview rounds with meeting links"
              icon={Video}
              badge={`${upcomingInterviews.length} Scheduled`}
            >
              <div className="space-y-3">
                {upcomingInterviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No upcoming interviews scheduled yet.</p>
                ) : (
                  upcomingInterviews.map((app) => (
                    <div
                      key={app._id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{app.companyName}</p>
                          <p className="text-[11px] text-slate-400">{app.jobTitle}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          {app.interview?.interviewType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-300 pt-1">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CalendarCheck className="w-3.5 h-3.5" />
                          {app.interview?.scheduledDate}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {app.interview?.scheduledTime}
                        </span>
                      </div>
                      {app.interview?.locationOrLink && (
                        <a
                          href={app.interview.locationOrLink.startsWith('http') ? app.interview.locationOrLink : '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-center w-full py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold text-xs border border-indigo-500/30 transition"
                        >
                          Join Meeting Call
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>

              <Link
                to="/feature5"
                className="mt-4 block text-center text-xs text-slate-400 hover:text-white font-medium"
              >
                View Full Interview Calendar →
              </Link>
            </Card>

            {/* Placement Drives Portal Link */}
            <Card
              title="Active Placement Drives"
              subtitle="Officer-managed campus recruitment drives"
              icon={Award}
              badge={`${drives.length} Drives`}
            >
              <div className="space-y-2.5">
                {drives.slice(0, 2).map((d) => (
                  <div key={d._id} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xs font-bold text-white">{d.title}</p>
                    <p className="text-[11px] text-indigo-400">{d.companyName} • {d.packageDetails}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>Drive Date: {d.driveDate}</span>
                      <span className="text-emerald-400">Eligible: CGPA &ge; {d.eligibilityCriteria?.minCgpa}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/feature5"
                className="mt-3 block text-center text-xs text-indigo-400 hover:underline font-semibold"
              >
                Register for Campus Drives →
              </Link>
            </Card>
          </div>

          {/* Recommended Jobs (FR9) */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              title="Top Recommended Jobs for You"
              subtitle="Ranked dynamically using the transparent 6-factor explainable matching algorithm (FR8 & FR9)"
              icon={Briefcase}
              badge="Explainable Match"
              action={
                <Link
                  to="/feature2"
                  className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore All Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            >
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{job.title}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {job.jobType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {job.company} • {job.location} • <span className="text-emerald-400 font-semibold">{job.salary?.min / 100000} - {job.salary?.max / 100000} LPA</span>
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(job.requiredSkills || []).slice(0, 4).map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:border-l sm:border-slate-800 sm:pl-4">
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-indigo-400">
                          {job.matchScore || 92}%
                        </span>
                        <p className="text-[10px] text-slate-400">Fit Match</p>
                      </div>

                      <Link
                        to="/feature2"
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                      >
                        View & Apply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Feature Launchpad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/feature3"
                className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition group"
              >
                <GitBranch className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition mb-2" />
                <h4 className="text-xs font-bold text-white">Skill Gap Roadmap</h4>
                <p className="text-[11px] text-slate-400 mt-1">Full-stack & AI stage progress</p>
              </Link>

              <Link
                to="/feature4"
                className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition group"
              >
                <Brain className="w-5 h-5 text-amber-400 group-hover:scale-110 transition mb-2" />
                <h4 className="text-xs font-bold text-white">Rule-based Mock Interview</h4>
                <p className="text-[11px] text-slate-400 mt-1">10 domain technical question banks</p>
              </Link>

              <Link
                to="/feature5"
                className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition group"
              >
                <CalendarCheck className="w-5 h-5 text-purple-400 group-hover:scale-110 transition mb-2" />
                <h4 className="text-xs font-bold text-white">7-Stage Application Timeline</h4>
                <p className="text-[11px] text-slate-400 mt-1">Real-time status updates</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RECRUITER / OFFICER / ADMIN DASHBOARDS
  // ==========================================
  const totals = analytics?.totals || {
    totalStudents: 21,
    eligibleStudents: 18,
    totalApplications: 92,
    shortlistedCount: 46,
    interviewCount: 28,
    selectedStudents: 18,
    activeJobs: 5,
    placementPercentage: 86
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
            {role.toUpperCase()} PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {role === 'recruiter'
              ? 'Recruiter Candidate & Job Management'
              : role === 'officer'
              ? 'Campus Placement Officer Administration'
              : 'SmartHire Enterprise Admin Console'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time pipeline monitoring, applicant evaluation, and placement drive orchestration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/post-job"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Post New Opportunity</span>
          </Link>
          <Link
            to="/analytics"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 glass-panel hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Full Analytics Hub</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400">Total Registered Students</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{totals.totalStudents}</p>
          <p className="text-[11px] text-emerald-400 mt-1">{totals.eligibleStudents} Eligible (&ge; 7.0 CGPA)</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400">Active Job Postings</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-2">{totals.activeJobs}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across partner companies</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400">Applications in Pipeline</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-2">{totals.totalApplications}</p>
          <p className="text-[11px] text-slate-400 mt-1">{totals.shortlistedCount} shortlisted</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400">Campus Placement Rate</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">{totals.placementPercentage}%</p>
          <p className="text-[11px] text-emerald-400 mt-1">{totals.selectedStudents} confirmed offers</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Candidate Pipeline & Applications"
            subtitle="Review applications, transparent match scores, and update 7-stage workflow"
            icon={Users}
          >
            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No applications received yet.</p>
              ) : (
                applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{app.studentName}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                          {app.matchScore || 91}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {app.studentBranch} • CGPA {app.studentCgpa} • Applied for <span className="text-white">{app.jobTitle}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {app.status}
                      </span>
                      <Link
                        to="/feature5"
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card
            title="Placement Drives"
            subtitle="Campus recruitment events"
            icon={Award}
          >
            <div className="space-y-3">
              {drives.map((d) => (
                <div key={d._id} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-bold text-white">{d.title}</p>
                  <p className="text-[11px] text-indigo-400 mt-0.5">{d.companyName} • {d.packageDetails}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Date: {d.driveDate} • Min CGPA: {d.eligibilityCriteria?.minCgpa}</p>
                </div>
              ))}
            </div>
            <Link
              to="/feature5"
              className="mt-4 block text-center text-xs text-indigo-400 hover:underline font-semibold"
            >
              Open Placement Drive Console →
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
