// Central source of truth for the routine + roadmap content.
// Edit this file to change the plan — the app reads everything from here.

export const WEEKDAY_TASKS = [
  { id: 'wake', time: '5:00 – 6:00 AM', title: 'Wake up & prepare', detail: 'Fresh breakfast, get ready, head to college.' },
  { id: 'college', time: '6:00 – 10:00 AM', title: 'College time', detail: '100% focus in class — listen, understand, learn.' },
  { id: 'golden', time: '10:00 AM – 7:30 PM', title: 'Golden Hours (job + coding)', detail: '~2 hrs of free time inside job hours — Java, DSA, LeetCode/HackerRank, English reading.', highlight: true },
  { id: 'room', time: '7:30 – 8:30 PM', title: 'Back to room', detail: 'Freshen up, cook & eat.' },
  { id: 'study', time: '8:30 – 10:00 PM', title: 'University study', detail: 'Statistics, Discrete Math, Computer Architecture.' },
  { id: 'writing', time: '10:00 – 10:30 PM', title: 'English & writing', detail: 'Diary in English + a tech podcast.' },
  { id: 'sleep', time: '10:30 PM', title: 'Sleep', detail: 'Minimum 6.5 hours — non-negotiable.' },
];

export const SATURDAY_TASKS = [
  { id: 'sat_morning', time: '8:00 AM – 12:00 PM', title: 'Pure coding time', detail: 'New Java concepts, OOP, data structures, mini-projects.', highlight: true },
  { id: 'sat_afternoon', time: '2:00 – 5:00 PM', title: 'Assignments & revision', detail: 'College assignments + Comp Arch / Statistics numericals.' },
  { id: 'sat_evening', time: 'Evening', title: 'Personal time', detail: 'Clean room, wash clothes, English movies with subtitles.' },
];

export const SUNDAY_TASKS = [
  { id: 'sun_revision', time: '6:00 – 9:00 AM', title: 'Weekly revision', detail: 'Go over everything studied this week.', highlight: true },
  { id: 'sun_office', time: '9:00 AM', title: 'Ready for office', detail: 'Get ready and head out.' },
];

export const ROADMAP = [
  {
    id: 'y1',
    year: 'Year 1',
    label: 'The Foundation',
    color: '#7CB342',
    colorDark: '#3B6D11',
    focus: 'Learn & build a strong base',
    tasks: [
      'Maintain a strong CGPA',
      'Master Java syntax & OOP',
      'Build Discrete Math base (algorithm foundation)',
      'Build a problem-solving mindset',
    ],
  },
  {
    id: 'y2',
    year: 'Year 2',
    label: 'DSA & Backend Basics',
    color: '#378ADD',
    colorDark: '#185FA5',
    focus: 'DSA + backend development',
    tasks: [
      'Learn Data Structures & Algorithms',
      'Solve 1–2 LeetCode problems daily',
      'Learn Spring Boot (Java framework)',
      'Learn SQL & databases',
    ],
  },
  {
    id: 'y3',
    year: 'Year 3',
    label: 'Full Stack & Cloud',
    color: '#EF9F27',
    colorDark: '#854F0B',
    focus: 'Build projects & cloud skills',
    tasks: [
      'Learn React (frontend)',
      'Connect frontend with Spring Boot — full stack',
      'Learn cloud basics (AWS / Google Cloud)',
      'Ship 2–3 real projects to GitHub',
    ],
  },
  {
    id: 'y4',
    year: 'Year 4',
    label: 'Interview Prep & Apply',
    color: '#7F77DD',
    colorDark: '#3C3489',
    focus: 'Prepare, apply & get hired',
    tasks: [
      'Advanced DSA & system design',
      'Run mock interviews',
      'Network with FAANG engineers on LinkedIn',
      'Apply for internships & entry-level roles',
    ],
  },
];

export function allWeekdayTaskIds() {
  return WEEKDAY_TASKS.map((t) => t.id);
}
export function allSaturdayTaskIds() {
  return SATURDAY_TASKS.map((t) => t.id);
}
export function allSundayTaskIds() {
  return SUNDAY_TASKS.map((t) => t.id);
}

// Returns the right task list for a JS Date's day-of-week (0=Sun..6=Sat)
export function tasksForDay(date) {
  const day = date.getDay();
  if (day === 6) return { kind: 'Saturday', tasks: SATURDAY_TASKS };
  if (day === 0) return { kind: 'Sunday', tasks: SUNDAY_TASKS };
  return { kind: 'Weekday', tasks: WEEKDAY_TASKS };
}

export function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
