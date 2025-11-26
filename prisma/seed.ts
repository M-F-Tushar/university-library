import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    const student = await prisma.user.upsert({
        where: { email: 'student@example.com' },
        update: {},
        create: {
            email: 'student@example.com',
            name: 'Student User',
            password: hashedPassword,
            role: 'STUDENT',
        },
    });

    console.log({ admin, student });

    // 1. Digital Books
    const books = [
        {
            title: 'Introduction to Algorithms',
            author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
            year: 2009,
            format: 'PDF',
            description: 'Comprehensive guide to algorithms, covering a broad range of algorithms in depth.',
            category: 'Books',
            department: 'Computer Science',
            course: 'CS201',
            semester: '2nd',
            tags: 'algorithms, data structures, cormen',
            coverImage: 'https://m.media-amazon.com/images/I/61Mw06xul8L._AC_UF1000,1000_QL80_.jpg',
            externalUrl: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/',
        },
        {
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            year: 2008,
            format: 'ePub',
            description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
            category: 'Books',
            department: 'Software Engineering',
            course: 'SE301',
            semester: '3rd',
            tags: 'software engineering, clean code, agile',
            coverImage: 'https://m.media-amazon.com/images/I/51E2055ZGUL._AC_UF1000,1000_QL80_.jpg',
            externalUrl: 'https://www.oreilly.com/library/view/clean-code-a/9780132350884/',
        },
        {
            title: 'Artificial Intelligence: A Modern Approach',
            author: 'Stuart Russell, Peter Norvig',
            year: 2020,
            format: 'PDF',
            description: 'The most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence.',
            category: 'Books',
            department: 'Computer Science',
            course: 'CS401',
            semester: '4th',
            tags: 'ai, artificial intelligence, machine learning',
            coverImage: 'https://m.media-amazon.com/images/I/81-QB7nDh4L.jpg',
            externalUrl: 'http://aima.cs.berkeley.edu/',
        }
    ];

    for (const book of books) {
        await prisma.resource.create({ data: book });
    }

    // 2. Academic Articles & Research Papers
    const papers = [
        {
            title: 'Attention Is All You Need',
            author: 'Ashish Vaswani et al.',
            year: 2017,
            format: 'PDF',
            description: 'The paper that introduced the Transformer model, revolutionizing NLP.',
            abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
            category: 'Papers',
            department: 'Computer Science',
            tags: 'nlp, transformer, deep learning, ai',
            externalUrl: 'https://arxiv.org/abs/1706.03762',
        },
        {
            title: 'A Relational Model of Data for Large Shared Data Banks',
            author: 'E. F. Codd',
            year: 1970,
            format: 'PDF',
            description: 'Seminal paper introducing the relational database model.',
            abstract: 'Future users of large data banks must be protected from having to know how the data is organized in the machine (the internal representation). A prompting service which supplies such information is not a satisfactory solution.',
            category: 'Papers',
            department: 'Computer Science',
            tags: 'database, sql, relational model',
            externalUrl: 'https://dl.acm.org/doi/10.1145/362384.362685',
        }
    ];

    for (const paper of papers) {
        await prisma.resource.create({ data: paper });
    }

    // 3. Past Questions
    const questions = [
        {
            title: 'Data Structures Midterm 2023',
            year: 2023,
            format: 'PDF',
            description: 'Midterm examination questions for CS201 Data Structures.',
            category: 'Questions',
            department: 'Computer Science',
            course: 'CS201',
            semester: '2nd',
            tags: 'exam, midterm, data structures',
        },
        {
            title: 'Operating Systems Final 2022',
            year: 2022,
            format: 'PDF',
            description: 'Final examination questions for CS302 Operating Systems.',
            category: 'Questions',
            department: 'Computer Science',
            course: 'CS302',
            semester: '3rd',
            tags: 'exam, final, os',
        }
    ];

    for (const question of questions) {
        await prisma.resource.create({ data: question });
    }

    // 4. Lecture Notes
    const notes = [
        {
            title: 'Introduction to Python Programming Slides',
            author: 'Prof. Alan Turing',
            year: 2024,
            format: 'PPT',
            description: 'Lecture slides covering variables, loops, and functions in Python.',
            category: 'Notes',
            department: 'Computer Science',
            course: 'CS101',
            semester: '1st',
            tags: 'python, programming, slides',
        },
        {
            title: 'Graph Theory Notes',
            author: 'Prof. Ada Lovelace',
            year: 2024,
            format: 'PDF',
            description: 'Handwritten notes on graph algorithms: BFS, DFS, Dijkstra.',
            category: 'Notes',
            department: 'Mathematics',
            course: 'MATH202',
            semester: '2nd',
            tags: 'math, graphs, algorithms',
        }
    ];

    for (const note of notes) {
        await prisma.resource.create({ data: note });
    }

    // Site Settings
    const siteSettings = [
        // Hero Section
        { key: 'hero_title_line1', value: 'CS Student', category: 'hero', type: 'text', description: 'First line of hero title' },
        { key: 'hero_title_line2', value: 'Digital Library', category: 'hero', type: 'text', description: 'Second line of hero title' },
        { key: 'hero_subtitle', value: 'Master algorithms, data structures, and software engineering with our curated resources.', category: 'hero', type: 'text', description: 'Hero subtitle text' },
        { key: 'hero_badge_text', value: 'For CS Students By CS Students', category: 'hero', type: 'text', description: 'Badge text in hero section' },
        { key: 'hero_cta1_text', value: 'Browse Resources', category: 'hero', type: 'text', description: 'Primary CTA button text' },
        { key: 'hero_cta1_link', value: '/resources', category: 'hero', type: 'text', description: 'Primary CTA button link' },
        { key: 'hero_cta2_text', value: 'Get Started', category: 'hero', type: 'text', description: 'Secondary CTA button text' },
        { key: 'hero_cta2_link', value: '/register', category: 'hero', type: 'text', description: 'Secondary CTA button link' },

        // Stats Section
        { key: 'stat_resources_label', value: 'Resources', category: 'stats', type: 'text', description: 'Label for resources count' },
        { key: 'stat_students_label', value: 'Developers', category: 'stats', type: 'text', description: 'Label for students count' },
        { key: 'stat_access_number', value: '24/7', category: 'stats', type: 'text', description: 'Access availability text' },
        { key: 'stat_access_label', value: 'Access', category: 'stats', type: 'text', description: 'Label for access stat' },

        // Features Section
        { key: 'features_title', value: 'Level Up Your Coding Skills', category: 'features', type: 'text', description: 'Features section title' },
        { key: 'features_subtitle', value: 'Resources tailored for your Computer Science journey', category: 'features', type: 'text', description: 'Features section subtitle' },

        // Site Metadata
        { key: 'site_title', value: 'CS Student Library', category: 'general', type: 'text', description: 'Website title' },
        { key: 'site_meta_description', value: 'Resources, code snippets, and algorithms for Computer Science students.', category: 'general', type: 'text', description: 'Meta description for SEO' },
        { key: 'site_name', value: 'UniLibrary', category: 'general', type: 'text', description: 'Site name displayed in navbar' },

        // Footer
        { key: 'footer_description', value: 'Your comprehensive resource hub for Computer Science education.', category: 'footer', type: 'text', description: 'Footer description text' },
        { key: 'footer_copyright', value: '© 2024 CS Student Library. All rights reserved.', category: 'footer', type: 'text', description: 'Copyright text' },
    ];

    for (const setting of siteSettings) {
        await prisma.siteSettings.upsert({
            where: { key: setting.key },
            update: {},
            create: {
                ...setting,
                updatedBy: admin.id,
            },
        });
    }

    // Categories
    const categories = [
        { name: 'Books', description: 'Digital textbooks and reference books', icon: 'BookOpenIcon', color: 'bg-blue-100 text-blue-800 border-blue-200', order: 1 },
        { name: 'Papers', description: 'Research papers and academic articles', icon: 'DocumentTextIcon', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', order: 2 },
        { name: 'Questions', description: 'Past exam questions and practice problems', icon: 'AcademicCapIcon', color: 'bg-violet-100 text-violet-800 border-violet-200', order: 3 },
        { name: 'Notes', description: 'Lecture notes and study materials', icon: 'DocumentTextIcon', color: 'bg-purple-100 text-purple-800 border-purple-200', order: 4 },
        { name: 'Slides', description: 'Presentation slides and lecture materials', icon: 'PresentationChartBarIcon', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', order: 5 },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
    }

    // Departments
    const departments = [
        { name: 'Computer Science', code: 'CS', order: 1 },
        { name: 'Software Engineering', code: 'SE', order: 2 },
        { name: 'Mathematics', code: 'MATH', order: 3 },
        { name: 'Information Technology', code: 'IT', order: 4 },
    ];

    for (const department of departments) {
        await prisma.department.upsert({
            where: { name: department.name },
            update: {},
            create: department,
        });
    }

    // Formats
    const formats = [
        { name: 'PDF', extension: 'pdf', mimeType: 'application/pdf', order: 1 },
        { name: 'ePub', extension: 'epub', mimeType: 'application/epub+zip', order: 2 },
        { name: 'PPT', extension: 'ppt', mimeType: 'application/vnd.ms-powerpoint', order: 3 },
        { name: 'PPTX', extension: 'pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', order: 4 },
        { name: 'DOC', extension: 'doc', mimeType: 'application/msword', order: 5 },
        { name: 'DOCX', extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', order: 6 },
    ];

    for (const format of formats) {
        await prisma.format.upsert({
            where: { name: format.name },
            update: {},
            create: format,
        });
    }

    console.log('✅ Seeded CS Resources, Categories, Departments, and Formats');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
