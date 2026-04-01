export const interviewQuestions = [
  {
    id: 1,
    category: "Data Structures & Algorithms",
    color: "#7C3AED",
    bg: "#F5F3FF",
    questions: [
      {
        q: "What is the time complexity of binary search?",
        a: "O(log n) — Binary search halves the search space at each step.",
        difficulty: "Easy",
      },
      {
        q: "Explain the difference between BFS and DFS.",
        a: "BFS uses a queue and explores level by level. DFS uses a stack (or recursion) and goes deep first.",
        difficulty: "Medium",
      },
      {
        q: "How does a hash map handle collisions?",
        a: "Common techniques: chaining (linked list at each bucket) or open addressing (linear/quadratic probing).",
        difficulty: "Medium",
      },
      {
        q: "What is dynamic programming? Give an example.",
        a: "DP breaks problems into overlapping subproblems and stores results. Example: Fibonacci, Knapsack problem.",
        difficulty: "Hard",
      },
    ],
  },
  {
    id: 2,
    category: "System Design",
    color: "#0369A1",
    bg: "#E0F2FE",
    questions: [
      {
        q: "How would you design a URL shortener like bit.ly?",
        a: "Use base62 encoding, a key-value store (Redis/DynamoDB), load balancer, CDN for reads, and analytics pipeline.",
        difficulty: "Medium",
      },
      {
        q: "What is the CAP theorem?",
        a: "A distributed system can only guarantee 2 of 3: Consistency, Availability, Partition Tolerance.",
        difficulty: "Hard",
      },
      {
        q: "Explain horizontal vs vertical scaling.",
        a: "Vertical: bigger machine. Horizontal: more machines. Horizontal is preferred for high availability.",
        difficulty: "Easy",
      },
    ],
  },
  {
    id: 3,
    category: "Behavioral",
    color: "#B45309",
    bg: "#FFFBEB",
    questions: [
      {
        q: "Tell me about a time you resolved a conflict in your team.",
        a: "Use STAR method: Situation, Task, Action, Result. Focus on communication and empathy.",
        difficulty: "Medium",
      },
      {
        q: "How do you handle tight deadlines?",
        a: "Prioritize tasks, communicate blockers early, use time-boxing and focus sprints.",
        difficulty: "Easy",
      },
      {
        q: "Describe a project where you showed leadership.",
        a: "STAR method — highlight initiative, decision-making, and measurable outcomes.",
        difficulty: "Medium",
      },
    ],
  },
  {
    id: 4,
    category: "React / Frontend",
    color: "#0891B2",
    bg: "#ECFEFF",
    questions: [
      {
        q: "What is the Virtual DOM and how does React use it?",
        a: "React maintains a lightweight virtual tree, diffs it against the real DOM, and applies minimal updates (reconciliation).",
        difficulty: "Medium",
      },
      {
        q: "Explain React hooks: useState, useEffect, and useMemo.",
        a: "useState manages local state, useEffect handles side effects, useMemo memoizes expensive computations.",
        difficulty: "Medium",
      },
      {
        q: "What is code splitting and why is it important?",
        a: "Splitting bundles using React.lazy / dynamic import to reduce initial load time.",
        difficulty: "Hard",
      },
    ],
  },
];

export const tips = [
  { icon: "📄", title: "One Page Rule", tip: "Keep your resume to one page unless you have 10+ years of experience." },
  { icon: "🎯", title: "Tailor for Each Job", tip: "Customize your resume keywords to match each job description." },
  { icon: "📊", title: "Quantify Achievements", tip: "Use numbers: 'Improved API response time by 40%' beats 'improved performance'." },
  { icon: "🔗", title: "LinkedIn & GitHub", tip: "Always include links to your LinkedIn and GitHub profile with active contributions." },
  { icon: "📝", title: "Action Verbs", tip: "Start bullets with strong verbs: Built, Designed, Led, Optimized, Reduced, Achieved." },
  { icon: "🧹", title: "Clean Formatting", tip: "Use consistent fonts, proper spacing, and a clean ATS-friendly layout." },
  { icon: "🏆", title: "Projects Section", tip: "Add 2-3 strong personal/open-source projects that demonstrate your top skills." },
  { icon: "⚡", title: "ATS Optimization", tip: "Use standard section headers. Avoid graphics, tables, and headers/footers in PDF." },
];
