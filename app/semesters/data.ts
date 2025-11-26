export interface Subject {
    code: string;
    title: string;
    credits: number;
    description: string;
    topics: string[];
}

export interface SemesterData {
    id: string; // "1st", "2nd", etc.
    title: string;
    description: string;
    subjects: Subject[];
}

export const semestersData: Record<string, SemesterData> = {
    '1st': {
        id: '1st',
        title: 'First Semester',
        description: 'Foundation of Computer Science and Mathematics',
        subjects: [
            {
                code: 'CS101',
                title: 'Introduction to Programming',
                credits: 3,
                description: 'Basics of problem-solving and programming using C/Python.',
                topics: ['Variables & Data Types', 'Control Structures', 'Functions', 'Arrays', 'Pointers']
            },
            {
                code: 'MATH101',
                title: 'Calculus I',
                credits: 3,
                description: 'Differential and Integral Calculus.',
                topics: ['Limits', 'Derivatives', 'Integrals', 'Applications of Calculus']
            },
            {
                code: 'PHY101',
                title: 'Physics',
                credits: 3,
                description: 'Fundamental physics concepts relevant to computing.',
                topics: ['Mechanics', 'Electromagnetism', 'Optics']
            },
            {
                code: 'ENG101',
                title: 'English Communication',
                credits: 2,
                description: 'Enhancing reading, writing, and speaking skills.',
                topics: ['Grammar', 'Technical Writing', 'Presentation Skills']
            }
        ]
    },
    '2nd': {
        id: '2nd',
        title: 'Second Semester',
        description: 'Core Data Structures and Logic',
        subjects: [
            {
                code: 'CS201',
                title: 'Data Structures',
                credits: 3,
                description: 'Study of data organization and manipulation.',
                topics: ['Linked Lists', 'Stacks & Queues', 'Trees', 'Graphs', 'Hashing']
            },
            {
                code: 'CS202',
                title: 'Digital Logic Design',
                credits: 3,
                description: 'Fundamentals of digital circuits and systems.',
                topics: ['Boolean Algebra', 'Logic Gates', 'Combinational Circuits', 'Sequential Circuits']
            },
            {
                code: 'MATH201',
                title: 'Discrete Mathematics',
                credits: 3,
                description: 'Mathematical structures fundamental to computer science.',
                topics: ['Sets', 'Relations', 'Functions', 'Graph Theory', 'Logic']
            }
        ]
    },
    '3rd': {
        id: '3rd',
        title: 'Third Semester',
        description: 'Algorithms and Object-Oriented Design',
        subjects: [
            {
                code: 'CS301',
                title: 'Design & Analysis of Algorithms',
                credits: 3,
                description: 'Advanced algorithm design techniques.',
                topics: ['Divide & Conquer', 'Dynamic Programming', 'Greedy Algorithms', 'Complexity Analysis']
            },
            {
                code: 'CS302',
                title: 'Object Oriented Programming',
                credits: 3,
                description: 'Programming using objects and classes (Java/C++).',
                topics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation']
            },
            {
                code: 'MATH301',
                title: 'Linear Algebra',
                credits: 3,
                description: 'Vector spaces and linear mappings.',
                topics: ['Matrices', 'Determinants', 'Eigenvalues', 'Vector Spaces']
            }
        ]
    },
    '4th': {
        id: '4th',
        title: 'Fourth Semester',
        description: 'Systems and Databases',
        subjects: [
            {
                code: 'CS401',
                title: 'Database Management Systems',
                credits: 3,
                description: 'Design and implementation of database systems.',
                topics: ['ER Modeling', 'SQL', 'Normalization', 'Transactions']
            },
            {
                code: 'CS402',
                title: 'Computer Architecture',
                credits: 3,
                description: 'Structure and behavior of computer systems.',
                topics: ['Instruction Sets', 'Processor Design', 'Memory Hierarchy', 'I/O Systems']
            },
            {
                code: 'STAT401',
                title: 'Probability & Statistics',
                credits: 3,
                description: 'Statistical methods for data analysis.',
                topics: ['Probability Theory', 'Distributions', 'Hypothesis Testing', 'Regression']
            }
        ]
    },
    '5th': {
        id: '5th',
        title: 'Fifth Semester',
        description: 'OS and Software Engineering',
        subjects: [
            {
                code: 'CS501',
                title: 'Operating Systems',
                credits: 3,
                description: 'Concepts and design of operating systems.',
                topics: ['Processes', 'Threads', 'Scheduling', 'Deadlocks', 'Memory Management']
            },
            {
                code: 'CS502',
                title: 'Software Engineering',
                credits: 3,
                description: 'Principles of software development life cycle.',
                topics: ['Requirements', 'Design Patterns', 'Testing', 'Agile Methodology']
            },
            {
                code: 'CS503',
                title: 'Computer Networks',
                credits: 3,
                description: 'Communication protocols and network architecture.',
                topics: ['OSI Model', 'TCP/IP', 'Routing', 'Switching', 'Network Security']
            }
        ]
    },
    '6th': {
        id: '6th',
        title: 'Sixth Semester',
        description: 'Web and AI',
        subjects: [
            {
                code: 'CS601',
                title: 'Web Technologies',
                credits: 3,
                description: 'Building modern web applications.',
                topics: ['HTML/CSS', 'JavaScript', 'React/Next.js', 'Backend APIs']
            },
            {
                code: 'CS602',
                title: 'Artificial Intelligence',
                credits: 3,
                description: 'Introduction to AI agents and search.',
                topics: ['Search Algorithms', 'Knowledge Representation', 'Machine Learning Basics']
            },
            {
                code: 'CS603',
                title: 'Theory of Computation',
                credits: 3,
                description: 'Mathematical models of computation.',
                topics: ['Automata', 'Context-Free Grammars', 'Turing Machines', 'Decidability']
            }
        ]
    },
    '7th': {
        id: '7th',
        title: 'Seventh Semester',
        description: 'Advanced Topics',
        subjects: [
            {
                code: 'CS701',
                title: 'Compiler Construction',
                credits: 3,
                description: 'Design and implementation of compilers.',
                topics: ['Lexical Analysis', 'Parsing', 'Semantic Analysis', 'Code Generation']
            },
            {
                code: 'CS702',
                title: 'Computer Graphics',
                credits: 3,
                description: 'Generation and manipulation of images.',
                topics: ['2D/3D Transformations', 'Rendering', 'Shading', 'OpenGL']
            },
            {
                code: 'CS703',
                title: 'Elective I',
                credits: 3,
                description: 'Specialized topic choice.',
                topics: ['Data Mining', 'Cloud Computing', 'Mobile Dev']
            }
        ]
    },
    '8th': {
        id: '8th',
        title: 'Eighth Semester',
        description: 'Final Project and Security',
        subjects: [
            {
                code: 'CS801',
                title: 'Information Security',
                credits: 3,
                description: 'Protecting information systems.',
                topics: ['Cryptography', 'Network Security', 'Cybersecurity']
            },
            {
                code: 'CS802',
                title: 'Final Year Project',
                credits: 6,
                description: 'Capstone project demonstrating comprehensive skills.',
                topics: ['Research', 'Implementation', 'Documentation', 'Presentation']
            },
            {
                code: 'CS803',
                title: 'Elective II',
                credits: 3,
                description: 'Advanced specialized topic.',
                topics: ['Big Data', 'Blockchain', 'IoT']
            }
        ]
    }
};
