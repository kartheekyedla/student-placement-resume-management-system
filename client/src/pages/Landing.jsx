// client/src/pages/Landing.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  FileText,
  Briefcase,
  GitBranch,
  Brain,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Building,
  GraduationCap,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const Landing = () => {
  const { quickLogin } = useAuth();
  const navigate = useNavigate();

  const handleTestDrive = async (roleKey) => {
    try {
      await quickLogin(roleKey);
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    }
  };

  const coreFeatures = [
    {
      id: 'feature1',
      title: 'Resume Builder & ATS Analyzer',
      tag: 'FR4, FR5, FR6',
      icon: FileText,
      color: 'from-blue-500 to-indigo-500',
      description:
        'Craft ATS-optimized resumes with 5 professional templates (Modern, Minimal, Software Developer, Fresher). In-browser and open-source PDF parsing evaluates Skills, Projects, Education, Keywords, and Completeness.',
      bullets: ['5 Standard Templates', 'Transparent ATS Scoring Engine', 'Live PDF Export (Free Tier)']
    },
    {
      id: 'feature2',
      title: 'Explainable Job Match Engine',
      tag: 'FR7, FR8, FR9',
      icon: Briefcase,
      color: 'from-indigo-500 to-purple-500',
      description:
        'Browse campus opportunities with a transparent 6-factor weighted algorithm (Skill 50%, Education 15%, CGPA 15%, Experience 10%, Certs 5%, Location 5%). Never a black box: full reasoning is visible.',
      bullets: ['10+ Filter Dimensions', 'Ranked Recommendations', 'Detailed Match Breakdown']
    },
    {
      id: 'feature3',
      title: 'Skill Gap & Career Roadmaps',
      tag: 'FR10',
      icon: GitBranch,
      color: 'from-emerald-500 to-teal-500',
      description:
        'Select target roles (Full-Stack, AI/ML, DevOps, Data Science) and compute real-time Skill Gaps (Required Skills - Current Skills). Track progress across interactive multi-stage learning trees.',
      bullets: ['Dynamic Skill Gap Calculation', 'Interactive Status Toggling', 'Curated Free Resources']
    },
    {
      id: 'feature4',
      title: 'Mock Interview & Readiness Index',
      tag: 'FR11, FR12',
      icon: Brain,
      color: 'from-amber-500 to-orange-500',
      description:
        'Practice with rule-based question banks across 10 core domains (Java, Python, JS, DSA, DBMS, HR). Track your holistic 100-point Placement Readiness Score combining profile, resume, skills, and mock tests.',
      bullets: ['10 Technical Question Categories', 'Keyword & Depth Scoring', '100-Point Readiness Index']
    },
    {
      id: 'feature5',
      title: 'Placement Lifecycle & Analytics',
      tag: 'FR13 - FR17',
      icon: CalendarCheck,
      color: 'from-pink-500 to-rose-500',
      description:
        'End-to-end 7-stage application tracking timeline (Applied → Under Review → Shortlisted → Assessment → Tech Interview → HR Interview → Selected). Officer placement drives, interview calendars, and Recharts analytics.',
      bullets: ['7-Stage Status Timeline', 'Officer Drive Management', 'Interactive Recharts Analytics']
    }
  ];

  const rolePersonas = [
    {
      role: 'student',
      title: 'Student / Candidate',
      icon: GraduationCap,
      description: 'Build resumes, discover high-match jobs, close skill gaps, practice mock interviews, and track application milestones.',
      badge: 'Job Seeker'
    },
    {
      role: 'recruiter',
      title: 'Recruiter / Company',
      icon: Building,
      description: 'Post job requirements, view candidate fit scores, review resumes, shortlist talent, and schedule multi-round interviews.',
      badge: 'Talent Acquisition'
    },
    {
      role: 'officer',
      title: 'Placement Officer',
      icon: Award,
      description: 'Coordinate placement drives, automatically identify eligible student cohorts, monitor interview pipeline, and export reports.',
      badge: 'Campus Admin'
    },
    {
      role: 'admin',
      title: 'System Administrator',
      icon: ShieldCheck,
      description: 'Oversee all platform accounts, approve company profiles, verify job postings, audit activities, and configure system policies.',
      badge: 'Super Admin'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>SmartHire • AI-Assisted Placement Platform (SRS Version 1.0)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Empowering Campus Placements with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Explainable AI & Precision Matching
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Manage the complete college placement lifecycle without paid APIs. Transparent rule-based resume scoring,
            weighted job matching, automated skill-gap roadmaps, and unified role dashboards.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <span>Explore Platform Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 glass-panel hover:bg-slate-800 transition"
            >
              <span>Sign In with Existing Account</span>
            </Link>
          </div>

          {/* Quick 1-Click Role Launch Bar */}
          <div className="mt-12 p-4 max-w-3xl mx-auto glass-panel rounded-2xl border border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Instant 1-Click Persona Test-Drive (No registration required)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {rolePersonas.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.role}
                    onClick={() => handleTestDrive(p.role)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-900/80 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-slate-200 transition group"
                  >
                    <Icon className="w-5 h-5 text-indigo-400 group-hover:text-emerald-300 transition" />
                    <span className="text-xs font-bold text-white capitalize">{p.role}</span>
                    <span className="text-[10px] text-slate-400">{p.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metrics Ticker */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-xl text-center">
              <p className="text-3xl font-extrabold text-indigo-400">100%</p>
              <p className="text-xs text-slate-400 mt-1">Zero Paid API Dependency</p>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <p className="text-3xl font-extrabold text-emerald-400">6-Factor</p>
              <p className="text-xs text-slate-400 mt-1">Explainable Match Engine</p>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <p className="text-3xl font-extrabold text-purple-400">7-Stage</p>
              <p className="text-xs text-slate-400 mt-1">Visual Application Timeline</p>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <p className="text-3xl font-extrabold text-amber-400">4 Roles</p>
              <p className="text-xs text-slate-400 mt-1">Student, Recruiter, Officer, Admin</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Features Section (Mapped Exactly to SRS Section 3) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            SRS Architecture
          </span>
          <h2 className="text-3xl font-bold text-white mt-3 tracking-tight">
            5 Core Pillars Built Exactly as per Functional Requirements
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every feature strictly adheres to SRS Section 3 specifications with transparent, explainable formulas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} p-0.5 shadow-lg`}>
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{feat.description}</p>
                </div>

                <div>
                  <div className="space-y-1.5 pt-3 border-t border-slate-800">
                    {feat.bullets.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/${feat.id}`}
                    className="mt-5 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600/30 border border-slate-800 hover:border-indigo-500/40 text-xs font-semibold text-indigo-300 flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role Personas Section */}
      <section className="py-16 bg-slate-900/30 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Designed for the Entire Placement Ecosystem</h2>
            <p className="text-sm text-slate-400 mt-2">
              Role-Based Access Control (RBAC) ensures distinct permissions, tailored workflows, and privacy across all stakeholders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rolePersonas.map((rp) => {
              const Icon = rp.icon;
              return (
                <div key={rp.role} className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {rp.badge}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">{rp.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{rp.description}</p>
                  </div>

                  <button
                    onClick={() => handleTestDrive(rp.role)}
                    className="mt-6 w-full py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-indigo-600 transition"
                  >
                    Test {rp.title.split(' ')[0]} View
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-white text-sm">SmartHire (PathPilot MVP)</span>
          <span className="text-xs text-slate-500">• End-to-End Placement Platform</span>
        </div>
        <p className="text-xs text-slate-400">
          Built strictly adhering to Software Requirements Specification (SRS) Version 1.0.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
