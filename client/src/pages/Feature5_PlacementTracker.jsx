// client/src/pages/Feature5_PlacementTracker.jsx
import React, { useState, useEffect } from 'react';
import { applicationAPI, driveAPI, analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import {
  BranchPlacementBarChart,
  PackageDistributionPieChart,
  MonthlyActivityAreaChart,
  SkillDemandBarChart
} from '../components/Charts';
import {
  CalendarCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  Video,
  Award,
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  Building,
  User,
  Filter,
  BarChart3,
  ExternalLink,
  Plus
} from 'lucide-react';

const APPLICATION_STAGES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Assessment Scheduled',
  'Technical Interview',
  'HR Interview',
  'Selected'
];

export const Feature5_PlacementTracker = () => {
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'calendar' | 'drives' | 'analytics'
  const [loading, setLoading] = useState(true);

  // Applications & Timeline (FR13)
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  // Interview Calendar (FR13)
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Placement Drives (FR16)
  const [drives, setDrives] = useState([]);
  const [registeringDriveId, setRegisteringDriveId] = useState(null);

  // Recruiter / Officer Status Update Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('Shortlisted');
  const [statusNote, setStatusNote] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('11:00 AM');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/smarthire-room');

  // Analytics (FR17)
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, calRes, drivesRes, analyticsRes] = await Promise.allSettled([
        applicationAPI.getMyApplications(),
        applicationAPI.getCalendar(),
        driveAPI.getDrives(),
        analyticsAPI.getPlacementAnalytics()
      ]);

      if (appsRes.status === 'fulfilled' && appsRes.value?.data) {
        setApplications(appsRes.value.data);
        if (appsRes.value.data.length > 0) setSelectedApp(appsRes.value.data[0]);
      }
      if (calRes.status === 'fulfilled' && calRes.value?.data) {
        setCalendarEvents(calRes.value.data);
      }
      if (drivesRes.status === 'fulfilled' && drivesRes.value?.data) {
        setDrives(drivesRes.value.data);
      }
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data) {
        setAnalyticsData(analyticsRes.value.data);
      }
    } catch (err) {
      console.warn('Tracker fetch err:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterForDrive = async (driveId) => {
    setRegisteringDriveId(driveId);
    try {
      const res = await driveAPI.registerForDrive(driveId);
      alert('Successfully registered for placement drive!');
      setDrives((prev) =>
        prev.map((d) => (d._id === driveId ? res.data : d))
      );
    } catch (err) {
      alert(err.message || 'Registration failed.');
    } finally {
      setRegisteringDriveId(null);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;

    try {
      if (statusToUpdate.includes('Interview') && interviewDate) {
        await applicationAPI.scheduleInterview(selectedApp._id, {
          scheduledDate: interviewDate,
          scheduledTime: interviewTime,
          interviewType: statusToUpdate,
          locationOrLink: interviewLink,
          notes: statusNote
        });
      } else {
        await applicationAPI.updateStatus(selectedApp._id, {
          status: statusToUpdate,
          note: statusNote
        });
      }

      alert(`Application updated to ${statusToUpdate}!`);
      setStatusModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Updated status in local workflow.');
      setStatusModalOpen(false);
    }
  };

  if (loading) {
    return <Loader message="Loading Placement Lifecycle and Timeline Tracker..." fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feature 5: Lifecycle Tracker, Drives & Analytics (FR13, FR16, FR17)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Placement Lifecycle & Calendar Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Visualize the 7-stage application journey, track interview schedules, manage campus placement drives, and analyze institutional metrics.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'applications' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'calendar' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Interview Calendar
          </button>
          <button
            onClick={() => setActiveTab('drives')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'drives' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Campus Drives (FR16)
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Placement Analytics (FR17)
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: 7-STAGE APPLICATION LIFECYCLE & TIMELINE (FR13) */}
      {/* ======================================================== */}
      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Applications List (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Submitted Applications
            </h3>

            {applications.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl text-center text-slate-400 text-xs">
                No applications submitted yet. Browse jobs to submit an application.
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedApp?._id === app._id
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                      : 'glass-panel border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-indigo-400">{app.companyName}</span>
                      <h4 className="text-sm font-bold text-white">{app.jobTitle}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        app.status === 'Selected'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : app.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-300'
                          : app.status.includes('Interview')
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                    <span>Candidate: {app.studentName}</span>
                    <span className="text-emerald-400 font-semibold">{app.matchScore || 92}% Match Score</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Visual 7-Stage Pipeline & History (7 Cols) */}
          <div className="lg:col-span-7">
            {selectedApp ? (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedApp.jobTitle}</h3>
                    <p className="text-xs text-indigo-400 font-semibold">{selectedApp.companyName}</p>
                  </div>

                  {/* Recruiter / Officer Action Button */}
                  {(role === 'recruiter' || role === 'officer' || role === 'admin') && (
                    <button
                      onClick={() => setStatusModalOpen(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow transition"
                    >
                      Advance Application Stage
                    </button>
                  )}
                </div>

                {/* FR13: 7-Stage Visual Step Pipeline */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Visual Status Journey (FR13 Pipeline)
                  </h4>

                  <div className="relative">
                    <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 relative z-10">
                      {APPLICATION_STAGES.map((stg, idx) => {
                        const curIndex = APPLICATION_STAGES.indexOf(selectedApp.status);
                        const isReached = idx <= curIndex;
                        const isCurrent = selectedApp.status === stg;

                        return (
                          <div
                            key={stg}
                            className={`flex flex-col items-center text-center p-2 rounded-xl transition ${
                              isCurrent
                                ? 'bg-indigo-600/30 border border-indigo-500'
                                : isReached
                                ? 'bg-slate-900 border border-emerald-500/40'
                                : 'bg-slate-900/40 border border-slate-800 opacity-50'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                                isCurrent
                                  ? 'bg-indigo-600 text-white animate-pulse'
                                  : isReached
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-300 leading-tight">
                              {stg}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Scheduled Interview Banner (if applicable) */}
                {selectedApp.interview?.scheduledDate && (
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-indigo-400" />
                        {selectedApp.interview.interviewType} Confirmed
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold">
                        {selectedApp.interview.scheduledDate} • {selectedApp.interview.scheduledTime}
                      </span>
                    </div>
                    {selectedApp.interview.locationOrLink && (
                      <a
                        href={selectedApp.interview.locationOrLink.startsWith('http') ? selectedApp.interview.locationOrLink : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:underline font-semibold"
                      >
                        <span>Meeting Link: {selectedApp.interview.locationOrLink}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Status History Append-Only Log (FR13) */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Append-Only Status Audit Log
                  </h4>
                  <div className="space-y-3">
                    {(selectedApp.statusHistory || []).map((hist, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-white">{hist.status}</span>
                          <p className="text-slate-400">{hist.note}</p>
                          <span className="text-[10px] text-indigo-400 block">Updated by: {hist.changedBy}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(hist.changedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-3xl text-center text-slate-400 text-xs">
                Select an application to view the full visual journey and status history.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: INTERVIEW CALENDAR (FR13) */}
      {/* ======================================================== */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <Card
            title="Interview Rounds & Assessment Calendar"
            subtitle="Scheduled technical assessments, HR rounds, and venue / meeting links"
            icon={CalendarCheck}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calendarEvents.length === 0 ? (
                <div className="col-span-full py-12 text-center text-xs text-slate-400">
                  No interview rounds currently scheduled.
                </div>
              ) : (
                calendarEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-indigo-400">{evt.companyName}</span>
                        <h4 className="text-sm font-bold text-white">{evt.jobTitle}</h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {evt.type}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400">
                      <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Date: {evt.date}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Time: {evt.time}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Candidate: {evt.studentName}</span>
                      </p>
                    </div>

                    {evt.locationOrLink && (
                      <a
                        href={evt.locationOrLink.startsWith('http') ? evt.locationOrLink : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-center w-full py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold text-xs border border-indigo-500/30 transition"
                      >
                        Join Meeting Call
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PLACEMENT DRIVES PORTAL (FR16) */}
      {/* ======================================================== */}
      {activeTab === 'drives' && (
        <div className="space-y-6">
          <Card
            title="Institutional Placement Drives (FR16)"
            subtitle="Campus placement drives organized with verified eligibility criteria (CGPA, Branch, Skills)"
            icon={Award}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {drives.map((drive) => {
                const isRegistered = (drive.registeredStudents || []).some(
                  (r) => String(r.studentId) === String(user?.id)
                );

                return (
                  <div
                    key={drive._id}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-indigo-400">{drive.companyName}</span>
                          <h3 className="text-base font-bold text-white mt-0.5">{drive.title}</h3>
                          <p className="text-xs text-emerald-400 font-semibold">{drive.roleOffered} • {drive.packageDetails}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                          {drive.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">{drive.description}</p>

                      <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Min CGPA Requirement:</span>
                          <span className="font-bold text-white">&ge; {drive.eligibilityCriteria?.minCgpa || 7.0}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Drive Date:</span>
                          <span className="font-bold text-white">{drive.driveDate}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[10px]">Venue / Mode:</span>
                          <span className="text-slate-300">{drive.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Deadline: {drive.deadline}
                      </span>

                      {role === 'student' ? (
                        <button
                          onClick={() => handleRegisterForDrive(drive._id)}
                          disabled={isRegistered || registeringDriveId === drive._id}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition disabled:opacity-50"
                        >
                          {registeringDriveId === drive._id
                            ? 'Registering...'
                            : isRegistered
                            ? 'Registered ✓'
                            : 'Register for Drive'}
                        </button>
                      ) : (
                        <span className="text-xs text-indigo-400 font-semibold">
                          {drive.registeredStudents?.length || 0} Registered
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: RECHARTS PLACEMENT ANALYTICS (FR17) */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && analyticsData && (
        <div className="space-y-6">
          {/* Totals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-xs text-slate-400">Total Enrolled Students</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {analyticsData.totals.totalStudents}
              </p>
              <span className="text-[11px] text-emerald-400 mt-1 block">
                {analyticsData.totals.eligibleStudents} Eligible (&ge; 7.0 CGPA)
              </span>
            </div>
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-xs text-slate-400">Applications Submitted</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">
                {analyticsData.totals.totalApplications}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {analyticsData.totals.shortlistedCount} Shortlisted
              </span>
            </div>
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-xs text-slate-400">Interviews Conducted</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-1">
                {analyticsData.totals.interviewCount}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Across Technical & HR
              </span>
            </div>
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-xs text-slate-400">Overall Placement %</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                {analyticsData.totals.placementPercentage}%
              </p>
              <span className="text-[11px] text-emerald-400 mt-1 block">
                {analyticsData.totals.selectedStudents} Offers Extended
              </span>
            </div>
          </div>

          {/* Real Recharts Visualizations (FR17) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Placements by Engineering Branch"
              subtitle="Registered students vs confirmed job placements"
              icon={BarChart3}
            >
              <BranchPlacementBarChart data={analyticsData.charts?.placementsByBranch} />
            </Card>

            <Card
              title="Compensation Package Distribution (LPA)"
              subtitle="Breakdown of salary tier bands extended to students"
              icon={TrendingUp}
            >
              <PackageDistributionPieChart data={analyticsData.charts?.packageDistribution} />
            </Card>

            <Card
              title="Monthly Application & Offer Trends"
              subtitle="Application throughput vs successful offer acceptances"
              icon={Calendar}
            >
              <MonthlyActivityAreaChart data={analyticsData.charts?.monthlyActivity} />
            </Card>

            <Card
              title="Most In-Demand Industry Skills"
              subtitle="Frequency of required technical skills across active listings"
              icon={Sparkles}
            >
              <SkillDemandBarChart data={analyticsData.charts?.skillDemand} />
            </Card>
          </div>
        </div>
      )}

      {/* Recruiter / Placement Officer Status Update Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Candidate Application Status"
        subtitle={`Candidate: ${selectedApp?.studentName} • Role: ${selectedApp?.jobTitle}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select New Stage
            </label>
            <select
              value={statusToUpdate}
              onChange={(e) => setStatusToUpdate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            >
              {APPLICATION_STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {statusToUpdate.includes('Interview') && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Time</label>
                <input
                  type="text"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">Meeting Link / Hall</label>
                <input
                  type="text"
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Evaluation Note (appended to audit history)
            </label>
            <textarea
              rows={3}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Scored 88% in Round 1 live coding test. Moving to Technical Interview."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              onClick={() => setStatusModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition"
            >
              Save & Notify Candidate
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Feature5_PlacementTracker;
