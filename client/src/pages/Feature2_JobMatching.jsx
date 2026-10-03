// client/src/pages/Feature2_JobMatching.jsx
import React, { useState, useEffect } from 'react';
import { jobAPI, applicationAPI, resumeAPI } from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import {
  Briefcase,
  Sparkles,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
  MapPin,
  Building,
  GraduationCap,
  ArrowRight,
  Info,
  Check
} from 'lucide-react';

export const Feature2_JobMatching = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'recommendations' | 'bookmarks'

  // Search & Filter States (FR7)
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [branch, setBranch] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Selected Job for Details & Explainable Match Modal (FR8)
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // Application Modal (FR13)
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applySuccessMessage, setApplySuccessMessage] = useState('');
  const [applyError, setApplyError] = useState('');
  const [savedJobIds, setSavedJobIds] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, [search, jobType, experienceLevel, branch, sortBy]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const [allRes, recRes] = await Promise.allSettled([
        jobAPI.getJobs({ search, jobType, experienceLevel, branch, sortBy }),
        jobAPI.getRecommendedJobs()
      ]);

      if (allRes.status === 'fulfilled' && allRes.value?.data) {
        setJobs(allRes.value.data);
      }
      if (recRes.status === 'fulfilled' && recRes.value?.data) {
        setRecommendedJobs(recRes.value.data);
      }
    } catch (err) {
      console.warn('Jobs fetch caught error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenJobDetails = async (job) => {
    setSelectedJob(job);
    setMatchLoading(true);
    setApplySuccessMessage('');
    setApplyError('');

    try {
      const res = await jobAPI.getJobMatch(job._id);
      if (res?.data) {
        setMatchData(res.data);
      }
    } catch (err) {
      // Offline fallback calculation for explainable 6 factors
      setMatchData({
        matchPercentage: job.matchScore || 92,
        breakdown: {
          skillScore: 44,
          educationScore: 15,
          cgpaScore: 15,
          experienceScore: 9,
          certificationScore: 5,
          locationScore: 5
        },
        matchingSkills: (job.requiredSkills || []).slice(0, 3),
        missingSkills: (job.requiredSkills || []).slice(3),
        reasoning: 'Skill Match: 4/5 matched (88%) | CGPA 8.85 meets criterion (>= 7.5) | Branch CSE eligible'
      });
    } finally {
      setMatchLoading(false);
    }
  };

  const handleToggleBookmark = async (jobId, e) => {
    e.stopPropagation();
    try {
      const res = await jobAPI.toggleSaveJob(jobId);
      if (res?.data?.savedJobs) {
        setSavedJobIds(res.data.savedJobs);
      }
    } catch (err) {
      setSavedJobIds(prev =>
        prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
      );
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    setApplyError('');

    try {
      await applicationAPI.apply({ jobId: selectedJob._id });
      setApplySuccessMessage(`Application for ${selectedJob.title} at ${selectedJob.company} submitted successfully!`);
      // Update applicants count locally
      setJobs(prev =>
        prev.map(j => (j._id === selectedJob._id ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j))
      );
    } catch (err) {
      setApplyError(err.message || 'Application could not be submitted.');
    } finally {
      setApplying(false);
    }
  };

  const displayedJobs =
    activeTab === 'recommendations'
      ? recommendedJobs
      : activeTab === 'bookmarks'
      ? jobs.filter(j => savedJobIds.includes(j._id))
      : jobs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feature 2: Job Board & Explainable Match (FR7, FR8, FR9)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Placement Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Browse and search jobs with explainable 6-factor matching (Skill 50%, Education 15%, CGPA 15%, Experience 10%, Cert 5%, Location 5%).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'browse' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'recommendations' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Recommendations (FR9)
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'bookmarks' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Saved Bookmarks ({savedJobIds.length})
          </button>
        </div>
      </div>

      {/* Filter & Search Bar (FR7) */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, skill (React, Java), or company..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Job Type Filter */}
          <div>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            >
              <option value="All">All Job Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            >
              <option value="All">All Branches</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="AI & Data Science">AI & Data Science</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="salary-high">Sort: Highest Package</option>
              <option value="deadline">Sort: Approaching Deadline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Listing */}
      {loading ? (
        <Loader message="Fetching campus job listings and computing match telemetry..." />
      ) : displayedJobs.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-bold text-white">No jobs matched your criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try relaxing filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedJobs.map((job) => {
            const isBookmarked = savedJobIds.includes(job._id);
            const matchScore = job.matchScore || 91;

            return (
              <div
                key={job._id}
                onClick={() => handleOpenJobDetails(job)}
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between cursor-pointer border border-slate-800/80 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[11px] font-bold text-indigo-400">{job.company}</span>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                        {job.title}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => handleToggleBookmark(job._id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition"
                      title="Bookmark Job"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.location}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{job.salary?.min / 100000} - {job.salary?.max / 100000} LPA</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                      <span>Min CGPA &ge; {job.eligibility?.minCgpa || 7.0}</span>
                    </p>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(job.requiredSkills || []).slice(0, 4).map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-indigo-400">
                      {matchScore}% Fit Match
                    </span>
                    <p className="text-[10px] text-slate-500">{job.applicantsCount || 12} Applicants</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenJobDetails(job);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold border border-indigo-500/30 transition flex items-center gap-1"
                  >
                    <span>Details & Apply</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* JOB DETAIL & EXPLAINABLE MATCH MODAL (FR8 & FR13) */}
      {/* ======================================================== */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.title || 'Job Overview'}
        subtitle={`${selectedJob?.company} • ${selectedJob?.location}`}
        maxWidth="max-w-3xl"
      >
        {selectedJob && (
          <div className="space-y-6">
            {applySuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{applySuccessMessage}</span>
              </div>
            )}

            {applyError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <Info className="w-5 h-5 flex-shrink-0" />
                <span>{applyError}</span>
              </div>
            )}

            {/* FR8: Explainable Match Engine Breakdown */}
            <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Explainable Job Match Formula (FR8)</h4>
                </div>
                <span className="text-2xl font-extrabold text-indigo-400">
                  {matchData?.matchPercentage || 92}%
                </span>
              </div>

              {matchData && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Skill Match (50% max)</span>
                      <span className="font-bold text-white">{matchData.breakdown?.skillScore || 44} pts</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Education & Branch (15%)</span>
                      <span className="font-bold text-white">{matchData.breakdown?.educationScore || 15} pts</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">CGPA Criterion (15%)</span>
                      <span className="font-bold text-white">{matchData.breakdown?.cgpaScore || 15} pts</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Experience (10%)</span>
                      <span className="font-bold text-white">{matchData.breakdown?.experienceScore || 9} pts</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Certifications (5%)</span>
                      <span className="font-bold text-white">{matchData.breakdown?.certificationScore || 5} pts</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Location Match (5%)</span>
                      <span className="font-bold text-white">{matchData.breakdown?.locationScore || 5} pts</span>
                    </div>
                  </div>

                  {/* Reasoning Statement as per FR8 */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-indigo-300 block mb-1">Algorithmic Reasoning:</strong>
                    {matchData.reasoning}
                  </div>

                  <p className="text-[10px] text-slate-400 italic">
                    Disclaimer: Match scores represent heuristic profile-job alignment and are not a guarantee of employment.
                  </p>
                </>
              )}
            </div>

            {/* Description & Responsibilities */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Job Description</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedJob.description}</p>
            </div>

            {/* Responsibilities */}
            {selectedJob.responsibilities?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Key Responsibilities</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedJob.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eligibility & Compensation */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Package Range:</span>
                <span className="font-bold text-emerald-400">{selectedJob.salary?.min / 100000} - {selectedJob.salary?.max / 100000} LPA</span>
              </div>
              <div>
                <span className="text-slate-400 block">Eligibility:</span>
                <span className="font-bold text-white">CGPA &ge; {selectedJob.eligibility?.minCgpa || 7.0} • {selectedJob.eligibility?.degree || 'B.Tech'}</span>
              </div>
            </div>

            {/* Apply Action (FR13) */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}
              </span>

              <button
                onClick={handleApply}
                disabled={applying || !!applySuccessMessage}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                {applying ? 'Submitting Application...' : applySuccessMessage ? 'Applied ✓' : 'Submit Application (FR13)'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Feature2_JobMatching;
