// export const sampleChapters = [
//   {
//     id:12,  
//     name: "Introduction to Programming",
//     assignments: [],  // Will be filled with assignment ObjectIds after Assignment creation
//     courseId: "63456abcd1234567890efghi",  // Sample ObjectId for the associated Course
//   },
//   {
//     id:14,
//     name: "Data Structures",
//     assignments: [],
//     courseId: "63456abcd1234567890efghi",
//   },
//   {
//     id:26,
//     name: "Web Development Basics",
//     assignments: [],
//     courseId: "63456abcd1234567890efghi",
//   }
// ];

// export const UserLoggedIn={
//       username: "john_doe",
//       email: "john.doe@example.com",
//       password: "securepassword123", // Make sure to hash passwords in production
//       avatar: "http://example.com/avatar.jpg",
//       isVerified: true,
//       isAdmin: false,
//       Courses: [
//         {
//           courseId: "63456abcd1234567890efghi", 
//           enrolledAt: new Date("2024-10-07"),
//           color: "#FF5733", // Example color
//         },
//       ],
//       pendingAssignments: [
//         {
//           assignmentId: "29", // Replace with actual Assignment ObjectId
//           dueDate: new Date("2024-12-01"), // Example due date
//         },
//       ],
//       completedAssignments: [
//       //   {
//       //     assignmentId: new mongoose.Types.ObjectId(), // Replace with actual Assignment ObjectId
//       //     completedAt: new Date(),
//       //   },
//       ],
//       teams: [
//       //   {
//       //     teamId: new mongoose.Types.ObjectId(), // Replace with actual Team ObjectId
//       //     joinedAt: new Date(),
//       //   },
//       ],
//       pendingInvites: [
//       //   {
//       //     teamId: new mongoose.Types.ObjectId(), // Replace with actual Team ObjectId
//       //     invitedAt: new Date(),
//       //   },
//       ],
//       challengessolved: [
//       //   {
//       //     challengeId: new mongoose.Types.ObjectId(), // Replace with actual Challenge ObjectId
//       //     solvedAt: new Date(),
//       //   },
//       ],
//       submissions: [
//       //   new mongoose.Types.ObjectId(), // Replace with actual Submission ObjectId
//       ],
//       CoursesAsAdmin: [
//       //   new mongoose.Types.ObjectId(), // Replace with actual Course ObjectId
//       ],
//       tasks: [
//       //   new mongoose.Types.ObjectId(), // Replace with actual Task ObjectId
//       ],
//       phone: "123-456-7890",
//       gender: "Male",
//       Branch: "Computer Science",
//       forgotPasswordToken: null,
//       forgotPasswordTokenExpiry: null,
//       verifyToken: null,
//       verifyTokenExpiry: null,
    
// }
// export const sampleAssignments = [
//   {
//     id:29,
//     type:"submission",
//     title: "Assignment 1: Variables and Data Types",
//     description: "Introduction to data types and variables in programming.",
//     uploadedAt: new Date(),
//     DueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Due 1 week from now
//     AssignmentDoc: "path/to/assignment1.pdf",
//     Course: "63456abcd1234567890efghi", // Sample ObjectId for the associated Course
//     totalPoints: 10,
//     status: "Open",
//     submissions: [],  // Will be filled with submission ObjectIds if needed
//   },
//   {
//       id:24,
//       type:"normal",
//     title: "Assignment 2: Arrays and Strings",
//     description: "Understanding arrays, strings, and their operations.",
//     uploadedAt: new Date(),
//     DueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
//     AssignmentDoc: "path/to/assignment2.pdf",
//     Course: "63456abcd1234567890efghi",
//     totalPoints: 15,
//     status: "Open",
//     submissions: [],
//   },
//   {
//     id:35,
//     type:"submission",
//     title: "Assignment 3: Functions and Loops",
//     description: "Implement functions and control loops effectively.",
//     uploadedAt: new Date(),
//     DueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
//     AssignmentDoc: "path/to/assignment3.pdf",
//     Course: "63456abcd1234567890efghi",
//     totalPoints: 20,
//     status: "Open",
//     submissions: [],
//   }
// ];

export const dummyChallenges = [
  {
    _id: "challenge_1",
    title: "Challenge 1",
    description: "This is the description for Challenge 1",
    type: "individual",
    frequency: "daily",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    points: 10,
    createdBy: "User 1",
    courseId: "course_1",
    submissions: [],
  },
  {
    _id: "challenge_2",
    title: "Challenge 2",
    description: "This is the description for Challenge 2",
    type: "team",
    frequency: "weekly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 4)),
    points: 20,
    createdBy: "User 2",
    courseId: "course_2",
    submissions: [],
  },
  {
    _id: "challenge_3",
    title: "Challenge 3",
    description: "This is the description for Challenge 3",
    type: "individual",
    frequency: "monthly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 6)),
    points: 30,
    createdBy: "User 3",
    courseId: "course_3",
    submissions: [],
  },
  {
    _id: "challenge_4",
    title: "Challenge 4",
    description: "This is the description for Challenge 4",
    type: "team",
    frequency: "daily",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 8)),
    points: 40,
    createdBy: "User 4",
    courseId: "course_4",
    submissions: [],
  },
  {
    _id: "challenge_5",
    title: "Challenge 5",
    description: "This is the description for Challenge 5",
    type: "individual",
    frequency: "weekly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    points: 50,
    createdBy: "User 5",
    courseId: "course_5",
    submissions: [],
  },
  {
    _id: "challenge_6",
    title: "Challenge 6",
    description: "This is the description for Challenge 6",
    type: "team",
    frequency: "monthly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 12)),
    points: 60,
    createdBy: "User 6",
    courseId: "course_6",
    submissions: [],
  },
  {
    _id: "challenge_7",
    title: "Challenge 7",
    description: "This is the description for Challenge 7",
    type: "individual",
    frequency: "daily",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    points: 70,
    createdBy: "User 7",
    courseId: "course_7",
    submissions: [],
  },
  {
    _id: "challenge_8",
    title: "Challenge 8",
    description: "This is the description for Challenge 8",
    type: "team",
    frequency: "weekly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 16)),
    points: 80,
    createdBy: "User 8",
    courseId: "course_8",
    submissions: [],
  },
  {
    _id: "challenge_9",
    title: "Challenge 9",
    description: "This is the description for Challenge 9",
    type: "individual",
    frequency: "monthly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 18)),
    points: 90,
    createdBy: "User 9",
    courseId: "course_9",
    submissions: [],
  },
  {
    _id: "challenge_10",
    title: "Challenge 10",
    description: "This is the description for Challenge 10",
    type: "team",
    frequency: "daily",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 20)),
    points: 100,
    createdBy: "User 10",
    courseId: "course_10",
    submissions: [],
  },
];

export  const dummyUsers = [
  { _id: "user_1", username: "user_1", email: "user1@example.com", isVerified: true, isAdmin: false },
  { _id: "user_2", username: "user_2", email: "user2@example.com", isVerified: false, isAdmin: false },
  { _id: "user_3", username: "user_3", email: "user3@example.com", isVerified: true, isAdmin: true },
  { _id: "user_4", username: "user_4", email: "user4@example.com", isVerified: true, isAdmin: false },
  { _id: "user_5", username: "user_5", email: "user5@example.com", isVerified: false, isAdmin: false },
  { _id: "user_6", username: "user_6", email: "user6@example.com", isVerified: true, isAdmin: false },
  { _id: "user_7", username: "user_7", email: "user7@example.com", isVerified: false, isAdmin: true },
  { _id: "user_8", username: "user_8", email: "user8@example.com", isVerified: true, isAdmin: false },
  { _id: "user_9", username: "user_9", email: "user9@example.com", isVerified: false, isAdmin: false },
  { _id: "user_10", username: "user_10", email: "user10@example.com", isVerified: true, isAdmin: false },
];



export  const dummyAssignments = [
  {
    _id: "assignment_1",
    title: "Assignment 1",
    description: "This is the detailed description for Assignment 1",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    AssignmentDoc: "link/to/document1.pdf",
    totalPoints: 10,
    status: "Open",
  },
  {
    _id: "assignment_2",
    title: "Assignment 2",
    description: "This is the detailed description for Assignment 2",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 6)),
    AssignmentDoc: "link/to/document2.pdf",
    totalPoints: 20,
    status: "Closed",
  },
  {
    _id: "assignment_3",
    title: "Assignment 3",
    description: "This is the detailed description for Assignment 3",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    AssignmentDoc: "link/to/document3.pdf",
    totalPoints: 30,
    status: "Graded",
  },
  {
    _id: "assignment_4",
    title: "Assignment 4",
    description: "This is the detailed description for Assignment 4",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 4)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 8)),
    AssignmentDoc: "link/to/document4.pdf",
    totalPoints: 40,
    status: "Open",
  },
  {
    _id: "assignment_5",
    title: "Assignment 5",
    description: "This is the detailed description for Assignment 5",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 9)),
    AssignmentDoc: "link/to/document5.pdf",
    totalPoints: 50,
    status: "Closed",
  },
  {
    _id: "assignment_6",
    title: "Assignment 6",
    description: "This is the detailed description for Assignment 6",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 6)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    AssignmentDoc: "link/to/document6.pdf",
    totalPoints: 60,
    status: "Graded",
  },
  {
    _id: "assignment_7",
    title: "Assignment 7",
    description: "This is the detailed description for Assignment 7",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 7)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 11)),
    AssignmentDoc: "link/to/document7.pdf",
    totalPoints: 70,
    status: "Open",
  },
  {
    _id: "assignment_8",
    title: "Assignment 8",
    description: "This is the detailed description for Assignment 8",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 8)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 12)),
    AssignmentDoc: "link/to/document8.pdf",
    totalPoints: 80,
    status: "Closed",
  },
  {
    _id: "assignment_9",
    title: "Assignment 9",
    description: "This is the detailed description for Assignment 9",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 9)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 13)),
    AssignmentDoc: "link/to/document9.pdf",
    totalPoints: 90,
    status: "Graded",
  },
  {
    _id: "assignment_10",
    title: "Assignment 10",
    description: "This is the detailed description for Assignment 10",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    AssignmentDoc: "link/to/document10.pdf",
    totalPoints: 100,
    status: "Open",
  },
];

export const institutes = [
  "Indian Institute of Technology Madras",
  "Indian Institute of Technology Delhi",
  "Indian Institute of Technology Bombay",
  "Indian Institute of Technology Kanpur",
  "Indian Institute of Technology Kharagpur",
  "Indian Institute of Technology Roorkee",
  "Indian Institute of Technology Guwahati",
  "Indian Institute of Technology Hyderabad",
  "National Institute of Technology Tiruchirappalli",
  "Indian Institute of Technology Indore",
  "Indian Institute of Technology (BHU) Varanasi",
  "National Institute of Technology Karnataka, Surathkal",
  "Jadavpur University",
  "Vellore Institute of Technology",
  "Indian Institute of Technology Ropar",
  "National Institute of Technology Rourkela",
  "Institute of Chemical Technology",
  "Amrita Vishwa Vidyapeetham",
  "Indian Institute of Technology Dhanbad",
  "National Institute of Technology Warangal",
  "Motilal Nehru National Institute Of Technology Allahabad",
  "Thapar Institute of Engineering and Technology",
  "Jamia Millia Islamia",
  "Amity University Noida",
  "National Institute of Technology Calicut",
  "S.R.M. Institute of Science and Technology",
  "Shanmugha Arts Science Technology & Research Academy",
  "Manipal Institute of Technology",
  "Indian Institute of Technology Bhubaneswar",
  "Indian Institute of Technology Gandhinagar",
  "National Institute of Technology Silchar",
  "Siksha `O` Anusandhan",
  "National Institute of Technology Durgapur",
  "Indian Institute of Technology Mandi",
  "PSG College of Technology",
  "Birla Institute of Technology & Science, Pilani",
  "Visvesvaraya National Institute of Technology",
  "International Institute of Information Technology Hyderabad",
  "National Institute of Technology Kurukshetra",
  "Aligarh Muslim University",
  "College of Engineering Pune",
  "Lovely Professional University",
  "Sardar Vallabhbhai National Institute of Technology, Surat",
  "Jawaharlal Nehru Technological University Hyderabad",
  "University College of Engineering, Osmania University",
  "Delhi Technological University",
  "B.M.S. College of Engineering",
  "National Institute of Technology Meghalaya",
  "Kalashalingam Academy of Research and Higher Education",
  "Bharati Vidyapeeth Deemed University College of Engineering",
  "Sri Sivasubramaniya Nadar College of Engineering",
  "Birla Institute of Technology",
  "Koneru Lakshmaiah Education Foundation University",
  "National Institute of Technology Raipur",
  "Indian Institute of Space Science and Technology",
  "Sathyabama Institute of Science and Technology",
  "Kalinga Institute of Industrial Technology",
  "R.V. College of Engineering",
  "Chandigarh University",
  "Saveetha Institute of Medical and Technical Sciences",
  "GITAM",
  "Dr. B. R. Ambedkar National Institute of Technology",
  "Shiv Nadar University",
  "M S Ramaiah Institute of Technology",
  "Veermata Jijabai Technological Institute",
  "University of Petroleum and Energy Studies",
  "Acharya Institute of Technology",
  "JSS Science and Technology University",
  "SASTRA",
  "Harcourt Butler Technical University",
  "The LNM Institute of Information Technology",
  "Dayananda Sagar College of Engineering",
  "Panjab University",
  "C V Raman Global University",
  "National Institute of Technology Hamirpur",
  "Sikkim Manipal Institute of Technology",
  "Nirma University",
  "Kumaraguru College of Technology",
  "Rajalakshmi Engineering College",
  "National Institute of Technology Goa",
  "MIT World Peace University",
  "National Institute of Technology Agartala",
  "National Institute of Technology Jamshedpur",
  "Thiagarajar College of Engineering",
  "National Institute of Technology Arunachal Pradesh",
  "Hindustan Institute of Technology and Science",
  "Reva University",
  "Alliance University",
  "National Institute of Technology Manipur",
  "National Institute of Technology Mizoram",
  "Siddaganga Institute of Technology",
  "Indian Institute of Information Technology Allahabad",
  "Indraprastha Institute of Information Technology Delhi",
  "Indian Institute of Engineering Science and Technology Shibpur",
  "Jaypee Institute of Information Technology",
  "Guru Nanak Dev Engineering College",
  "National Institute of Technology Nagaland",
  "Amity School of Engineering and Technology",
  "Maharaja Sayajirao University of Baroda",
  "Indian Institute of Information Technology Guwahati",
  "Institute of Technology, Nirma University",
  "Government College of Engineering, Aurangabad",
  "PES University",
  "National Institute of Technology Uttarakhand",
  "Government College of Engineering and Research, Avasari Khurd",
  "Anil Neerukonda Institute of Technology and Sciences",
  "Rajagiri School of Engineering & Technology"
];

export const sampleChapters = [
  {
    id:12,  
    name: "Introduction to Programming",
    assignments: [],  // Will be filled with assignment ObjectIds after Assignment creation
    courseId: "63456abcd1234567890efghi",  // Sample ObjectId for the associated Course
  },
  {
    id:14,
    name: "Data Structures",
    assignments: [],
    courseId: "63456abcd1234567890efghi",
  },
  {
    id:26,
    name: "Web Development Basics",
    assignments: [],
    courseId: "63456abcd1234567890efghi",
  }
];

export const UserLoggedIn={
      username: "john_doe",
      email: "john.doe@example.com",
      password: "securepassword123", // Make sure to hash passwords in production
      avatar: "http://example.com/avatar.jpg",
      isVerified: true,
      isAdmin: false,
      Courses: [
        {
          courseId: "63456abcd1234567890efghi", 
          enrolledAt: new Date("2024-10-07"),
          color: "#FF5733", // Example color
        },
      ],
      pendingAssignments: [
        {
          assignmentId: "29", // Replace with actual Assignment ObjectId
          dueDate: new Date("2024-12-01"), // Example due date
        },
      ],
      completedAssignments: [
      //   {
      //     assignmentId: new mongoose.Types.ObjectId(), // Replace with actual Assignment ObjectId
      //     completedAt: new Date(),
      //   },
      ],
      teams: [
      //   {
      //     teamId: new mongoose.Types.ObjectId(), // Replace with actual Team ObjectId
      //     joinedAt: new Date(),
      //   },
      ],
      pendingInvites: [
      //   {
      //     teamId: new mongoose.Types.ObjectId(), // Replace with actual Team ObjectId
      //     invitedAt: new Date(),
      //   },
      ],
      challengessolved: [
      //   {
      //     challengeId: new mongoose.Types.ObjectId(), // Replace with actual Challenge ObjectId
      //     solvedAt: new Date(),
      //   },
      ],
      submissions: [
      //   new mongoose.Types.ObjectId(), // Replace with actual Submission ObjectId
      ],
      CoursesAsAdmin: [
      //   new mongoose.Types.ObjectId(), // Replace with actual Course ObjectId
      ],
      tasks: [
      //   new mongoose.Types.ObjectId(), // Replace with actual Task ObjectId
      ],
      phone: "123-456-7890",
      gender: "Male",
      Branch: "Computer Science",
      forgotPasswordToken: null,
      forgotPasswordTokenExpiry: null,
      verifyToken: null,
      verifyTokenExpiry: null,
    
}
export const sampleAssignments = [
  {
    id:29,
    type:"submission",
    title: "Assignment 1: Variables and Data Types",
    description: "Introduction to data types and variables in programming.",
    uploadedAt: new Date(),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Due 1 week from now
    AssignmentDoc: "path/to/assignment1.pdf",
    Course: "63456abcd1234567890efghi", // Sample ObjectId for the associated Course
    totalPoints: 10,
    status: "Open",
    submissions: [],  // Will be filled with submission ObjectIds if needed
  },
  {
      id:24,
      type:"normal",
    title: "Assignment 2: Arrays and Strings",
    description: "Understanding arrays, strings, and their operations.",
    uploadedAt: new Date(),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    AssignmentDoc: "path/to/assignment2.pdf",
    Course: "63456abcd1234567890efghi",
    totalPoints: 15,
    status: "Open",
    submissions: [],
  },
  {
    id:35,
    type:"submission",
    title: "Assignment 3: Functions and Loops",
    description: "Implement functions and control loops effectively.",
    uploadedAt: new Date(),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    AssignmentDoc: "path/to/assignment3.pdf",
    Course: "63456abcd1234567890efghi",
    totalPoints: 20,
    status: "Open",
    submissions: [],
  }
];


export const tasks = [
  {
    _id: "64a8b2c2cfa9a12a0d1f68b9",
    title: "Complete Project Report",
    description: "Write the final project report and submit it.",
    completed: false,
    color: "blue",
    course: "Computer Science",
    progress: 50,
    deadline: "2024-11-10T18:30:00.000Z",
    createdAt: "2024-10-01T10:15:00.000Z",
    updatedAt: "2024-10-15T10:15:00.000Z",
  },
  {
    _id: "64a8b2c2cfa9a12a0d1f68c1",
    title: "Study for Midterms",
    description: "Revise chapters 4-7 for the midterm exam.",
    completed: false,
    color: "green",
    course: "Mathematics",
    progress: 30,
    deadline: "2024-11-05T18:30:00.000Z",
    createdAt: "2024-10-05T09:00:00.000Z",
    updatedAt: "2024-10-20T09:00:00.000Z",
  },
  {
    _id: "64a8b2c2cfa9a12a0d1f68c2",
    title: "Finish Lab Assignment",
    description: "Complete and submit the lab assignment on arrays.",
    completed: true,
    color: "red",
    course: "Data Structures",
    progress: 100,
    deadline: "2024-10-18T18:30:00.000Z",
    createdAt: "2024-10-01T08:00:00.000Z",
    updatedAt: "2024-10-18T08:00:00.000Z",
  },
  {
    _id: "64a8b2c2cfa9a12a0d1f68c3",
    title: "Research Paper Summary",
    description: "Summarize the key findings of the research paper.",
    completed: false,
    color: "purple",
    course: "Artificial Intelligence",
    progress: 70,
    deadline: "2024-11-12T18:30:00.000Z",
    createdAt: "2024-10-20T09:30:00.000Z",
    updatedAt: "2024-10-30T09:30:00.000Z",
  },
  {
    _id: "64a8b2c2cfa9a12a0d1f68c4",
    title: "Complete Coding Challenge",
    description: "Solve the weekly coding challenge on LeetCode.",
    completed: false,
    color: "orange",
    course: "Competitive Programming",
    progress: 40,
    deadline: "2024-11-04T18:30:00.000Z",
    createdAt: "2024-10-22T11:15:00.000Z",
    updatedAt: "2024-10-25T11:15:00.000Z",
  },
  {
    _id: "64a8b2c2cfa9a12a0d1f68c5",
    title: "Read Book Chapter",
    description: "Read Chapter 5 of the course textbook.",
    completed: true,
    color: "yellow",
    course: "Philosophy",
    progress: 100,
    deadline: "2024-10-22T18:30:00.000Z",
    createdAt: "2024-10-10T08:15:00.000Z",
    updatedAt: "2024-10-22T08:15:00.000Z",
  },
  {
    _id: "64a8b2c2cfa9a12a0d1f68c6",
    title: "Prepare Presentation",
    description: "Prepare slides for the group presentation.",
    completed: false,
    color: "teal",
    course: "Business Studies",
    progress: 60,
    deadline: "2024-11-08T18:30:00.000Z",
    createdAt: "2024-10-14T12:00:00.000Z",
    updatedAt: "2024-10-26T12:00:00.000Z",
  },
  {
    _id: "64a8b2c2cfa9a12a0d1f68c7",
    title: "Quiz Preparation",
    description: "Prepare for the upcoming quiz on algorithms.",
    completed: false,
    color: "pink",
    course: "Algorithms",
    progress: 20,
    deadline: "2024-11-06T18:30:00.000Z",
    createdAt: "2024-10-25T07:45:00.000Z",
    updatedAt: "2024-10-31T07:45:00.000Z",
  },
  {
    _id: "64a8b2c2cfa9a12a0d1f68c8",
    title: "Review Lecture Notes",
    description: "Go over notes from last week's lectures.",
    completed: false,
    color: "brown",
    course: "Chemistry",
    progress: 10,
    deadline: "2024-11-03T18:30:00.000Z",
    createdAt: "2024-10-27T10:00:00.000Z",
    updatedAt: "2024-10-29T10:00:00.000Z",
  },
  {
    _id: "64a8b2c2cfa9a12a0d1f68c9",
    title: "Complete Homework",
    description: "Finish homework exercises for the next class.",
    completed: true,
    color: "gray",
    course: "Physics",
    progress: 100,
    deadline: "2024-10-30T18:30:00.000Z",
    createdAt: "2024-10-16T13:20:00.000Z",
    updatedAt: "2024-10-30T13:20:00.000Z",
  },
];

const demoChallenges = [
  {
    _id: "607d1f77bcf86cd799439011", // Unique identifier for the challenge (string format)
    title: "30 Days of Code",
    description: "Complete a coding challenge every day for 30 days.",
    type: "individual", // Type of challenge (individual or team)
    frequency: "daily", // Frequency of the challenge
    startDate: "2024-11-01", // Start date of the challenge (string format)
    endDate: "2024-11-30", // End date of the challenge (string format)
    points: "100", // Points awarded for participation/completion (string format)
    participants: ["607d1f77bcf86cd799439012"], // Array of participant IDs (string format)
    createdBy: "607d1f77bcf86cd799439013", // ID of the user who created the challenge (string format)
    createdAt: "2024-11-01T00:00:00Z", // Timestamp for when the challenge was created (string format)
    updatedAt: "2024-11-01T00:00:00Z", // Timestamp for when the challenge was last updated (string format)
  },
  {
    _id: "607d1f77bcf86cd799439014",
    title: "Weekly Fitness Challenge",
    description: "Engage in physical activities for at least 30 minutes every day for a week.",
    type: "team",
    frequency: "weekly",
    startDate: "2024-11-05",
    endDate: "2024-11-12",
    points: "200",
    participants: ["607d1f77bcf86cd799439015", "607d1f77bcf86cd799439016"], // Multiple participants
    createdBy: "607d1f77bcf86cd799439017",
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    _id: "607d1f77bcf86cd799439018",
    title: "Custom Reading Challenge",
    description: "Read at least 5 books this month and share reviews.",
    type: "individual",
    frequency: "custom",
    startDate: "2024-11-01",
    endDate: "2024-11-30",
    points: "150",
    participants: ["607d1f77bcf86cd799439019"],
    createdBy: "607d1f77bcf86cd799439020",
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    _id: "607d1f77bcf86cd799439021",
    title: "Photography Contest",
    description: "Submit your best photo taken during the month.",
    type: "individual",
    frequency: "custom",
    startDate: "2024-11-01",
    endDate: "2024-11-30",
    points: "300",
    participants: ["607d1f77bcf86cd799439022"],
    createdBy: "607d1f77bcf86cd799439023",
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    _id: "607d1f77bcf86cd799439024",
    title: "Team Coding Hackathon",
    description: "Participate in a 48-hour hackathon and develop a project.",
    type: "team",
    frequency: "custom",
    startDate: "2024-11-15",
    endDate: "2024-11-17",
    points: "500",
    participants: ["607d1f77bcf86cd799439025", "607d1f77bcf86cd799439026", "607d1f77bcf86cd799439027"],
    createdBy: "607d1f77bcf86cd799439028",
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  }
];

export default demoChallenges;


export const Badges = [
  { title: 'Top Performer', description: 'Awarded for outstanding performance' ,photo:"Mafia.png"},
  { title: 'Consistent Contributor', description: 'Awarded for completing tasks consistently',photo:"Panther.png" },
  { title: 'Streak Holder', description: 'Awarded for maintaining a long task streak',photo:"Phoenix.png" },
  { title: 'Early Bird', description: 'Awarded for completing tasks ahead of deadline',photo:"Phantom.png"},
  { title: 'Task Master', description: 'Awarded for managing and completing multiple tasks efficiently',photo:"Mafia.png"  },
  { title: 'Innovator', description: 'Awarded for creative problem-solving',photo:"Mafia.png" },
  { title: 'Helper', description: 'Awarded for assisting peers with their tasks',photo:"Panther.png"  },
  { title: 'Team Player', description: 'Awarded for contributing to team projects successfully',photo:"Phoenix.png"  },
  { title: 'Time Keeper', description: 'Awarded for punctuality and timeliness in task submission',photo:"Phantom.png" },
  { title: 'Goal Setter', description: 'Awarded for setting and achieving personal goals',photo:"Mafia.png" },
  { title: 'Milestone Achiever', description: 'Awarded for reaching significant milestones',photo:"Panther.png"  },
  { title: 'High Achiever', description: 'Awarded for achieving a high success rate in tasks',photo:"Phoenix.png"  },
  { title: 'Quick Learner', description: 'Awarded for adapting and learning new skills quickly',photo:"Phantom.png" },
  { title: 'Problem Solver', description: 'Awarded for resolving complex challenges effectively',photo:"Mafia.png" },
  { title: 'Quality Contributor', description: 'Awarded for maintaining high standards in work',photo:"Panther.png"  },
  { title: 'Efficiency Expert', description: 'Awarded for completing tasks quickly and efficiently',photo:"Phoenix.png"  },
  { title: 'Collaborator', description: 'Awarded for excellent collaboration in team tasks',photo:"Panther.png" },
  { title: 'Mentor', description: 'Awarded for guiding others and sharing knowledge',photo:"Phantom.png" },
  { title: 'Focus Champion', description: 'Awarded for sustained focus during work',photo:"Mafia.png" },
  { title: 'Leadership Star', description: 'Awarded for demonstrating leadership qualities',photo:"Panther.png"  },
];


export const cardsData = [
  {
    id: 0,
    title: "To-Do",
    components: [
      {
        id: 100,
        title: "material ui",
        completed: false,
        dueDate: "2024-11-10",
        course: "Web Development",
      },
      {
        id: 200,
        title: "bootstrap",
        completed: false,
        dueDate: "2024-11-12",
        course: "Web Design",
      },
    ],
  },
  {
    id: 1,
    title: "Completed",
    components: [
      {
        id: 500,
        title: "redux",
        completed: true,
        dueDate: "2024-10-25",
        course: "State Management",
      },
      {
        id: 600,
        title: "recoil",
        completed: true,
        dueDate: "2024-10-30",
        course: "State Management",
      },
    ],
  },
];

