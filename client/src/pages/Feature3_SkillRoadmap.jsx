// client/src/pages/Feature3_SkillRoadmap.jsx
import React, { useState, useEffect } from 'react';
import { roadmapAPI } from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import {
  GitBranch,
  Sparkles,
  CheckCircle2,
  Clock,
  Circle,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Target,
  Zap
} from 'lucide-react';

const AVAILABLE_ROLES = [
  { id: 'fullstack-dev', title: 'Full-Stack Web Developer', description: 'React, Node.js, Express, MongoDB, TypeScript & Docker' },
  { id: 'ai-ml-engineer', title: 'AI / Machine Learning Engineer', description: 'Python, PyTorch, Pandas, Scikit-Learn & FastAPI' },
  { id: 'devops-engineer', title: 'DevOps & Cloud Engineer', description: 'Docker, Kubernetes, AWS, Linux, Terraform & CI/CD' },
  { id: 'data-analyst', title: 'Data Analyst & BI Specialist', description: 'SQL, Python, Power BI, Statistics & Data Modeling' }
];

export const Feature3_SkillRoadmap = () => {
  const [loading, setLoading] = useState(true);
  const [roadmaps, setRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await roadmapAPI.getMyRoadmaps();
      if (res?.data && res.data.length > 0) {
        setRoadmaps(res.data);
        setActiveRoadmap(res.data[0]);
        // Trigger initial role skill-gap analysis
        handleSelectRole(res.data[0].roleId || 'fullstack-dev');
      }
    } catch (err) {
      console.warn('Roadmap fetch err:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = async (roleId) => {
    try {
      const res = await roadmapAPI.selectRole({ roleId });
      if (res?.data) {
        setActiveRoadmap(res.data.roadmap);
        setSkillGap(res.data.skillGap);
      }
    } catch (err) {
      console.warn('Select role error fallback:', err);
    }
  };

  const handleToggleItemStatus = async (itemId, currentStatus) => {
    if (!activeRoadmap) return;
    setUpdatingId(itemId);

    const nextStatus =
      currentStatus === 'Not Started'
        ? 'Learning'
        : currentStatus === 'Learning'
        ? 'Completed'
        : 'Not Started';

    try {
      const res = await roadmapAPI.updateItemStatus(activeRoadmap._id, {
        itemId,
        status: nextStatus
      });
      if (res?.data) {
        setActiveRoadmap(res.data);
      }
    } catch (err) {
      // Offline fallback: toggle locally
      const updatedStages = (activeRoadmap.stages || []).map((stage) => ({
        ...stage,
        items: stage.items.map((it) => (it.id === itemId ? { ...it, status: nextStatus } : it))
      }));
      setActiveRoadmap({ ...activeRoadmap, stages: updatedStages });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loader message="Generating career roadmaps and computing skill gap..." fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feature 3: Skill Gap Analyzer & Dynamic Career Roadmaps (FR10)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Target Career Roadmaps & Skill Gap Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Select a target role to compute missing skills (Required Skills - Current Skills) and advance your interactive stage progress.
          </p>
        </div>

        {/* Overall Roadmap Progress Badge */}
        {activeRoadmap && (
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-right min-w-[200px]">
            <span className="text-xs font-semibold text-slate-400">Roadmap Progress</span>
            <div className="flex items-baseline justify-end gap-2 mt-1">
              <span className="text-3xl font-extrabold text-emerald-400">
                {activeRoadmap.overallProgress || 65}%
              </span>
              <span className="text-xs text-slate-500">Completed</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${activeRoadmap.overallProgress || 65}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Target Role Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {AVAILABLE_ROLES.map((r) => (
          <button
            key={r.id}
            onClick={() => handleSelectRole(r.id)}
            className={`p-4 rounded-2xl text-left border transition ${
              activeRoadmap?.roleId === r.id
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                : 'glass-panel border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold text-white">{r.title}</h3>
              {activeRoadmap?.roleId === r.id && <Zap className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{r.description}</p>
          </button>
        ))}
      </div>

      {/* Skill Gap Analysis Box (FR10: Required Skills - Current Skills) */}
      {skillGap && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                FR10 Skill Gap Formula: [Required Skills - Current Skills]
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Target Alignment: {skillGap.targetRole}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-amber-400">
                {skillGap.gapPercentage}% Skill Gap
              </span>
              <p className="text-[11px] text-slate-400">
                {skillGap.missingSkills.length} missing of {skillGap.requiredSkills.length} required skills
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Acquired Skills */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Acquired Skills on Your Profile</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillGap.acquiredSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-semibold"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills (The Gap) */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2.5">
                <Target className="w-4 h-4" />
                <span>Target Skill Gap to Close</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillGap.missingSkills.length === 0 ? (
                  <span className="text-xs text-slate-400">All required core skills acquired!</span>
                ) : (
                  skillGap.missingSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-semibold"
                    >
                      + Learn {sk}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Stages & Checklist (FR10) */}
      {activeRoadmap && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Interactive Learning Stages & Milestones
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Circle className="w-3 h-3 text-slate-500" /> Not Started
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Learning
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {(activeRoadmap.stages || []).map((stage, sIdx) => (
              <div
                key={stage.stageId || sIdx}
                className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                      {sIdx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-white">{stage.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {stage.items.filter((i) => i.status === 'Completed').length} / {stage.items.length} Modules Finished
                  </span>
                </div>

                {/* Items List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stage.items.map((item) => {
                    const isCompleted = item.status === 'Completed';
                    const isLearning = item.status === 'Learning';

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleItemStatus(item.id, item.status)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                          isCompleted
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : isLearning
                            ? 'bg-amber-950/20 border-amber-500/40'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                item.category === 'Tool'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : item.category === 'Skill'
                                  ? 'bg-indigo-500/20 text-indigo-300'
                                  : item.category === 'Project'
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {item.category}
                            </span>
                            <h4
                              className={`text-xs font-semibold ${
                                isCompleted ? 'line-through text-slate-400' : 'text-white'
                              }`}
                            >
                              {item.name}
                            </h4>
                          </div>

                          {item.learningResource && (
                            <p className="text-[11px] text-indigo-400 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span>Resource: {item.learningResource}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex-shrink-0 pt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isLearning ? (
                            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feature3_SkillRoadmap;
