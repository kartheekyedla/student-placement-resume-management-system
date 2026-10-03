// client/src/services/aiService.js
// Rule-based MOCK AI Service returning structured JSON as per SRS AI requirements.
// Operates with 100% Free-Tier zero external dependencies (NO API key required).
// Uses 800ms simulated network latency to emulate real-time AI reasoning.

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiService = {
  /**
   * Recommend top career pathways based on student's skills, branch, and CGPA
   * @param {Object} profile - Student profile data
   * @returns {Promise<Object>} Structured recommendations with fit scores
   */
  async getCareerRecommendations(profile) {
    await delay(800);

    const skills = (profile?.skills || []).map((s) => (typeof s === 'string' ? s : s.name).toLowerCase());
    const cgpa = Number(profile?.academic?.cgpa || 8.0);
    const branch = profile?.academic?.branch || 'Computer Science';

    const hasReactOrJS = skills.some((s) => s.includes('react') || s.includes('javascript') || s.includes('node'));
    const hasPythonOrData = skills.some((s) => s.includes('python') || s.includes('sql') || s.includes('machine learning'));
    const hasCloudOrDevOps = skills.some((s) => s.includes('docker') || s.includes('aws') || s.includes('linux'));

    return {
      success: true,
      provider: 'SmartHire Rule-Based AI Engine (Free Tier)',
      studentName: profile?.personal?.fullName || 'Student',
      analysisDate: new Date().toISOString(),
      topCareerMatches: [
        {
          role: 'Full-Stack Software Engineer',
          matchScore: hasReactOrJS ? 94 : 82,
          marketDemand: 'High (8,500+ Campus Openings)',
          averageSalaryRange: '8.0 - 15.0 LPA',
          keyStrengths: ['Web Development proficiency', 'Component architecture understanding', 'Modern JavaScript execution'],
          learningMilestones: ['Deep dive into Node.js event-loop clustering', 'Containerize full-stack apps with Docker Compose'],
          bestFitCompanies: ['Razorpay', 'Google Cloud', 'Microsoft', 'Atlassian']
        },
        {
          role: 'Cloud Infrastructure & DevOps Engineer',
          matchScore: hasCloudOrDevOps ? 91 : 78,
          marketDemand: 'Very High (11,000+ Campus Openings)',
          averageSalaryRange: '9.0 - 16.5 LPA',
          keyStrengths: ['System configuration', 'Git versioning discipline', 'Cloud infrastructure agility'],
          learningMilestones: ['Kubernetes pod scheduling', 'Terraform declarative infrastructure modules'],
          bestFitCompanies: ['Amazon Web Services', 'Infosys Cloud R&D', 'Red Hat', 'Oracle']
        },
        {
          role: 'Data Scientist & AI Applications Specialist',
          matchScore: hasPythonOrData ? 89 : 74,
          marketDemand: 'High Growth (7,200+ Campus Openings)',
          averageSalaryRange: '8.5 - 14.0 LPA',
          keyStrengths: ['Data querying capability', 'Algorithmic reasoning', 'Statistical mindset'],
          learningMilestones: ['Feature engineering with Pandas', 'Vector databases & embeddings integration'],
          bestFitCompanies: ['Microsoft India', 'Tiger Analytics', 'Fractal', 'Accenture AI']
        }
      ],
      aiAdvisorSummary: `Based on your profile in ${branch} and CGPA of ${cgpa}, you possess strong foundational problem-solving abilities. Focus your portfolio on 2 flagship full-stack deployments to maximize shortlist rates.`
    };
  },

  /**
   * Generate step-by-step career roadmap for target domain
   * @param {string} careerRole - Target role name
   * @returns {Promise<Object>} Structured stage-by-stage learning roadmap
   */
  async generateRoadmap(careerRole = 'Full-Stack Developer') {
    await delay(800);

    return {
      success: true,
      careerRole,
      estimatedTimeToReadiness: '12 - 16 Weeks (10 hrs/week)',
      recommendedCadence: '1 Stage every 4 weeks',
      stages: [
        {
          stageNumber: 1,
          phaseName: 'Core Fundamentals & Architecture',
          duration: 'Weeks 1 - 4',
          topics: ['Modern ECMAScript (ES6+)', 'Async Patterns & Promises', 'HTTP/2 & REST Design', 'Git Gitflow Workflow'],
          suggestedProject: 'Build a responsive SaaS dashboard with authentication and mock API data.',
          milestoneAssessment: 'Technical Quiz on Closures, Event Loop, and DOM Reconciliation.'
        },
        {
          stageNumber: 2,
          phaseName: 'Backend Mastery & Databases',
          duration: 'Weeks 5 - 8',
          topics: ['Express.js Middleware Pipelines', 'Mongoose Schema Validation & Indexing', 'JWT & Refresh Tokens', 'SQL Transactions & ACID'],
          suggestedProject: 'Develop a role-based multi-tenant REST API with rate-limiting and unit tests.',
          milestoneAssessment: 'Database Query Optimization & API Security Audit.'
        },
        {
          stageNumber: 3,
          phaseName: 'DevOps & Production Readiness',
          duration: 'Weeks 9 - 12',
          topics: ['Docker Multi-stage Builds', 'CI/CD with GitHub Actions', 'Cloud Deployment on Render & Vercel', 'Web Vitals Performance Tuning'],
          suggestedProject: 'Deploy a containerized end-to-end full-stack app with zero-downtime pipeline.',
          milestoneAssessment: 'Live Demo Presentation & Automated Load Testing.'
        }
      ]
    };
  },

  /**
   * Analyze student readiness against specific job description
   * @param {Array<string>} studentSkills - Current student skills
   * @param {Object} jobDescription - Target job posting details
   * @returns {Promise<Object>} Detailed gap analysis and actionable preparation strategy
   */
  async analyzeReadiness(studentSkills = [], jobDescription = {}) {
    await delay(800);

    const targetSkills = jobDescription.requiredSkills || ['React', 'Node.js', 'Express', 'MongoDB', 'REST API'];
    const lowerStudentSkills = studentSkills.map((s) => (typeof s === 'string' ? s : s.name).toLowerCase());

    const matched = [];
    const gaps = [];

    targetSkills.forEach((req) => {
      if (lowerStudentSkills.some((s) => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))) {
        matched.push(req);
      } else {
        gaps.push(req);
      }
    });

    const matchRatio = targetSkills.length > 0 ? matched.length / targetSkills.length : 0.8;
    const readinessScore = Math.round(matchRatio * 100);

    return {
      success: true,
      jobTitle: jobDescription.title || 'Target Job',
      company: jobDescription.company || 'Recruiter',
      readinessScore,
      matchedSkills: matched,
      missingSkills: gaps,
      verdict:
        readinessScore >= 80
          ? 'Strong Candidate Fit! Ready to Apply.'
          : readinessScore >= 60
          ? 'Moderate Fit. Shortlist probable with quick targeted preparation.'
          : 'High Skill Gap. Recommended to complete 2-3 missing skill modules before applying.',
      actionPlan: [
        `Prepare answers highlighting your proficiency in ${matched.slice(0, 3).join(', ')}.`,
        gaps.length > 0
          ? `Spend 4-6 hours reviewing core concepts of: ${gaps.slice(0, 3).join(', ')}.`
          : 'Review project architecture for technical interviews.',
        'Review company recent products and engineering blog.'
      ]
    };
  },

  /**
   * Intelligent rule-based Mentor Chatbot for career, resume, and interview prep questions
   * @param {string} question - Question submitted by the student
   * @returns {Promise<Object>} Contextual mentoring guidance
   */
  async answerMentorQuestion(question = '') {
    await delay(800);

    const q = question.toLowerCase();
    let answer = '';
    let relatedTopics = [];

    if (q.includes('resume') || q.includes('ats')) {
      answer =
        'To optimize your resume for campus placement ATS systems: (1) Use standard section headers (Education, Skills, Experience, Projects), (2) Quantify your project achievements using the formula: "Achieved [X] measured by [Y] by doing [Z]", (3) Keep styling clean and single-column, and (4) Avoid putting critical technical skills inside image graphics or non-standard tables.';
      relatedTopics = ['ATS Formatting', 'Action Verbs', 'Quantifying Impact'];
    } else if (q.includes('interview') || q.includes('hr') || q.includes('prepare')) {
      answer =
        'For technical and HR interviews, use the STAR technique (Situation, Task, Action, Result). For coding rounds: (1) Clarify inputs and edge cases before coding, (2) State your brute-force approach first, (3) Optimize time and space complexity, and (4) Dry-run your solution with sample test inputs.';
      relatedTopics = ['STAR Method', 'DSA Problem Solving', 'Behavioral Questions'];
    } else if (q.includes('salary') || q.includes('package') || q.includes('negotiat')) {
      answer =
        'In campus placement drives, base salary packages are generally standardized across tier categories. However, for off-campus and product company discussions, research standard compensation benchmarks on platforms like Glassdoor and AmbitionBox, and emphasize your hackathon wins, live projects, and specialized domain skills.';
      relatedTopics = ['Campus Offer Tiers', 'Standard CTC Breakdown', 'Offer Acceptance'];
    } else if (q.includes('project') || q.includes('portfolio') || q.includes('github')) {
      answer =
        'The strongest student portfolios have 2-3 end-to-end full-stack projects rather than 10 tutorial clones. Ensure every project has: (1) A clean, informative README with architecture diagrams, (2) A deployed live demo URL, (3) Authentication and persistent database records, and (4) Responsive mobile design.';
      relatedTopics = ['README Best Practices', 'Live Deployment', 'System Design'];
    } else {
      answer =
        `Great question regarding "${question}". In modern technical hiring, recruiters seek engineers with strong foundational CS concepts (Data Structures, Algorithms, DBMS, Operating Systems) combined with practical full-stack execution capability. Make sure you can articulate the architectural trade-offs you made in your projects.`;
      relatedTopics = ['Computer Science Fundamentals', 'System Architecture', 'Career Guidance'];
    }

    return {
      success: true,
      question,
      answer,
      mentor: 'PathPilot AI Career Mentor',
      relatedTopics,
      timestamp: new Date().toISOString()
    };
  }
};
