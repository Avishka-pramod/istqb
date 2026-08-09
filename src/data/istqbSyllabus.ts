import type { ChapterInfo, KLevel } from '../types/exam';


export const ISTQB_CHAPTERS: ChapterInfo[] = [
  {
    id: 1,
    title: 'Fundamentals of Testing',
    description: 'What is testing, why is it necessary, testing principles, test process, human factors and ethics.',
    questionCount: 8,
    kLevelBreakdown: { K1: 2, K2: 6, K3: 0 },
    keyTopics: [
      'What is Testing? (Objectives & Testing vs Debugging)',
      'Why is Testing Necessary? (Errors, Faults, Failures, Quality Assurance)',
      'Testing Principles (7 Principles of Testing)',
      'Test Process (Activities, Work Products, Traceability)',
      'Essential Skills & Ethics in Testing (Psychology, Whole Team Approach)'
    ]
  },
  {
    id: 2,
    title: 'Testing Throughout the Software Development Lifecycle',
    description: 'Testing in SDLC context, test levels, test types, maintenance testing.',
    questionCount: 6,
    kLevelBreakdown: { K1: 2, K2: 4, K3: 0 },
    keyTopics: [
      'Testing in the Context of SDLC (Sequential & Agile Models, Shift Left)',
      'Test Levels (Component, Integration, System, Acceptance)',
      'Test Types (Functional, Non-Functional, Black-box, White-box)',
      'Maintenance Testing (Triggers, Regression & Impact Analysis)'
    ]
  },
  {
    id: 3,
    title: 'Static Testing',
    description: 'Static testing basics, feedback and review process, review types and roles.',
    questionCount: 4,
    kLevelBreakdown: { K1: 2, K2: 2, K3: 0 },
    keyTopics: [
      'Static Testing Basics (Work Products Evaluated, Value of Early Static Testing)',
      'Feedback and Review Process (Phases, Roles, Review Types: Informal, Walkthrough, Technical Review, Inspection)'
    ]
  },
  {
    id: 4,
    title: 'Test Analysis and Design',
    description: 'Test techniques: Black-box (Equivalence Partitioning, BVA, Decision Table, State Transition), White-box (Statement & Branch), Experience-based.',
    questionCount: 11,
    kLevelBreakdown: { K1: 0, K2: 6, K3: 5 },
    keyTopics: [
      'Overview of Test Techniques (Black-box, White-box, Experience-based)',
      'Black-box Techniques (Equivalence Partitioning, Boundary Value Analysis, Decision Table Testing, State Transition Testing)',
      'White-box Techniques (Statement Testing & Coverage, Branch Testing & Coverage)',
      'Experience-based Techniques (Error Guessing, Exploratory Testing, Checklist-based Testing)',
      'Collaborative Test Approaches (User Stories & Acceptance Criteria, User Story Writing)'
    ]
  },
  {
    id: 5,
    title: 'Managing the Test Activities',
    description: 'Test planning, risk management, test monitoring and control, configuration management, defect management.',
    questionCount: 9,
    kLevelBreakdown: { K1: 1, K2: 5, K3: 3 },
    keyTopics: [
      'Test Planning (Purpose, Content, Strategy, Estimation, Entry/Exit Criteria)',
      'Risk Management (Product Risk, Project Risk, Risk-based Testing)',
      'Test Monitoring, Control and Completion (Metrics, Test Progress Reports, Completion Criteria)',
      'Configuration Management (Version Control & Traceability)',
      'Defect Management (Defect Reports, Defect Lifecycle)'
    ]
  },
  {
    id: 6,
    title: 'Test Tools',
    description: 'Tool support for testing, benefits, risks, and selection of tools.',
    questionCount: 2,
    kLevelBreakdown: { K1: 1, K2: 1, K3: 0 },
    keyTopics: [
      'Tool Support for Testing (Tool Classification, Automation Scope)',
      'Benefits and Risks of Test Automation (Efficiency vs Maintenance Overhead)'
    ]
  }
];

export const TOTAL_QUESTIONS = 40;
export const PASSING_SCORE_PERCENT = 65;
export const PASSING_SCORE_COUNT = 26; // 65% of 40 = 26

export const K_LEVEL_DESCRIPTIONS: Record<KLevel, { title: string; desc: string; total: number }> = {
  K1: { title: 'Remember', desc: 'Recognize, remember, and recall terms, acronyms, and concepts.', total: 8 },
  K2: { title: 'Understand', desc: 'Select, explain, and clarify concepts, principles, and procedures.', total: 24 },
  K3: { title: 'Apply', desc: 'Calculate, execute, and apply techniques to concrete scenarios.', total: 8 }
};

export const STRICT_SYLLABUS_DISTRIBUTION = {
  1: { k1: 2, k2: 6, k3: 0 },
  2: { k1: 2, k2: 4, k3: 0 },
  3: { k1: 2, k2: 2, k3: 0 },
  4: { k1: 0, k2: 6, k3: 5 },
  5: { k1: 1, k2: 5, k3: 3 },
  6: { k1: 1, k2: 1, k3: 0 }
};
