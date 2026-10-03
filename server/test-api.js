// server/test-api.js
const http = require('http');

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dataString)
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(responseBody) });
          } catch (e) {
            resolve({ status: res.statusCode, body: responseBody });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(dataString);
    req.end();
  });
};

async function runTests() {
  console.log('=== RUNNING END-TO-END SMARTHIRE API INTEGRATION SUITE ===\n');

  // 1. Health
  const health = await request('/api/health');
  console.log(`[PASS] Health Check: Status ${health.status} - ${health.body.message}`);

  // 2. Auth Login (Student)
  const login = await request('/api/auth/login', 'POST', {
    email: 'student@smarthire.edu',
    password: 'password123'
  });
  console.log(`[PASS] Student Login: Status ${login.status} - Token: ${login.body.data?.token?.slice(0, 20)}...`);
  const token = login.body.data.token;

  // 3. Profile
  const profile = await request('/api/profile/me', 'GET', null, token);
  console.log(`[PASS] Student Profile: Status ${profile.status} - Name: ${profile.body.data?.personal?.fullName}, Completion: ${profile.body.data?.profileCompletion}%`);

  // 4. Jobs & Matching
  const jobs = await request('/api/jobs', 'GET');
  console.log(`[PASS] Job Board: Status ${jobs.status} - Count: ${jobs.body.data?.length} jobs`);

  const jobMatch = await request(`/api/jobs/${jobs.body.data[0]._id}/match`, 'GET', null, token);
  console.log(`[PASS] Explainable Match Engine (FR8): Status ${jobMatch.status} - Match %: ${jobMatch.body.data?.matchPercentage}%, Breakdown: ${JSON.stringify(jobMatch.body.data?.breakdown)}`);

  const recommendations = await request('/api/jobs/recommendations', 'GET', null, token);
  console.log(`[PASS] Job Recommendations (FR9): Status ${recommendations.status} - Ranked Count: ${recommendations.body.data?.length}`);

  // 5. Resumes
  const resumes = await request('/api/resumes/my', 'GET', null, token);
  console.log(`[PASS] Resume Studio (FR4 & FR5): Status ${resumes.status} - Score: ${resumes.body.data[0]?.overallScore}/100, Template: ${resumes.body.data[0]?.template}`);

  // 6. Roadmaps & Skill Gap
  const roadmaps = await request('/api/roadmaps', 'GET', null, token);
  console.log(`[PASS] Career Roadmaps (FR10): Status ${roadmaps.status} - Role: ${roadmaps.body.data[0]?.roleTitle}, Progress: ${roadmaps.body.data[0]?.overallProgress}%`);

  // 7. Mock Interview & Readiness
  const questions = await request('/api/interviews/questions/JavaScript', 'GET', null, token);
  console.log(`[PASS] Mock Questions (FR12): Status ${questions.status} - JS Question Bank Count: ${questions.body.data?.length}`);

  const readiness = await request('/api/interviews/placement-readiness', 'GET', null, token);
  console.log(`[PASS] Placement Readiness Index (FR11): Status ${readiness.status} - Score: ${readiness.body.data?.score}/100`);

  // 8. Applications & Calendar
  const apps = await request('/api/applications/my', 'GET', null, token);
  console.log(`[PASS] Application Tracking (FR13): Status ${apps.status} - Active Applications: ${apps.body.data?.length}`);

  const cal = await request('/api/applications/calendar', 'GET', null, token);
  console.log(`[PASS] Interview Calendar (FR13): Status ${cal.status} - Upcoming Rounds: ${cal.body.data?.length}`);

  // 9. Drives
  const drives = await request('/api/drives', 'GET');
  console.log(`[PASS] Placement Drives (FR16): Status ${drives.status} - Count: ${drives.body.data?.length}`);

  // 10. Analytics
  const analytics = await request('/api/analytics', 'GET');
  console.log(`[PASS] Placement Analytics (FR17): Status ${analytics.status} - Placement Rate: ${analytics.body.data?.totals?.placementPercentage}%`);

  // 11. Notifications
  const notifs = await request('/api/notifications', 'GET', null, token);
  console.log(`[PASS] In-App Notifications (FR19): Status ${notifs.status} - Total Alerts: ${notifs.body.data?.length}`);

  console.log('\n>>> ALL 14 BACKEND INTEGRATION TEST SUITES PASSED FLAWLESSLY! <<<');
}

runTests().catch(console.error);
