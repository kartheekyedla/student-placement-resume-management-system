// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Feature1_ResumeStudio from './pages/Feature1_ResumeStudio';
import Feature2_JobMatching from './pages/Feature2_JobMatching';
import Feature3_SkillRoadmap from './pages/Feature3_SkillRoadmap';
import Feature4_MockInterview from './pages/Feature4_MockInterview';
import Feature5_PlacementTracker from './pages/Feature5_PlacementTracker';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob';

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Core Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Feature 1: Resume Builder & ATS Analyzer (FR4, FR5, FR6) */}
              <Route
                path="/feature1"
                element={
                  <ProtectedRoute>
                    <Feature1_ResumeStudio />
                  </ProtectedRoute>
                }
              />
              <Route path="/resume-builder" element={<Navigate to="/feature1" replace />} />
              <Route path="/resume-studio" element={<Navigate to="/feature1" replace />} />

              {/* Feature 2: Job Board & Explainable Match Engine (FR7, FR8, FR9) */}
              <Route
                path="/feature2"
                element={
                  <ProtectedRoute>
                    <Feature2_JobMatching />
                  </ProtectedRoute>
                }
              />
              <Route path="/jobs" element={<Navigate to="/feature2" replace />} />

              {/* Feature 3: Skill Gap Analyzer & Career Roadmaps (FR10) */}
              <Route
                path="/feature3"
                element={
                  <ProtectedRoute>
                    <Feature3_SkillRoadmap />
                  </ProtectedRoute>
                }
              />
              <Route path="/roadmap" element={<Navigate to="/feature3" replace />} />

              {/* Feature 4: Mock Interview Simulator & Placement Readiness Index (FR11, FR12) */}
              <Route
                path="/feature4"
                element={
                  <ProtectedRoute>
                    <Feature4_MockInterview />
                  </ProtectedRoute>
                }
              />
              <Route path="/mock-interview" element={<Navigate to="/feature4" replace />} />

              {/* Feature 5: Placement Lifecycle Tracker, Drives, Calendar & Analytics (FR13-17) */}
              <Route
                path="/feature5"
                element={
                  <ProtectedRoute>
                    <Feature5_PlacementTracker />
                  </ProtectedRoute>
                }
              />
              <Route path="/tracker" element={<Navigate to="/feature5" replace />} />
              <Route path="/applications" element={<Navigate to="/feature5" replace />} />
              <Route path="/drives" element={<Navigate to="/feature5" replace />} />
              <Route path="/analytics" element={<Navigate to="/feature5" replace />} />

              {/* Student Profile & Portfolio (FR2, FR14) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter / Placement Officer Job Posting (FR15) */}
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'officer', 'admin']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
