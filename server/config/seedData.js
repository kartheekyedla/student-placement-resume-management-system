// server/config/seedData.js
// Pre-populates the database with 20+ students, 5+ companies, 12+ jobs,
// mock interview question banks, placement drives, applications, and roadmaps as per SRS Appendix D.

const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');
const { StudentProfileModel } = require('../models/StudentProfile');
const { JobModel } = require('../models/Job');
const ApplicationModel = require('../models/Application');
const { ResumeModel } = require('../models/Resume');
const { RoadmapModel } = require('../models/Roadmap');
const { MockInterviewModel } = require('../models/MockInterview');
const DriveModel = require('../models/Drive');
const NotificationModel = require('../models/Notification');

const MOCK_QUESTIONS = {
  HR: [
    {
      id: 'hr_1',
      question: 'Tell me about yourself, your academic background, and your key technical interests.',
      expectedKeywords: ['computer science', 'b.tech', 'projects', 'passion', 'learning', 'strengths'],
      minWords: 30
    },
    {
      id: 'hr_2',
      question: 'Where do you see yourself in 3-5 years, and how does this role align with your ambitions?',
      expectedKeywords: ['growth', 'lead', 'architecture', 'impact', 'skills', 'mentorship'],
      minWords: 25
    },
    {
      id: 'hr_3',
      question: 'Describe a challenging situation in a team project and how you resolved the conflict.',
      expectedKeywords: ['conflict', 'communication', 'compromise', 'deadline', 'teamwork', 'resolution'],
      minWords: 30
    }
  ],
  JavaScript: [
    {
      id: 'js_1',
      question: 'Explain the Event Loop in Node.js / JavaScript and the difference between Microtasks and Macrotasks.',
      expectedKeywords: ['call stack', 'callback queue', 'microtask', 'promise', 'settimeout', 'event loop', 'asynchronous'],
      minWords: 30
    },
    {
      id: 'js_2',
      question: 'What are Closures in JavaScript and what is a practical use case for them?',
      expectedKeywords: ['lexical scope', 'outer function', 'encapsulation', 'private variables', 'memory'],
      minWords: 25
    },
    {
      id: 'js_3',
      question: 'Compare Promise.all, Promise.race, and Promise.allSettled with examples.',
      expectedKeywords: ['promise', 'reject', 'resolve', 'parallel', 'concurrent', 'iterable'],
      minWords: 25
    }
  ],
  'Web Development': [
    {
      id: 'web_1',
      question: 'What is the Virtual DOM in React and how does the reconciliation algorithm improve performance?',
      expectedKeywords: ['virtual dom', 'diffing', 'reconciliation', 'render', 'batching', 'fiber'],
      minWords: 25
    },
    {
      id: 'web_2',
      question: 'How do you secure REST APIs against common vulnerabilities like XSS, CSRF, and SQL Injection?',
      expectedKeywords: ['sanitization', 'cors', 'tokens', 'jwt', 'helmet', 'prepared statements', 'https'],
      minWords: 30
    }
  ],
  Java: [
    {
      id: 'java_1',
      question: 'Explain the internal working of HashMap in Java including hash collisions and red-black tree conversion.',
      expectedKeywords: ['hashcode', 'equals', 'bucket', 'linked list', 'red-black tree', 'threshold', 'load factor'],
      minWords: 30
    },
    {
      id: 'java_2',
      question: 'Differentiate between Checked and Unchecked exceptions and best practices for exception handling in Spring Boot.',
      expectedKeywords: ['runtimeexception', 'compile time', 'try-catch', 'controlleradvice', 'custom exceptions'],
      minWords: 25
    }
  ],
  Python: [
    {
      id: 'py_1',
      question: 'Explain Python Generators, the `yield` keyword, and memory efficiency compared to standard lists.',
      expectedKeywords: ['generator', 'yield', 'lazy evaluation', 'iteration', 'memory efficient', 'next'],
      minWords: 25
    },
    {
      id: 'py_2',
      question: 'What is the Global Interpreter Lock (GIL) in Python and how do you achieve true parallelism?',
      expectedKeywords: ['gil', 'multiprocessing', 'threads', 'cpython', 'concurrency', 'cpu bound'],
      minWords: 25
    }
  ],
  SQL: [
    {
      id: 'sql_1',
      question: 'Explain the difference between clustered and non-clustered indexes and how indexing affects query performance.',
      expectedKeywords: ['b-tree', 'clustered index', 'pointer', 'table scan', 'execution plan', 'primary key'],
      minWords: 25
    },
    {
      id: 'sql_2',
      question: 'Explain ACID properties in database transactions and how isolation levels prevent dirty reads.',
      expectedKeywords: ['atomicity', 'consistency', 'isolation', 'durability', 'commit', 'rollback', 'transaction'],
      minWords: 30
    }
  ],
  DBMS: [
    {
      id: 'dbms_1',
      question: 'Explain Normalization from 1NF to BCNF and why denormalization is sometimes practiced in read-heavy applications.',
      expectedKeywords: ['redundancy', 'anomaly', 'functional dependency', 'primary key', 'foreign key', 'performance'],
      minWords: 30
    }
  ],
  OOP: [
    {
      id: 'oop_1',
      question: 'Explain the SOLID principles with quick practical examples from software engineering.',
      expectedKeywords: ['single responsibility', 'open closed', 'liskov substitution', 'interface segregation', 'dependency inversion'],
      minWords: 35
    }
  ],
  DSA: [
    {
      id: 'dsa_1',
      question: 'How does Dijkstra algorithm work for finding shortest paths, and what is its time complexity using a min-heap?',
      expectedKeywords: ['greedy', 'min-heap', 'priority queue', 'relaxation', 'vertices', 'edges', 'o(e log v)'],
      minWords: 25
    }
  ],
  Project: [
    {
      id: 'proj_1',
      question: 'Explain the high-level architecture of your most impactful project, state management, and API design.',
      expectedKeywords: ['architecture', 'database', 'frontend', 'backend', 'api', 'state', 'scalability', 'challenges'],
      minWords: 35
    }
  ]
};

const SEED_ROADMAPS = [
  {
    roleId: 'fullstack-dev',
    roleTitle: 'Full-Stack Web Developer',
    description: 'Master modern frontend, scalable Node.js microservices, databases, and automated cloud deployments.',
    targetSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'REST API', 'Git', 'TypeScript'],
    stages: [
      {
        stageId: 'stage_1',
        title: 'Foundations & Frontend Architecture',
        order: 1,
        items: [
          { id: 'fs_1', name: 'HTML5 Semantic Layout & Responsive CSS Grid/Flexbox', category: 'Concept', status: 'Completed', learningResource: 'MDN Web Docs' },
          { id: 'fs_2', name: 'Modern JavaScript (ES6+, Promises, Async/Await, Closures)', category: 'Skill', status: 'Completed', learningResource: 'javascript.info' },
          { id: 'fs_3', name: 'React.js State Management, Hooks & Component Lifecycle', category: 'Tool', status: 'Completed', learningResource: 'React Official Docs' },
          { id: 'fs_4', name: 'Tailwind CSS & Component Library Integration', category: 'Tool', status: 'Learning', learningResource: 'Tailwind Docs' }
        ]
      },
      {
        stageId: 'stage_2',
        title: 'Backend Systems & API Engineering',
        order: 2,
        items: [
          { id: 'fs_5', name: 'Node.js Runtime & Express.js RESTful Routing', category: 'Skill', status: 'Learning', learningResource: 'Express Guides' },
          { id: 'fs_6', name: 'Database Design with MongoDB / Mongoose & PostgreSQL', category: 'Concept', status: 'Learning', learningResource: 'MongoDB University' },
          { id: 'fs_7', name: 'JWT Authentication, RBAC & API Security Headers', category: 'Concept', status: 'Completed', learningResource: 'OWASP Best Practices' }
        ]
      },
      {
        stageId: 'stage_3',
        title: 'DevOps, Testing & Capstone Deployment',
        order: 3,
        items: [
          { id: 'fs_8', name: 'Docker Containerization & Docker Compose for Multi-Services', category: 'Tool', status: 'Not Started', learningResource: 'Docker Docs' },
          { id: 'fs_9', name: 'CI/CD Pipelines with GitHub Actions', category: 'Tool', status: 'Not Started', learningResource: 'GitHub Actions Guide' },
          { id: 'fs_10', name: 'End-to-End SaaS Capstone Platform Deployment (Vercel / Render)', category: 'Project', status: 'Learning', learningResource: 'SmartHire Architecture' }
        ]
      }
    ]
  },
  {
    roleId: 'ai-ml-engineer',
    roleTitle: 'AI / Machine Learning Engineer',
    description: 'Build predictive machine learning models, neural networks, feature engineering pipelines, and LLM integrations.',
    targetSkills: ['Python', 'NumPy', 'Pandas', 'Scikit-Learn', 'PyTorch', 'FastAPI', 'MLOps', 'Vector Databases'],
    stages: [
      {
        stageId: 'stage_1',
        title: 'Mathematics & Data Foundations',
        order: 1,
        items: [
          { id: 'ml_1', name: 'Linear Algebra, Calculus & Probability for ML', category: 'Concept', status: 'Completed' },
          { id: 'ml_2', name: 'Python for Data Science (NumPy, Pandas, Vectorization)', category: 'Skill', status: 'Completed' },
          { id: 'ml_3', name: 'Exploratory Data Analysis & Feature Engineering', category: 'Concept', status: 'Learning' }
        ]
      },
      {
        stageId: 'stage_2',
        title: 'Machine Learning & Deep Learning',
        order: 2,
        items: [
          { id: 'ml_4', name: 'Supervised & Unsupervised Learning with Scikit-Learn', category: 'Skill', status: 'Learning' },
          { id: 'ml_5', name: 'Neural Networks & PyTorch Fundamentals', category: 'Tool', status: 'Not Started' },
          { id: 'ml_6', name: 'NLP & Transformers Architecture', category: 'Concept', status: 'Not Started' }
        ]
      },
      {
        stageId: 'stage_3',
        title: 'Production Deployment & MLOps',
        order: 3,
        items: [
          { id: 'ml_7', name: 'Serving Models with FastAPI & Docker', category: 'Tool', status: 'Not Started' },
          { id: 'ml_8', name: 'Model Monitoring & Vector Search with Pinecone / Chroma', category: 'Project', status: 'Not Started' }
        ]
      }
    ]
  }
];

const SEED_JOBS = [
  {
    _id: 'job_101',
    title: 'Associate Software Engineer - Frontend',
    company: 'Google Cloud Innovations',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=60',
    location: 'Bangalore, India',
    jobType: 'Full-Time',
    experienceLevel: 'Fresher',
    salary: { min: 900000, max: 1400000, currency: 'INR', period: 'Per Annum' },
    description: 'Join our Cloud Applications team to build next-generation responsive dashboards, high-scale UI platforms, and distributed developer tools.',
    responsibilities: [
      'Architect and build high-performance React user interfaces',
      'Collaborate with product designers to implement pixel-perfect web apps',
      'Optimize web vitals, state management, and frontend security'
    ],
    requirements: [
      'Strong grasp of JavaScript ES6+, HTML5, CSS3, and React.js',
      'Understanding of RESTful APIs, browser DOM rendering, and Git',
      'Familiarity with Tailwind CSS or modern CSS component systems'
    ],
    requiredSkills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML5', 'REST API', 'Git'],
    preferredSkills: ['TypeScript', 'Vite', 'Redux / Zustand'],
    eligibility: {
      minCgpa: 7.5,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'AI & Data Science'],
      maxBacklogs: 0,
      degree: 'B.Tech / B.E'
    },
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
    status: 'Active',
    isApproved: true,
    applicantsCount: 14
  },
  {
    _id: 'job_102',
    title: 'Full-Stack Developer (MERN)',
    company: 'Razorpay Technologies',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    location: 'Bangalore / Remote',
    jobType: 'Full-Time',
    experienceLevel: 'Fresher',
    salary: { min: 800000, max: 1300000, currency: 'INR', period: 'Per Annum' },
    description: 'Looking for enthusiastic engineers to build robust payment orchestration systems, merchant portals, and developer-friendly APIs.',
    responsibilities: [
      'Design RESTful microservices using Node.js and Express',
      'Develop dynamic React frontend interfaces with responsive charts',
      'Manage MongoDB schemas, indexing, and transactional integrity'
    ],
    requirements: [
      'Hands-on experience in MERN stack (MongoDB, Express, React, Node)',
      'Solid understanding of async programming and JWT authentication',
      'Good problem-solving abilities and algorithmic thinking'
    ],
    requiredSkills: ['Node.js', 'Express', 'React', 'MongoDB', 'JavaScript', 'REST API'],
    preferredSkills: ['Docker', 'AWS', 'Redis'],
    eligibility: {
      minCgpa: 7.0,
      allowedBranches: ['Computer Science & Engineering', 'Electronics & Communication', 'Information Technology'],
      maxBacklogs: 0,
      degree: 'B.Tech / B.E / MCA'
    },
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
    status: 'Active',
    isApproved: true,
    applicantsCount: 22
  },
  {
    _id: 'job_103',
    title: 'Junior Cloud & DevOps Engineer',
    company: 'Amazon Web Services (AWS)',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=60',
    location: 'Hyderabad, India',
    jobType: 'Full-Time',
    experienceLevel: 'Fresher',
    salary: { min: 1100000, max: 1600000, currency: 'INR', period: 'Per Annum' },
    description: 'Help build and maintain secure cloud infrastructure, automated CI/CD pipelines, container orchestration, and server monitoring.',
    responsibilities: [
      'Automate builds, deployments, and tests via CI/CD pipelines',
      'Provision cloud infrastructure with Terraform or CloudFormation',
      'Configure Docker containers and monitoring metrics'
    ],
    requirements: [
      'Foundational understanding of Linux commands, shell scripting, and networking',
      'Knowledge of Docker container lifecycle',
      'Basic experience with AWS (EC2, S3, IAM) or Azure'
    ],
    requiredSkills: ['Linux', 'Docker', 'AWS', 'Git', 'Python', 'Networking'],
    preferredSkills: ['Kubernetes', 'Terraform', 'CI/CD'],
    eligibility: {
      minCgpa: 8.0,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
      maxBacklogs: 0,
      degree: 'B.Tech'
    },
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    status: 'Active',
    isApproved: true,
    applicantsCount: 19
  },
  {
    _id: 'job_104',
    title: 'Data Analyst & BI Engineer',
    company: 'Microsoft India',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=60',
    location: 'Hyderabad, India',
    jobType: 'Full-Time',
    experienceLevel: 'Fresher',
    salary: { min: 850000, max: 1250000, currency: 'INR', period: 'Per Annum' },
    description: 'Transform complex business datasets into intuitive dashboards, predictive models, and strategic executive reports.',
    responsibilities: [
      'Write advanced SQL queries, joins, window functions, and views',
      'Create interactive data visualizations with Power BI / Tableau',
      'Perform exploratory data analysis using Python and Pandas'
    ],
    requirements: [
      'Proficiency in SQL and relational database structures',
      'Experience in Python data science libraries (Pandas, NumPy)',
      'Strong analytical and statistical thinking'
    ],
    requiredSkills: ['SQL', 'Python', 'Pandas', 'Power BI', 'Excel', 'Data Analysis'],
    preferredSkills: ['Machine Learning', 'BigQuery', 'Tableau'],
    eligibility: {
      minCgpa: 7.0,
      allowedBranches: ['Computer Science & Engineering', 'Data Science', 'Information Technology', 'ECE'],
      maxBacklogs: 0,
      degree: 'B.Tech / MCA'
    },
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    status: 'Active',
    isApproved: true,
    applicantsCount: 16
  },
  {
    _id: 'job_105',
    title: 'Backend Systems Engineer - Java / Spring',
    company: 'Infosys FinTech R&D',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60',
    location: 'Pune / Chennai',
    jobType: 'Full-Time',
    experienceLevel: 'Fresher',
    salary: { min: 650000, max: 950000, currency: 'INR', period: 'Per Annum' },
    description: 'Engineers focused on banking microservices, transaction processing, security policies, and high-throughput databases.',
    responsibilities: [
      'Develop microservices using Java 17 and Spring Boot',
      'Implement database transactions with Hibernate and PostgreSQL',
      'Write unit tests using JUnit and Mockito'
    ],
    requirements: [
      'Solid command over Core Java, OOP principles, and Collections',
      'Understanding of Spring Boot and REST API patterns',
      'Relational database querying and ACID concepts'
    ],
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'OOP', 'Git', 'REST API'],
    preferredSkills: ['Kafka', 'Microservices', 'Docker'],
    eligibility: {
      minCgpa: 6.5,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
      maxBacklogs: 1,
      degree: 'B.Tech / MCA'
    },
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    status: 'Active',
    isApproved: true,
    applicantsCount: 31
  }
];

const SEED_DRIVES = [
  {
    _id: 'drive_201',
    title: 'Campus Mega Recruitment Drive 2026',
    companyName: 'Infosys & Tech Partners',
    companyLogo: '',
    roleOffered: 'Systems Engineer & Digital Specialist',
    packageDetails: '6.5 - 9.5 LPA',
    description: 'Annual campus drive for batch 2026 across CSE, IT, and ECE disciplines with pre-placement talks and code challenges.',
    eligibilityCriteria: {
      minCgpa: 7.0,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
      requiredSkills: ['Java', 'Python', 'SQL', 'Data Structures'],
      maxBacklogs: 0,
      batchYear: 2026
    },
    driveDate: '2026-10-15',
    venue: 'Campus Placement Auditorium & Online Portal',
    deadline: '2026-10-10',
    status: 'Upcoming',
    eligibleCount: 18,
    registeredStudents: []
  },
  {
    _id: 'drive_202',
    title: 'Cloud & FinTech Elite Hiring Drive',
    companyName: 'Razorpay Technologies',
    companyLogo: '',
    roleOffered: 'Full-Stack Software Engineer',
    packageDetails: '12.0 - 15.0 LPA',
    description: 'High-package drive targeted at top coding performers, open-source contributors, and Hackathon finalists.',
    eligibilityCriteria: {
      minCgpa: 8.0,
      allowedBranches: ['Computer Science & Engineering', 'AI & Data Science'],
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'DSA'],
      maxBacklogs: 0,
      batchYear: 2026
    },
    driveDate: '2026-10-22',
    venue: 'Innovation Center Lab 4',
    deadline: '2026-10-18',
    status: 'Upcoming',
    eligibleCount: 12,
    registeredStudents: []
  }
];

// Helper to seed 20+ students and all required entities
async function seedInitialDatabase(options = {}) {
  const { force = false } = options;

  if (force) {
    console.log('[MongoDB Sample Data] Clearing existing collections for fresh seed...');
    await Promise.all([
      UserModel.deleteMany({}),
      StudentProfileModel.deleteMany({}),
      JobModel.deleteMany({}),
      ApplicationModel.deleteMany({}),
      ResumeModel.deleteMany({}),
      RoadmapModel.deleteMany({}),
      MockInterviewModel.deleteMany({}),
      DriveModel.deleteMany({}),
      NotificationModel.deleteMany({})
    ]);
  } else {
    const existingUsers = await UserModel.countDocuments();
    if (existingUsers > 0) {
      console.log(`[MongoDB Data Check] Database already populated with ${existingUsers} users. Skipping auto-seeding.`);
      return;
    }
  }

  console.log('[MongoDB Sample Data] Populating MongoDB Atlas with 20+ Students, 5+ Companies, Jobs, Drives, and Mock Questions...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Core Role Accounts
  const coreAccounts = [
    {
      _id: 'user_student_1',
      name: 'Aditya Sharma',
      email: 'student@smarthire.edu',
      password: passwordHash,
      role: 'student',
      department: 'Computer Science & Engineering',
      phone: '+91 98765 43210'
    },
    {
      _id: 'user_recruiter_1',
      name: 'Priya Mehta',
      email: 'recruiter@smarthire.edu',
      password: passwordHash,
      role: 'recruiter',
      companyName: 'Razorpay Technologies',
      phone: '+91 98223 11223'
    },
    {
      _id: 'user_officer_1',
      name: 'Dr. Ramesh Kumar',
      email: 'officer@smarthire.edu',
      password: passwordHash,
      role: 'officer',
      department: 'Head of Training & Placement',
      phone: '+91 94455 66778'
    },
    {
      _id: 'user_admin_1',
      name: 'System Administrator',
      email: 'admin@smarthire.edu',
      password: passwordHash,
      role: 'admin',
      department: 'Campus IT Operations',
      phone: '+91 99000 88776'
    }
  ];

  // 2. Generate 20+ Diverse Students
  const firstNames = ['Aarav', 'Neha', 'Rohan', 'Sneha', 'Vikram', 'Ananya', 'Karthik', 'Pooja', 'Rahul', 'Divya', 'Siddharth', 'Meera', 'Arjun', 'Isha', 'Varun', 'Tanvi', 'Rishi', 'Shruti', 'Harsh', 'Lavanya', 'Manish'];
  const lastNames = ['Patel', 'Reddy', 'Verma', 'Nair', 'Iyer', 'Gupta', 'Singh', 'Deshmukh', 'Chopra', 'Rao', 'Bose', 'Mishra', 'Joshi', 'Kulkarni', 'Bhat', 'Kapoor', 'Menon', 'Das', 'Saxena', 'Pillai', 'Shetty'];
  const branches = ['Computer Science & Engineering', 'Information Technology', 'AI & Data Science', 'Electronics & Communication'];

  const studentUsers = [];
  const studentProfiles = [];

  // Primary student profile
  studentProfiles.push({
    userId: 'user_student_1',
    personal: {
      fullName: 'Aditya Sharma',
      email: 'student@smarthire.edu',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      bio: 'Enthusiastic final-year Computer Science undergraduate passionate about building scalable full-stack web applications and AI-assisted tooling.',
      linkedin: 'https://linkedin.com/in/aditya-sharma-dev',
      github: 'https://github.com/aditya-sharma',
      portfolio: 'https://aditya-portfolio.dev'
    },
    academic: {
      college: 'Institute of Engineering & Technology',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2026,
      cgpa: 8.85,
      backlogs: 0
    },
    skills: [
      { name: 'React', category: 'Technical', level: 'Advanced' },
      { name: 'JavaScript', category: 'Technical', level: 'Advanced' },
      { name: 'Node.js', category: 'Technical', level: 'Intermediate' },
      { name: 'Express', category: 'Technical', level: 'Intermediate' },
      { name: 'MongoDB', category: 'Technical', level: 'Intermediate' },
      { name: 'Tailwind CSS', category: 'Technical', level: 'Advanced' },
      { name: 'REST API', category: 'Technical', level: 'Advanced' },
      { name: 'Git', category: 'Tools', level: 'Advanced' },
      { name: 'Docker', category: 'Tools', level: 'Beginner' }
    ],
    experience: [
      {
        title: 'Full-Stack Developer Intern',
        company: 'Innovatech Solutions',
        location: 'Bangalore',
        startDate: 'June 2025',
        endDate: 'August 2025',
        current: false,
        description: 'Built high-throughput REST APIs and interactive dashboards with React and Node.js. Reduced page loading times by 35% using code splitting and lazy loading.'
      }
    ],
    projects: [
      {
        title: 'SmartHire Placement & Resume Management Portal',
        description: 'End-to-end placement portal with rule-based ATS resume scoring, explainable job matching algorithm, and 7-stage candidate tracking.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        githubUrl: 'https://github.com/aditya-sharma/smarthire',
        demoUrl: 'https://smarthire.vercel.app',
        role: 'Lead Full-Stack Architect',
        duration: '3 Months'
      },
      {
        title: 'Distributed Real-Time Code Execution Engine',
        description: 'Dockerized microservice cluster executing untrusted user Python & C++ submissions in isolated sandboxes with memory limits.',
        technologies: ['Node.js', 'Docker', 'Redis', 'WebSockets'],
        githubUrl: 'https://github.com/aditya-sharma/code-sandbox',
        demoUrl: 'https://sandbox.aditya.dev',
        role: 'Backend Developer',
        duration: '2 Months'
      }
    ],
    certifications: [
      {
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        issueDate: '2025',
        credentialUrl: 'https://aws.amazon.com'
      },
      {
        title: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Meta / Coursera',
        issueDate: '2024',
        credentialUrl: 'https://coursera.org'
      }
    ],
    achievements: [
      { title: 'Winner, National Smart India Hackathon', description: 'Ranked 1st among 250 teams for developing an automated civic grievance tracker.', date: '2025' },
      { title: 'Solved 450+ LeetCode problems', description: 'Top 10% in Weekly Global Contests with 1850 rating.', date: '2025' }
    ],
    languages: [
      { name: 'English', proficiency: 'Fluent' },
      { name: 'Hindi', proficiency: 'Native' },
      { name: 'Telugu', proficiency: 'Conversational' }
    ],
    preferences: {
      targetRoles: ['Full-Stack Developer', 'Frontend Engineer', 'Software Engineer'],
      preferredLocations: ['Bangalore', 'Hyderabad', 'Remote'],
      expectedSalaryMin: 800000
    },
    savedJobs: ['job_101', 'job_102'],
    profileCompletion: 100,
    placementReadiness: {
      score: 88,
      breakdown: {
        profileScore: 15,
        resumeScore: 18,
        skillsScore: 14,
        projectsScore: 15,
        certsScore: 10,
        interviewScore: 14,
        roadmapScore: 9
      },
      recommendations: [
        'Practice 1 more Mock Interview in System Design / DSA.',
        'Advance Docker & Kubernetes roadmap module to Completed status.'
      ]
    }
  });

  // Additional 20 students
  for (let i = 0; i < 20; i++) {
    const sId = `user_student_${i + 2}`;
    const fname = firstNames[i % firstNames.length];
    const lname = lastNames[i % lastNames.length];
    const fullName = `${fname} ${lname}`;
    const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i + 1}@smarthire.edu`;
    const branch = branches[i % branches.length];
    const cgpa = Number((7.0 + (i * 0.13) % 2.8).toFixed(2));

    studentUsers.push({
      _id: sId,
      name: fullName,
      email: email,
      password: passwordHash,
      role: 'student',
      department: branch,
      phone: `+91 98${10000000 + i * 2345}`.slice(0, 15)
    });

    studentProfiles.push({
      userId: sId,
      personal: {
        fullName,
        email,
        phone: `+91 98${10000000 + i * 2345}`.slice(0, 15),
        location: i % 2 === 0 ? 'Bangalore, India' : 'Hyderabad, India',
        bio: `Undergraduate in ${branch} eager to join innovative software engineering teams.`,
        linkedin: `https://linkedin.com/in/${fname.toLowerCase()}-${lname.toLowerCase()}`,
        github: `https://github.com/${fname.toLowerCase()}`
      },
      academic: {
        college: 'Institute of Engineering & Technology',
        degree: 'B.Tech',
        branch,
        graduationYear: 2026,
        cgpa,
        backlogs: i % 7 === 0 ? 1 : 0
      },
      skills: [
        { name: 'JavaScript', category: 'Technical', level: 'Intermediate' },
        { name: i % 2 === 0 ? 'React' : 'Java', category: 'Technical', level: 'Intermediate' },
        { name: i % 3 === 0 ? 'Node.js' : 'Python', category: 'Technical', level: 'Intermediate' },
        { name: 'SQL', category: 'Technical', level: 'Intermediate' },
        { name: 'Git', category: 'Tools', level: 'Intermediate' }
      ],
      experience: [
        {
          title: 'Software Trainee Intern',
          company: 'TechCorp Labs',
          location: 'Hyderabad',
          startDate: 'May 2025',
          endDate: 'July 2025',
          description: 'Contributed to bug fixes, API endpoint optimizations, and test case authoring.'
        }
      ],
      projects: [
        {
          title: `${fname}'s Cloud Analytics Platform`,
          description: 'Web dashboard analyzing dataset distributions with real-time charting and export capabilities.',
          technologies: ['React', 'Python', 'SQL'],
          githubUrl: `https://github.com/${fname.toLowerCase()}/analytics`,
          role: 'Developer',
          duration: '2 Months'
        }
      ],
      certifications: [
        { title: 'Database Foundations', issuer: 'Oracle', issueDate: '2024' }
      ],
      achievements: [
        { title: 'College Coding Marathon Finalist', description: 'Ranked top 15 in University level hackathon.', date: '2024' }
      ],
      languages: [{ name: 'English', proficiency: 'Fluent' }],
      preferences: {
        targetRoles: ['Software Engineer', 'Full-Stack Developer'],
        preferredLocations: ['Bangalore', 'Hyderabad'],
        expectedSalaryMin: 650000
      },
      savedJobs: [],
      profileCompletion: 85 + (i % 3) * 5,
      placementReadiness: {
        score: Math.min(95, 65 + (i % 7) * 4),
        breakdown: {
          profileScore: 13,
          resumeScore: 15,
          skillsScore: 11,
          projectsScore: 12,
          certsScore: 6,
          interviewScore: 11,
          roadmapScore: 7
        },
        recommendations: ['Complete more mock interviews', 'Add another project to portfolio']
      }
    });
  }

  // Insert Users & Profiles
  await UserModel.insertMany([...coreAccounts, ...studentUsers]);
  await StudentProfileModel.insertMany(studentProfiles);

  // 3. Insert Jobs
  await JobModel.insertMany(SEED_JOBS);

  // 4. Insert Primary Student Resume
  await ResumeModel.create({
    studentId: 'user_student_1',
    title: 'Aditya Sharma - Software Engineer Resume',
    template: 'Software Developer',
    resumeData: {
      personalInfo: studentProfiles[0].personal,
      summary: studentProfiles[0].personal.bio,
      education: [
        {
          institution: studentProfiles[0].academic.college,
          degree: 'B.Tech in Computer Science',
          fieldOfStudy: 'Computer Science & Engineering',
          startYear: '2022',
          endYear: '2026',
          scoreOrCgpa: '8.85 CGPA'
        }
      ],
      experience: studentProfiles[0].experience,
      projects: studentProfiles[0].projects,
      skills: {
        technical: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST API', 'Data Structures'],
        softSkills: ['Team Leadership', 'Clear Technical Communication', 'Agile Mindset'],
        tools: ['Git', 'GitHub', 'Docker', 'Postman', 'VS Code', 'Vite']
      },
      certifications: studentProfiles[0].certifications,
      achievements: studentProfiles[0].achievements.map(a => `${a.title} - ${a.description}`),
      languages: ['English (Fluent)', 'Hindi (Native)', 'Telugu (Conversational)'],
      hobbies: ['Competitive Programming', 'Open Source Contributing', 'Chess']
    },
    overallScore: 92,
    scoreBreakdown: {
      skillsScore: 25,
      projectsScore: 25,
      educationScore: 15,
      keywordsScore: 13,
      completenessScore: 20
    },
    missingKeywords: ['TypeScript', 'GraphQL'],
    suggestions: [
      'Highlight concrete performance numbers (e.g. % speedup) in project summaries.',
      'Add cloud infrastructure deployment details (Docker, AWS) to showcase production readiness.'
    ]
  });

  // 5. Insert Applications with 7-Stage Status Timeline
  const seedApplications = [
    {
      studentId: 'user_student_1',
      studentName: 'Aditya Sharma',
      studentEmail: 'student@smarthire.edu',
      studentBranch: 'Computer Science & Engineering',
      studentCgpa: 8.85,
      jobId: 'job_101',
      jobTitle: 'Associate Software Engineer - Frontend',
      companyName: 'Google Cloud Innovations',
      status: 'Shortlisted',
      statusHistory: [
        { status: 'Applied', note: 'Application submitted successfully via SmartHire portal.', changedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), changedBy: 'Aditya Sharma' },
        { status: 'Under Review', note: 'Recruiter evaluated profile and verified CGPA eligibility.', changedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), changedBy: 'Priya Mehta' },
        { status: 'Shortlisted', note: 'Passed initial resume screening with 94% job match score.', changedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), changedBy: 'Priya Mehta' }
      ],
      matchScore: 94,
      interview: {
        scheduledDate: '2026-10-08',
        scheduledTime: '11:00 AM IST',
        interviewType: 'Technical Interview',
        locationOrLink: 'https://meet.google.com/smarthire-interview-aditya',
        notes: 'Round 1: React architecture, DOM internals, and live coding challenge.',
        isReminderSent: true
      }
    },
    {
      studentId: 'user_student_1',
      studentName: 'Aditya Sharma',
      studentEmail: 'student@smarthire.edu',
      studentBranch: 'Computer Science & Engineering',
      studentCgpa: 8.85,
      jobId: 'job_102',
      jobTitle: 'Full-Stack Developer (MERN)',
      companyName: 'Razorpay Technologies',
      status: 'Assessment Scheduled',
      statusHistory: [
        { status: 'Applied', note: 'Applied on SmartHire.', changedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), changedBy: 'Aditya Sharma' },
        { status: 'Under Review', note: 'Profile matched core criteria.', changedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), changedBy: 'Priya Mehta' },
        { status: 'Shortlisted', note: 'High match rating in MERN stack competencies.', changedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), changedBy: 'Priya Mehta' },
        { status: 'Assessment Scheduled', note: 'Coding assessment link issued to candidate email.', changedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), changedBy: 'Razorpay Recruitment' }
      ],
      matchScore: 91,
      interview: {
        scheduledDate: '2026-10-05',
        scheduledTime: '02:30 PM IST',
        interviewType: 'Online Coding Assessment',
        locationOrLink: 'https://assessment.razorpay.com/code-test/9284',
        notes: '90-minute assessment covering REST API engineering, data structures, and debugging.',
        isReminderSent: false
      }
    }
  ];

  await ApplicationModel.insertMany(seedApplications);

  // 6. Insert Roadmaps
  for (const rm of SEED_ROADMAPS) {
    await RoadmapModel.create({
      studentId: 'user_student_1',
      roleId: rm.roleId,
      roleTitle: rm.roleTitle,
      description: rm.description,
      targetSkills: rm.targetSkills,
      stages: rm.stages,
      overallProgress: rm.roleId === 'fullstack-dev' ? 65 : 25
    });
  }

  // 7. Insert Mock Interview records
  await MockInterviewModel.create({
    studentId: 'user_student_1',
    category: 'JavaScript',
    title: 'Advanced JavaScript & Async Systems Interview',
    answers: [
      {
        questionId: 'js_1',
        questionText: 'Explain the Event Loop in Node.js / JavaScript and the difference between Microtasks and Macrotasks.',
        expectedKeywords: ['call stack', 'callback queue', 'microtask', 'promise', 'settimeout', 'event loop', 'asynchronous'],
        studentAnswer: 'The JavaScript event loop constantly monitors the call stack and message queues. Synchronous code executes first on the call stack. When promises resolve, microtasks are placed into the microtask queue, which has higher priority than macrotasks like setTimeout. The event loop exhausts all microtasks before picking the next macrotask.',
        score: 95,
        matchedKeywords: ['call stack', 'microtask', 'promise', 'settimeout', 'event loop'],
        missingKeywords: ['asynchronous'],
        feedback: 'Superb explanation of priority between microtasks and macrotasks.',
        lengthWordCount: 52
      }
    ],
    totalQuestions: 3,
    answeredCount: 3,
    averageScore: 89,
    topicCoverage: 90,
    improvementAreas: ['Brush up on Web Worker concurrency and SharedArrayBuffers.'],
    status: 'Completed'
  });

  // 8. Insert Placement Drives
  await DriveModel.insertMany(SEED_DRIVES);

  // 9. Insert Notifications
  const seedNotifications = [
    {
      userId: 'user_student_1',
      title: 'Interview Scheduled: Google Cloud Innovations',
      message: 'Your Round 1 Technical Interview has been scheduled for October 8, 2026 at 11:00 AM IST.',
      type: 'interview',
      link: '/applications',
      isRead: false
    },
    {
      userId: 'user_student_1',
      title: 'Application Shortlisted by Razorpay Technologies',
      message: 'Congratulations! Your profile has been shortlisted for Full-Stack Developer (MERN).',
      type: 'application',
      link: '/applications',
      isRead: false
    },
    {
      userId: 'user_student_1',
      title: 'New Campus Drive Announced: Infosys & Tech Partners',
      message: 'Mega recruitment drive for 2026 batch is now open for registration.',
      type: 'drive',
      link: '/drives',
      isRead: true
    },
    {
      userId: 'user_student_1',
      title: 'Resume ATS Analysis Complete',
      message: 'Your Software Developer resume scored 92/100. Review keyword recommendations to optimize further.',
      type: 'resume',
      link: '/feature1',
      isRead: true
    }
  ];

  await NotificationModel.insertMany(seedNotifications);

  console.log('[MongoDB Sample Data] Seeding complete! MongoDB Atlas is now populated with rich sample data.');
}

module.exports = {
  seedInitialDatabase,
  MOCK_QUESTIONS,
  SEED_ROADMAPS,
  SEED_JOBS,
  SEED_DRIVES
};
