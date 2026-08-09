import type { Question } from '../types/exam';


export const COMPREHENSIVE_QUESTION_BANK: Question[] = [
  // ==========================================
  // CHAPTER 1: Fundamentals of Testing (8 Qs required: 2x K1, 6x K2)
  // ==========================================
  {
    id: 100,
    chapter: 1,
    k_level: 'K1',
    topic: 'Valid Test Objectives',
    question: 'Which of the following statements describe a valid test objective?',
    options: [
      'To prove that there are no unfixed defects in the system under test',
      'To prove that there will be no failures after the implementation of the system into production',
      'To reduce the risk level of the test object and to build confidence in the quality level',
      'To verify that there are no untested combinations of inputs'
    ],
    correct_answer: 'To reduce the risk level of the test object and to build confidence in the quality level',
    explanation: 'Testing finds defects and failures which reduces the level of risk and at the same time gives more confidence in the quality level of the test object.'
  },
  {
    id: 1061,
    chapter: 1,
    k_level: 'K2',
    topic: 'Pesticide Paradox / Tests Wear Out',
    question: 'You have been assigned as a tester to a team producing a new system incrementally. You have noticed that no changes have been made to the existing regression test cases for several iterations and no new regression defects were identified. Your manager is happy, but you are not. Which testing principle explains your skepticism?',
    options: [
      'Tests wear out',
      'Absence-of-defects fallacy',
      'Defects cluster together',
      'Exhaustive testing is impossible'
    ],
    correct_answer: 'Tests wear out',
    explanation: 'This principle means that if the same tests are repeated over and over again, eventually these tests no longer find any new defects. This is probably why the tests all passed in this release as well.'
  },

  {
    id: 101,
    chapter: 1,
    k_level: 'K1',
    topic: 'Testing Objectives',
    question: 'Which of the following is a primary objective of testing in software development?',
    options: [
      'To prove that the software contains no remaining defects',
      'To evaluate work products such as requirements, user stories, and code',
      'To assign responsibility for bugs found during development',
      'To correct code defects discovered during execution'
    ],
    correct_answer: 'To evaluate work products such as requirements, user stories, and code',
    explanation: 'One of the main objectives of testing is to evaluate work products (requirements, design, code) to verify whether specified requirements are satisfied and to prevent defects.'
  },
  {
    id: 102,
    chapter: 1,
    k_level: 'K1',
    topic: 'Testing vs Debugging',
    question: 'What is the key difference between testing and debugging?',
    options: [
      'Testing discovers defects; debugging locates, analyzes, and fixes defects',
      'Testing is performed by developers; debugging is performed by independent testers',
      'Testing removes bugs from code; debugging verifies that code meets requirements',
      'Testing occurs only after release; debugging occurs only during coding'
    ],
    correct_answer: 'Testing discovers defects; debugging locates, analyzes, and fixes defects',
    explanation: 'Testing shows failures caused by defects. Debugging is the development activity that finds the cause of a failure, analyzes it, and repairs the software.'
  },
  {
    id: 103,
    chapter: 1,
    k_level: 'K1',
    topic: 'Quality Assurance vs Testing',
    question: 'How does Quality Assurance (QA) differ from Testing?',
    options: [
      'QA focuses on execution of test cases, while testing focuses on process improvement',
      'QA is a defect-execution activity, while testing is a defect-prevention framework',
      'QA focuses on adherence to proper processes to ensure quality, while testing is focused on finding defects in work products',
      'QA and testing are identical terms representing the same operational activities'
    ],
    correct_answer: 'QA focuses on adherence to proper processes to ensure quality, while testing is focused on finding defects in work products',
    explanation: 'Quality Assurance (QA) is process-oriented and focuses on adherence to proper processes. Testing is product-oriented and focuses on finding defects in work products.'
  },
  {
    id: 104,
    chapter: 1,
    k_level: 'K2',
    topic: '7 Principles of Testing - Exhaustive Testing',
    question: 'Which statement accurately describes the testing principle "Exhaustive testing is impossible"?',
    options: [
      'Testing all combinations of inputs and preconditions is achievable with automated tools',
      'Testing everything except edge cases is sufficient for safety-critical systems',
      'Testing all combinations of inputs and preconditions is infeasible except for trivial cases; risk analysis should guide testing efforts',
      'Exhaustive testing can be achieved if developers write unit tests for 100% statement coverage'
    ],
    correct_answer: 'Testing all combinations of inputs and preconditions is infeasible except for trivial cases; risk analysis should guide testing efforts',
    explanation: 'Principle 2 states that testing everything (all combinations of inputs and preconditions) is impossible except for trivial cases. Test effort should be driven by risk assessment and priorities.'
  },
  {
    id: 105,
    chapter: 1,
    k_level: 'K2',
    topic: '7 Principles of Testing - Absence-of-errors Fallacy',
    question: 'A software project team fixed all 500 reported defects prior to deployment. However, users find the system unusable because it does not support their key business workflow. Which principle of testing does this illustrate?',
    options: [
      'Defects cluster together',
      'Absence-of-errors is a fallacy',
      'Pesticide paradox',
      'Early testing saves time and money'
    ],
    correct_answer: 'Absence-of-errors is a fallacy',
    explanation: 'Principle 7 ("Absence-of-errors is a fallacy") states that finding and fixing defects does not guarantee system success if the system built is unusable or fails to fulfill user needs and expectations.'
  },
  {
    id: 106,
    chapter: 1,
    k_level: 'K2',
    topic: '7 Principles of Testing - Pesticide Paradox',
    question: 'If the same set of automated regression tests is repeated continuously without modification, what outcome is predicted by the Pesticide Paradox?',
    options: [
      'The tests will become faster and consume fewer system resources',
      'The tests will eventually no longer find new defects in modified areas of the system',
      'The system will gradually eliminate all remaining hidden architecture flaws',
      'The test suite will automatically update to cover new user stories'
    ],
    correct_answer: 'The tests will eventually no longer find new defects in modified areas of the system',
    explanation: 'Principle 5 (Pesticide Paradox) states that if the same tests are repeated over and over again, eventually the same set of test cases will no longer find any new defects. Tests must be regularly reviewed and updated.'
  },
  {
    id: 107,
    chapter: 1,
    k_level: 'K2',
    topic: 'Errors, Flaws, Defects, Failures',
    question: 'A programmer makes a typing mistake in a calculation formula. During system execution, the application displays an incorrect invoice total to a customer. Which sequence correctly maps this event to ISTQB terminology?',
    options: [
      'Error (mistake) -> Defect (fault) -> Failure',
      'Failure -> Defect (fault) -> Error (mistake)',
      'Defect -> Error -> Failure',
      'Bug -> Glitch -> Error'
    ],
    correct_answer: 'Error (mistake) -> Defect (fault) -> Failure',
    explanation: 'A human makes an Error (mistake), which introduces a Defect (fault/bug) into the code. When executed, this defect may cause a Failure (an event in which the component fails to perform as required).'
  },
  {
    id: 108,
    chapter: 1,
    k_level: 'K2',
    topic: 'Test Process - Test Activities and Tasks',
    question: 'During which test process activity are test conditions transformed into test cases and test data produced?',
    options: [
      'Test Analysis',
      'Test Design',
      'Test Implementation',
      'Test Execution'
    ],
    correct_answer: 'Test Design',
    explanation: 'During Test Design, test conditions are elaborated into test cases, high-level test cases are detailed, and required test data is identified and designed.'
  },
  {
    id: 109,
    chapter: 1,
    k_level: 'K2',
    topic: 'Traceability in Testing',
    question: 'Why is establishing bidirectional traceability between test basis elements and test work products essential?',
    options: [
      'It allows developers to bypass code reviews when writing unit tests',
      'It helps evaluate test coverage, assess the impact of changes, and audit testing compliance',
      'It guarantees that test execution can be 100% automated without manual effort',
      'It eliminates the need for maintaining test progress reports'
    ],
    correct_answer: 'It helps evaluate test coverage, assess the impact of changes, and audit testing compliance',
    explanation: 'Traceability enables coverage evaluation (which requirements are tested), impact analysis (which tests are affected when a requirement changes), and auditing.'
  },

  // ==========================================
  // CHAPTER 2: Testing Throughout SDLC (6 Qs required: 2x K1, 4x K2)
  // ==========================================
  {
    id: 201,
    chapter: 2,
    k_level: 'K1',
    topic: 'Test Levels',
    question: 'Which test level focuses on verifying interactions between integrated components or systems?',
    options: [
      'Component Testing',
      'Integration Testing',
      'System Testing',
      'Acceptance Testing'
    ],
    correct_answer: 'Integration Testing',
    explanation: 'Integration testing focuses on testing interfaces and interactions between integrated components or systems.'
  },
  {
    id: 202,
    chapter: 2,
    k_level: 'K1',
    topic: 'Acceptance Testing Types',
    question: 'Which type of acceptance testing is performed by potential customers at an external site to get feedback before commercial release?',
    options: [
      'Alpha Testing',
      'Beta Testing',
      'Operational Acceptance Testing',
      'Regulatory Acceptance Testing'
    ],
    correct_answer: 'Beta Testing',
    explanation: 'Beta testing (field testing) is performed by potential or existing customers/users at their own locations, while Alpha testing takes place at the developer site.'
  },
  {
    id: 203,
    chapter: 2,
    k_level: 'K2',
    topic: 'Shift Left Approach',
    question: 'What is the main benefit of implementing the "Shift Left" practice in software testing?',
    options: [
      'Testing activities start earlier in the SDLC, reducing the cost of defect repair',
      'Test execution is postponed until all code has been merged into main',
      'Testers replace developers in writing component-level unit code',
      'User acceptance testing is conducted prior to requirements definition'
    ],
    correct_answer: 'Testing activities start earlier in the SDLC, reducing the cost of defect repair',
    explanation: 'Shift Left advocates starting testing activities early in the SDLC (e.g., reviewing requirements and design before coding) to identify defects when they are cheapest to fix.'
  },
  {
    id: 204,
    chapter: 2,
    k_level: 'K2',
    topic: 'Component Testing vs System Testing',
    question: 'How do the test basis and test environment typically differ between Component Testing and System Testing?',
    options: [
      'Component testing uses business requirements in a production environment; System testing uses class specs in an isolated harness',
      'Component testing uses detailed code specifications in an isolated harness; System testing uses system requirements in a target environment',
      'Component testing is performed by business users; System testing is performed by unit developers',
      'Component testing checks non-functional performance; System testing checks code syntax errors'
    ],
    correct_answer: 'Component testing uses detailed code specifications in an isolated harness; System testing uses system requirements in a target environment',
    explanation: 'Component testing evaluates isolated software units using component specs or code designs, whereas System testing evaluates the complete integrated product against business and system requirements.'
  },
  {
    id: 205,
    chapter: 2,
    k_level: 'K2',
    topic: 'Maintenance Testing Triggers',
    question: 'Which of the following scenarios is a trigger for Maintenance Testing?',
    options: [
      'Creating initial wireframes during sprint planning',
      'Migrating an existing enterprise application to a new cloud platform',
      'Writing the initial test strategy document for a new project',
      'Conducting an architectural review prior to coding'
    ],
    correct_answer: 'Migrating an existing enterprise application to a new cloud platform',
    explanation: 'Maintenance testing is triggered by modifications (enhancements, hotfixes), operational environment changes/migrations, or retirement of a system.'
  },
  {
    id: 206,
    chapter: 2,
    k_level: 'K2',
    topic: 'Impact Analysis in Maintenance',
    question: 'What is the role of Impact Analysis during maintenance testing?',
    options: [
      'To calculate the monetary cost of developer salaries per sprint',
      'To evaluate the changes made to identify side effects and determine the scope of regression testing',
      'To prove that no new features need to be added to the software',
      'To automatically fix broken database scripts in staging'
    ],
    correct_answer: 'To evaluate the changes made to identify side effects and determine the scope of regression testing',
    explanation: 'Impact analysis evaluates the changes to determine intended consequences and unintended side effects, guiding the selection of regression test cases.'
  },

  // ==========================================
  // CHAPTER 3: Static Testing (4 Qs required: 2x K1, 2x K2)
  // ==========================================
  {
    id: 301,
    chapter: 3,
    k_level: 'K1',
    topic: 'Work Products in Static Testing',
    question: 'Which of the following work products can be evaluated using static testing techniques?',
    options: [
      'Executed binary files',
      'User stories, requirements, software architecture, and source code',
      'Encrypted runtime memory dumps only',
      'Third-party live API network streams'
    ],
    correct_answer: 'User stories, requirements, software architecture, and source code',
    explanation: 'Almost any work product can be examined using static testing, including requirements, user stories, architecture specs, code, test plans, and user manuals.'
  },
  {
    id: 302,
    chapter: 3,
    k_level: 'K1',
    topic: 'Review Roles',
    question: 'In a formal review process, who is responsible for leading the review meeting, mediating discussions, and ensuring smooth review progress?',
    options: [
      'The Author',
      'The Facilitator (or Moderator)',
      'The Review Leader',
      'The Scribe (or Recorder)'
    ],
    correct_answer: 'The Facilitator (or Moderator)',
    explanation: 'The Facilitator (Moderator) leads the review meeting, mediates discussions, keeps the meeting focused on objectives, and ensures a safe review environment.'
  },
  {
    id: 303,
    chapter: 3,
    k_level: 'K2',
    topic: 'Review Types Comparison',
    question: 'How does an Inspection differ from an Informal Review?',
    options: [
      'Inspection has no defined process; Informal review requires formal metrics collection',
      'Inspection is led by the author; Informal review is led by an independent moderator',
      'Inspection follows a formal process with entry/exit criteria, defined roles, checklists, and metrics; Informal review has no formal process',
      'Inspection is used only for user manuals; Informal review is used only for source code'
    ],
    correct_answer: 'Inspection follows a formal process with entry/exit criteria, defined roles, checklists, and metrics; Informal review has no formal process',
    explanation: 'Inspection is the most formal review type, governed by strict entry/exit criteria, checklists, metrics collection, and formal roles. Informal reviews do not follow a formal process.'
  },
  {
    id: 304,
    chapter: 3,
    k_level: 'K2',
    topic: 'Value of Static Testing',
    question: 'Why is static testing considered highly cost-effective compared to dynamic testing alone?',
    options: [
      'Static testing eliminates the need for dynamic system and acceptance testing',
      'Defects discovered during static testing are detected early, making them significantly cheaper and easier to fix than defects found during execution',
      'Static testing can be performed entirely by automated bots without human intervention',
      'Static testing guarantees 100% test coverage across all runtime scenarios'
    ],
    correct_answer: 'Defects discovered during static testing are detected early, making them significantly cheaper and easier to fix than defects found during execution',
    explanation: 'Static testing identifies defects early in the SDLC (e.g., in requirements or design) before code execution, preventing defect propagation and drastically reducing rework costs.'
  },

  // ==========================================
  // CHAPTER 4: Test Analysis and Design (11 Qs required: 6x K2, 5x K3)
  // ==========================================
  {
    id: 401,
    chapter: 4,
    k_level: 'K2',
    topic: 'Test Technique Categories',
    question: 'Which statement correctly characterizes Black-box test techniques?',
    options: [
      'They derive test cases directly from internal code structure and control flow',
      'They derive test cases from formal or informal specifications without reference to internal structure',
      'They rely entirely on the personal intuition and past experience of senior testers',
      'They are applied exclusively during component-level automated unit testing'
    ],
    correct_answer: 'They derive test cases from formal or informal specifications without reference to internal structure',
    explanation: 'Black-box test techniques (specification-based) analyze input and output behavior based on documentation/specs, without using internal code structure.'
  },
  {
    id: 402,
    chapter: 4,
    k_level: 'K2',
    topic: 'Equivalence Partitioning Concept',
    question: 'What is the fundamental principle behind Equivalence Partitioning (EP)?',
    options: [
      'Inputs from the same partition are expected to be processed in the same way by the software',
      'Every individual line of code must be executed by at least one equivalence test case',
      'Test cases are derived by guessing common errors made by inexperienced programmers',
      'Boundary values of adjacent partitions are tested twice to ensure overlap coverage'
    ],
    correct_answer: 'Inputs from the same partition are expected to be processed in the same way by the software',
    explanation: 'Equivalence Partitioning divides data into partitions where all elements within a partition are assumed to be handled identically by the system.'
  },
  {
    id: 403,
    chapter: 4,
    k_level: 'K2',
    topic: 'Boundary Value Analysis Concept',
    question: 'When applying 2-value Boundary Value Analysis (BVA) for an ordered numerical range, which values are selected for testing?',
    options: [
      'Only the exact midpoint value of the valid partition',
      'The minimum and maximum boundary values, plus the values immediately inside and outside the boundaries',
      'Random values chosen uniformly across valid and invalid partitions',
      'Only values that trigger runtime system exceptions'
    ],
    correct_answer: 'The minimum and maximum boundary values, plus the values immediately inside and outside the boundaries',
    explanation: 'In 2-value BVA, the boundary values selected are the boundary itself and its closest neighbor on the other side of the boundary.'
  },
  {
    id: 404,
    chapter: 4,
    k_level: 'K2',
    topic: 'State Transition Testing Concept',
    question: 'In which situation is State Transition Testing most effective?',
    options: [
      'When testing standalone mathematical functions with independent inputs',
      'When testing systems whose behavior depends on current state and past history of events',
      'When measuring statement coverage of complex conditional loops',
      'When estimating test execution effort based on developer story points'
    ],
    correct_answer: 'When testing systems whose behavior depends on current state and past history of events',
    explanation: 'State Transition Testing is designed for systems where output depends not only on current inputs but also on past history (state transitions).'
  },
  {
    id: 405,
    chapter: 4,
    k_level: 'K2',
    topic: 'Statement Coverage vs Branch Coverage',
    question: 'What is the relationship between Statement Coverage and Branch Coverage in White-box testing?',
    options: [
      '100% Statement Coverage guarantees 100% Branch Coverage',
      '100% Branch Coverage guarantees 100% Statement Coverage',
      'Statement coverage and branch coverage are completely independent with no coverage relationship',
      'Branch coverage only applies to object-oriented codebases'
    ],
    correct_answer: '100% Branch Coverage guarantees 100% Statement Coverage',
    explanation: 'Branch coverage requires exercising all decision outcomes (true/false branches). Achieving 100% branch coverage ensures every statement has been executed at least once (100% statement coverage).'
  },
  {
    id: 406,
    chapter: 4,
    k_level: 'K2',
    topic: 'Exploratory Testing',
    question: 'What defines Exploratory Testing according to ISTQB?',
    options: [
      'Unstructured, ad-hoc testing conducted without any goals or documentation',
      'An approach where test design and test execution occur simultaneously, guided by a test charter and domain knowledge',
      'Automated script execution using random input generation (fuzzing)',
      'Static analysis of user interface guidelines prior to test creation'
    ],
    correct_answer: 'An approach where test design and test execution occur simultaneously, guided by a test charter and domain knowledge',
    explanation: 'Exploratory testing involves simultaneous test design, execution, and learning, structured around test charters and time-boxed sessions.'
  },

  // Chapter 4 K3 Scenarios (5 required)
  {
    id: 407,
    chapter: 4,
    k_level: 'K3',
    topic: 'Equivalence Partitioning Calculation',
    question: 'A discount module grants free shipping for order subtotals from $50.00 up to $150.00 inclusive. Subtotals below $50.00 incur a standard $5.99 shipping fee. Subtotals above $150.00 receive express free shipping. Which set of test inputs represents one valid subtotal and two invalid subtotals for the standard $5.99 shipping fee condition?',
    options: [
      '$25.00 (Valid fee), -$10.00 (Invalid), $75.00 (Invalid)',
      '$75.00 (Valid fee), $20.00 (Invalid fee), $160.00 (Invalid fee)',
      '$100.00 (Valid fee), $50.00 (Valid fee), $150.00 (Valid fee)',
      '$0.00 (Valid fee), $49.99 (Valid fee), $50.01 (Invalid fee)'
    ],
    correct_answer: '$25.00 (Valid fee), -$10.00 (Invalid), $75.00 (Invalid)',
    explanation: 'Standard fee partition is subtotal [0.00 to 49.99]. $25.00 falls in this valid partition. -$10.00 is invalid input partition, and $75.00 falls into the free shipping partition [50.00 to 150.00] (invalid for standard fee).'
  },
  {
    id: 408,
    chapter: 4,
    k_level: 'K3',
    topic: 'Boundary Value Analysis Calculation',
    question: 'An input field accepts an integer age for a junior driving license between 16 and 20 inclusive. Using 2-value Boundary Value Analysis, which set of input values MUST be tested?',
    options: [
      '15, 16, 20, 21',
      '14, 16, 18, 20, 22',
      '16, 17, 19, 20',
      '0, 16, 20, 100'
    ],
    correct_answer: '15, 16, 20, 21',
    explanation: 'For range [16, 20], the min boundary is 16 and max is 20. In 2-value BVA, boundary values tested are boundary and immediate outside neighbor: min boundary (16) & outside (15); max boundary (20) & outside (21).'
  },
  {
    id: 409,
    chapter: 4,
    k_level: 'K3',
    topic: 'Decision Table Analysis',
    question: 'A credit card approval system checks three conditions: (1) Salary >= $50,000, (2) Credit Score >= 700, (3) Existing Customer. Card is approved if Salary >= $50,000 AND Credit Score >= 700. If Credit Score is < 700, card is approved ONLY IF Existing Customer is TRUE and Salary >= $50,000. How many distinct decision rules are required for a complete collapsed decision table?',
    options: [
      '4 rules',
      '6 rules',
      '8 rules',
      '3 rules'
    ],
    correct_answer: '4 rules',
    explanation: 'With 3 binary conditions, full table has 2^3 = 8 combinations. When Salary < 50k, outcome is always Rejected regardless of other 2 conditions (collapses 4 rules to 1 rule). When Salary >= 50k & Credit Score >= 700, Approved regardless of Existing Customer (collapses 2 rules to 1 rule). Credit Score < 700 yields 2 rules based on Existing Customer. Total collapsed rules = 1 + 1 + 2 = 4 rules.'
  },
  {
    id: 410,
    chapter: 4,
    k_level: 'K3',
    topic: 'Statement Coverage Calculation',
    question: 'Consider the following code snippet:\nIF (x > 10) THEN\n   y = x * 2;\nEND IF;\nIF (z == 5) THEN\n   y = y + 1;\nEND IF;\nWhat is the MINIMUM number of test cases required to achieve 100% Statement Coverage?',
    options: [
      '1 test case (e.g., x = 12, z = 5)',
      '2 test cases (e.g., x = 12, z = 5 and x = 5, z = 0)',
      '4 test cases covering all true/false combinations',
      '3 test cases'
    ],
    correct_answer: '1 test case (e.g., x = 12, z = 5)',
    explanation: 'To execute every statement at least once, a single test case where x > 10 (triggers first IF block) AND z == 5 (triggers second IF block) will execute lines 1, 2, 4, and 5. Thus 1 test case achieves 100% statement coverage.'
  },
  {
    id: 411,
    chapter: 4,
    k_level: 'K3',
    topic: 'Branch Coverage Calculation',
    question: 'Consider the code snippet:\nIF (status == "VIP") THEN\n   discount = 0.20;\nELSE\n   discount = 0.05;\nEND IF;\nWhat is the MINIMUM number of test cases needed to achieve 100% Branch Coverage?',
    options: [
      '1 test case',
      '2 test cases (e.g., status = "VIP" and status = "REGULAR")',
      '4 test cases',
      '3 test cases'
    ],
    correct_answer: '2 test cases (e.g., status = "VIP" and status = "REGULAR")',
    explanation: 'The IF decision has two branches: TRUE (status == "VIP") and FALSE (status != "VIP"). Executing one test with "VIP" and one test with "REGULAR" exercises both decision outcomes, achieving 100% branch coverage.'
  },

  // ==========================================
  // CHAPTER 5: Managing Test Activities (9 Qs required: 1x K1, 5x K2, 3x K3)
  // ==========================================
  {
    id: 501,
    chapter: 5,
    k_level: 'K1',
    topic: 'Test Strategy',
    question: 'Which artifact defines the overall generic guidelines and objectives for testing across an organization or portfolio?',
    options: [
      'Test Execution Log',
      'Test Strategy (or Organizational Test Policy)',
      'Defect Report',
      'Sprint Backlog item'
    ],
    correct_answer: 'Test Strategy (or Organizational Test Policy)',
    explanation: 'The organizational test strategy (or policy) provides generic, high-level guidelines and testing objectives across an entire organization or portfolio of projects.'
  },
  {
    id: 502,
    chapter: 5,
    k_level: 'K2',
    topic: 'Product Risk vs Project Risk',
    question: 'Which of the following is an example of a Product Risk rather than a Project Risk?',
    options: [
      'Late delivery of the test environment by the infrastructure team',
      'High turnover of key software developers during mid-sprint',
      'The payment gateway calculation produces incorrect sales tax amounts under high load',
      'Lack of budget for automated performance testing tools'
    ],
    correct_answer: 'The payment gateway calculation produces incorrect sales tax amounts under high load',
    explanation: 'Product risk relates to quality characteristic failures of the work product (e.g., calculation errors, poor performance). Project risks relate to management, schedules, supplier issues, or budget.'
  },
  {
    id: 503,
    chapter: 5,
    k_level: 'K2',
    topic: 'Risk-based Testing Approach',
    question: 'How is risk level evaluated in Risk-based Testing?',
    options: [
      'Risk Level = Risk Likelihood (Probability) x Risk Impact (Harm)',
      'Risk Level = Number of lines of code / Number of test cases',
      'Risk Level = Developer experience level + Tester salary',
      'Risk Level = Total open defects - Total closed defects'
    ],
    correct_answer: 'Risk Level = Risk Likelihood (Probability) x Risk Impact (Harm)',
    explanation: 'Risk level is determined as a combination of Risk Likelihood (probability that a risk event occurs) and Risk Impact (consequence if it occurs).'
  },
  {
    id: 504,
    chapter: 5,
    k_level: 'K2',
    topic: 'Entry and Exit Criteria',
    question: 'What is the purpose of Exit Criteria (Definition of Done) in test management?',
    options: [
      'To decide when developers can begin writing source code',
      'To define preconditions that must be met before test execution can start',
      'To specify conditions that must be satisfied to officially complete a test activity or test level',
      'To calculate daily automated test execution speed'
    ],
    correct_answer: 'To specify conditions that must be satisfied to officially complete a test activity or test level',
    explanation: 'Exit criteria (Definition of Done) specify the metrics and conditions that must be fulfilled to officially end a test activity or test level.'
  },
  {
    id: 505,
    chapter: 5,
    k_level: 'K2',
    topic: 'Defect Report Contents',
    question: 'Which information is essential to include in a Defect Report to facilitate rapid diagnosis by developers?',
    options: [
      'Steps to reproduce the failure, expected result, actual result, and test environment details',
      'Developer performance rating and hourly contract rate',
      'List of all passing test cases executed on the same day',
      'Copy of the complete company test policy manual'
    ],
    correct_answer: 'Steps to reproduce the failure, expected result, actual result, and test environment details',
    explanation: 'A good defect report must include a clear title, environment details, detailed step-by-step reproduction steps, expected behavior, and actual behavior observed.'
  },
  {
    id: 506,
    chapter: 5,
    k_level: 'K2',
    topic: 'Configuration Management Purpose',
    question: 'How does Configuration Management support test activities?',
    options: [
      'By automatically fixing bugs in production code without code reviews',
      'By ensuring unique identification, version control, and traceability of test items and test work products',
      'By generating synthetic user stories for agile backlogs',
      'By measuring individual developer productivity'
    ],
    correct_answer: 'By ensuring unique identification, version control, and traceability of test items and test work products',
    explanation: 'Configuration management ensures all test items (builds, specifications, code, test suites) are uniquely identified, version-controlled, and traceable.'
  },

  // Chapter 5 K3 Scenarios (3 required)
  {
    id: 507,
    chapter: 5,
    k_level: 'K3',
    topic: 'Risk Matrix Prioritization',
    question: 'A test team evaluates 4 product risks:\nRisk A: Likelihood High, Impact High\nRisk B: Likelihood Low, Impact High\nRisk C: Likelihood High, Impact Low\nRisk D: Likelihood Low, Impact Low\nUsing risk-based testing principles, in what order should test design and execution be prioritized?',
    options: [
      'Risk A -> Risk B -> Risk C -> Risk D',
      'Risk D -> Risk C -> Risk B -> Risk A',
      'Risk C -> Risk A -> Risk D -> Risk B',
      'All risks must be tested simultaneously with equal effort'
    ],
    correct_answer: 'Risk A -> Risk B -> Risk C -> Risk D',
    explanation: 'High Likelihood/High Impact (Risk A) is top priority. High Impact with Low Likelihood (Risk B) is second. High Likelihood/Low Impact (Risk C) is third, and Low/Low (Risk D) is lowest priority.'
  },
  {
    id: 508,
    chapter: 5,
    k_level: 'K3',
    topic: 'Test Progress Reporting & Metrics',
    question: 'A sprint test progress report shows:\n- Planned Test Cases: 100\n- Executed: 80 (60 Passed, 20 Failed)\n- Blocked: 10\n- Unexecuted: 10\nWhat is the current test pass rate percentage based on executed tests?',
    options: [
      '75%',
      '60%',
      '80%',
      '66.7%'
    ],
    correct_answer: '75%',
    explanation: 'Pass rate based on executed test cases = (Passed Tests / Executed Tests) * 100 = (60 / 80) * 100 = 75%.'
  },
  {
    id: 509,
    chapter: 5,
    k_level: 'K3',
    topic: 'Test Estimation Techniques',
    question: 'A test lead uses Wideband Delphi (a consensus-based estimation technique) with 3 expert testers to estimate test execution time for a new feature. Initial estimates are 8 hours, 12 hours, and 16 hours. After discussion regarding test environment setup complexity, all experts agree on a revised average estimate of 14 hours. Which estimation category does this approach belong to?',
    options: [
      'Expert-based technique',
      'Metrics-based technique using historical test execution logs',
      'Three-point PERT formula calculation',
      'Function point analysis'
    ],
    correct_answer: 'Expert-based technique',
    explanation: 'Wideband Delphi is a formal expert-based estimation technique that relies on consensus among domain experts.'
  },

  // ==========================================
  // CHAPTER 6: Test Tools (2 Qs required: 1x K1, 1x K2)
  // ==========================================
  {
    id: 601,
    chapter: 6,
    k_level: 'K1',
    topic: 'Test Tool Classification',
    question: 'Which of the following test tools directly supports test execution and logging activities?',
    options: [
      'Test Harness / Automated Execution Tool',
      'Requirements Management Tool',
      'Static Code Analyzer',
      'Defect Tracking System'
    ],
    correct_answer: 'Test Harness / Automated Execution Tool',
    explanation: 'Test execution tools (and test harnesses) run test cases automatically against the system under test and log the execution results.'
  },
  {
    id: 602,
    chapter: 6,
    k_level: 'K2',
    topic: 'Benefits and Risks of Automation',
    question: 'Which of the following is a significant RISK associated with introducing test automation tools?',
    options: [
      'Increased consistency and repeatability of repetitive test suites',
      'Unrealistic expectations regarding what the tool can achieve and maintenance effort required for test scripts',
      'Reduction in manual test execution duration for regression suites',
      'Faster feedback on build quality in CI/CD pipelines'
    ],
    correct_answer: 'Unrealistic expectations regarding what the tool can achieve and maintenance effort required for test scripts',
    explanation: 'A major risk of test automation is underestimating the effort required to maintain scripts when application UI/logic changes, leading to fragile automation suites.'
  }
];

// Additional question pool for dynamic retakes in offline mode
export const RETAKE_QUESTION_POOL: Question[] = [
  // Chapter 1 Retakes
  {
    id: 110,
    chapter: 1,
    k_level: 'K1',
    topic: 'Whole Team Approach',
    question: 'What does the "Whole Team Approach" mean in modern software testing?',
    options: [
      'Everyone on the team shares responsibility for software quality and testing tasks',
      'Only dedicated QA engineers are permitted to touch test environments',
      'Developers stop writing code and perform manual testing full-time',
      'Project managers sign off on every individual test case before execution'
    ],
    correct_answer: 'Everyone on the team shares responsibility for software quality and testing tasks',
    explanation: 'The Whole Team approach means quality is a team responsibility; developers, testers, product owners, and business analysts collaborate throughout the delivery cycle.'
  },
  {
    id: 111,
    chapter: 1,
    k_level: 'K2',
    topic: 'Testing Principles - Early Testing',
    question: 'Why does starting test activities early in the SDLC save time and money?',
    options: [
      'Early testing allows developers to skip unit test writing',
      'Defects identified in requirements or architecture prevent defect propagation into code, where repairs are far costlier',
      'Early testing guarantees that zero defects will exist in production',
      'Early testing removes the need for acceptance testing'
    ],
    correct_answer: 'Defects identified in requirements or architecture prevent defect propagation into code, where repairs are far costlier',
    explanation: 'Early testing (e.g. reviewing user stories before code is written) catches defects at the source, preventing costly rework during dynamic test levels.'
  },
  {
    id: 112,
    chapter: 1,
    k_level: 'K2',
    topic: 'Testing Principles - Defect Clustering',
    question: 'According to the principle of Defect Clustering (Pareto Principle in testing), what is usually observed in software systems?',
    options: [
      'Defects are evenly distributed across all source code modules',
      'A small number of modules usually contain the majority of defects discovered during testing',
      'Defects only occur in third-party library dependencies',
      'Modules with zero defects initially will never develop defects during maintenance'
    ],
    correct_answer: 'A small number of modules usually contain the majority of defects discovered during testing',
    explanation: 'Defect clustering states that a small number of modules usually contain most of the defects discovered or exhibit the most operational failures (80/20 rule).'
  },

  // Chapter 2 Retakes
  {
    id: 207,
    chapter: 2,
    k_level: 'K1',
    topic: 'Test Types Definition',
    question: 'Which test type evaluates non-functional quality characteristics such as performance efficiency, usability, and security?',
    options: [
      'Functional Testing',
      'Non-Functional Testing',
      'Structural White-box Testing',
      'Component Regression Testing'
    ],
    correct_answer: 'Non-Functional Testing',
    explanation: 'Non-functional testing evaluates characteristics such as performance, reliability, security, usability, and portability.'
  },
  {
    id: 208,
    chapter: 2,
    k_level: 'K2',
    topic: 'Regression Testing vs Confirmation Testing',
    question: 'What is the distinction between Confirmation Testing (Re-testing) and Regression Testing?',
    options: [
      'Confirmation testing checks that a reported defect was successfully fixed; Regression testing checks that fixes did not break unchanged areas',
      'Confirmation testing is done by users; Regression testing is done by security auditors',
      'Confirmation testing requires automated tools; Regression testing is strictly manual',
      'There is no distinction; both terms refer to re-executing passing test cases'
    ],
    correct_answer: 'Confirmation testing checks that a reported defect was successfully fixed; Regression testing checks that fixes did not break unchanged areas',
    explanation: 'Confirmation testing verifies that a specific defect has been resolved. Regression testing verifies that recent code changes have not negatively affected existing, unchanged software features.'
  },

  // Chapter 3 Retakes
  {
    id: 305,
    chapter: 3,
    k_level: 'K1',
    topic: 'Static vs Dynamic Testing Comparison',
    question: 'Which type of defect is typically found MUCH EASIER through static testing than through dynamic testing?',
    options: [
      'Memory leak issues under 48-hour continuous load',
      'Inconsistencies or omissions in requirements specifications',
      'Network socket timeout exceptions on mobile cellular networks',
      'Database deadlock failures during concurrent transactions'
    ],
    correct_answer: 'Inconsistencies or omissions in requirements specifications',
    explanation: 'Requirements flaws, ambiguities, and contradictions are static work product defects that are discovered directly via static testing before any code is built.'
  },
  {
    id: 306,
    chapter: 3,
    k_level: 'K2',
    topic: 'Walkthrough vs Technical Review',
    question: 'What is a defining characteristic of a Walkthrough review?',
    options: [
      'It is led by the author to explain the work product and gather feedback',
      'It requires mandatory formal management sign-off and legal audit records',
      'It is led by an independent certified auditor without author attendance',
      'It evaluates only compiled C++ binary header files'
    ],
    correct_answer: 'It is led by the author to explain the work product and gather feedback',
    explanation: 'A Walkthrough is led by the author of the work product to guide participants through the document, explain context, and gather feedback.'
  },

  // Chapter 4 Retakes
  {
    id: 412,
    chapter: 4,
    k_level: 'K2',
    topic: 'Checklist-based Testing',
    question: 'In Checklist-based testing, how are test cases created and executed?',
    options: [
      'Testers design, implement, and execute tests to cover conditions listed in a checklist of rules or guidelines',
      'Checklists are generated by automated static code analyzers during build compilation',
      'Checklists replace formal test execution logging in safety-critical systems',
      'Checklist items must be executed in reverse alphabetical order'
    ],
    correct_answer: 'Testers design, implement, and execute tests to cover conditions listed in a checklist of rules or guidelines',
    explanation: 'In Checklist-based testing, testers use a high-level list of items, rules, or experience-based heuristics to guide their test coverage.'
  },
  {
    id: 413,
    chapter: 4,
    k_level: 'K3',
    topic: 'Boundary Value Analysis - 3-Value BVA Scenario',
    question: 'A password input field length constraint requires between 8 and 16 characters inclusive. Using 3-value Boundary Value Analysis for the lower boundary (8), which character length values must be tested?',
    options: [
      '7, 8, 9',
      '6, 8, 10',
      '8, 12, 16',
      '1, 8, 255'
    ],
    correct_answer: '7, 8, 9',
    explanation: 'In 3-value BVA around boundary min (8), we test the boundary value (8), the value immediately below (7), and the value immediately above (9).'
  },

  // Chapter 5 Retakes
  {
    id: 510,
    chapter: 5,
    k_level: 'K2',
    topic: 'Test Monitoring Metrics',
    question: 'Which metric provides the best insight into the overall progress of test execution during a test cycle?',
    options: [
      'Percentage of planned test cases executed, passed, failed, and blocked over time',
      'Total lines of developer code added per sprint',
      'Number of cups of coffee consumed by the test team',
      'Total size of test data files in gigabytes'
    ],
    correct_answer: 'Percentage of planned test cases executed, passed, failed, and blocked over time',
    explanation: 'Tracking execution status breakdown (passed, failed, blocked, unexecuted) over time is the standard metric for monitoring test execution progress.'
  },
  {
    id: 511,
    chapter: 5,
    k_level: 'K3',
    topic: 'Defect Lifecycle Analysis',
    question: 'A defect report was logged as "Open", investigated by developers who verified that the behavior matches the user story requirements, and marked as "Rejected - Not a Defect". What should the tester do next?',
    options: [
      'Verify the user story requirement; if verified correct, close the defect report with appropriate comments',
      'Re-open the defect report and escalate directly to the CEO',
      'Delete the user story from the product backlog',
      'Immediately modify the source code to match the bug report'
    ],
    correct_answer: 'Verify the user story requirement; if verified correct, close the defect report with appropriate comments',
    explanation: 'If a defect is rejected because the system operates according to specified requirements, the tester checks the specification and, if confirmed, closes the bug report with explanatory notes.'
  },

  // Chapter 6 Retakes
  {
    id: 603,
    chapter: 6,
    k_level: 'K2',
    topic: 'Test Automation Pilot Project',
    question: 'What is a primary purpose of conducting a pilot project before introducing a new test automation tool across an organization?',
    options: [
      'To learn detailed tool features, assess fit with existing processes, and evaluate ROI and maintenance overhead',
      'To replace all manual testers with immediate effect',
      'To verify that the tool requires zero training for team members',
      'To prove that commercial tools are always superior to open-source tools'
    ],
    correct_answer: 'To learn detailed tool features, assess fit with existing processes, and evaluate ROI and maintenance overhead',
    explanation: 'A pilot project assesses tool suitability, evaluates how it fits with existing architecture/processes, and determines realistic setup and maintenance costs.'
  }
];
