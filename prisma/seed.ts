
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding CSTU CSE Curriculum...')

    // ============ SPECIALIZATION TRACKS ============
    const tracks = [
        { name: "IoT & Embedded Systems", year: 4, skillBadges: "Arduino, Raspberry Pi, Sensors" },
        { name: "Virtual Systems & Services", year: 4, skillBadges: "Cloud Computing, Docker, Kubernetes" },
        { name: "Robotics", year: 4, skillBadges: "ROS, Kinematics, Control Systems" },
        { name: "Big Data Analytics", year: 4, skillBadges: "Hadoop, Spark, Data Mining" },
        { name: "Simulation & Modeling", year: 4, skillBadges: "Matlab, Simulink, Monte Carlo" },
        { name: "VLSI Design", year: 4, skillBadges: "Verilog, VHDL, FPGA" },
        { name: "Digital Signal Processing", year: 4, skillBadges: "Signal Processing, Filters, FFT" },
        { name: "Pattern Recognition", year: 4, skillBadges: "Image Processing, Classification" },
        { name: "Software Architecture", year: 4, skillBadges: "Design Patterns, Microservices" },
        { name: "Optical Communication", year: 4, skillBadges: "Photonics, Fiber Optics" },
        { name: "Human Computer Interaction", year: 4, skillBadges: "UX/UI, Usability Testing" },
        { name: "Introduction to Bioinformatics", year: 4, skillBadges: "Genomics, Proteomics" }
    ]

    for (const track of tracks) {
        // Generate simple ID
        const id = track.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

        await prisma.specializationTrack.upsert({
            where: { id },
            update: {},
            create: {
                id,
                name: track.name,
                year: track.year,
                skillBadges: track.skillBadges
            }
        })
    }

    // ============ COURSES ============
    const upsertCourse = async (data: any) => {
        return prisma.course.upsert({
            where: { courseCode: data.courseCode },
            update: { ...data },
            create: { ...data }
        })
    }

    const courses = [
        // Year 1 Semester 1
        { courseCode: "CSE 1101", courseTitle: "Structured Programming Language", credits: 3.0, semester: 1, year: 1, isTheory: true },
        { courseCode: "CSE 1102", courseTitle: "Structured Programming Sessional", credits: 1.5, semester: 1, year: 1, isTheory: false, isSessional: true },
        { courseCode: "CSE 1104", courseTitle: "Computer Fundamental & Ethics", credits: 0.75, semester: 1, year: 1, isTheory: true },
        { courseCode: "EEE 1101", courseTitle: "Introduction to Electrical Engineering", credits: 3.0, semester: 1, year: 1, department: "EEE" },
        { courseCode: "PHY 1121", courseTitle: "Physics", credits: 3.0, semester: 1, year: 1, department: "PHY" },
        { courseCode: "MATH 1121", courseTitle: "Differential/Integral Calculus", credits: 3.0, semester: 1, year: 1, department: "MATH" },
        { courseCode: "HSS 1121", courseTitle: "English", credits: 3.0, semester: 1, year: 1, department: "HSS" },

        // Year 1 Semester 2
        { courseCode: "CSE 1201", courseTitle: "Object Oriented Programming", credits: 3.0, semester: 2, year: 1 },
        { courseCode: "CSE 1202", courseTitle: "OOP Sessional", credits: 1.5, semester: 2, year: 1, isTheory: false, isSessional: true },
        { courseCode: "CSE 1203", courseTitle: "Discrete Mathematics", credits: 3.0, semester: 2, year: 1 },
        { courseCode: "CHEM 1221", courseTitle: "Chemistry", credits: 3.0, semester: 2, year: 1, department: "CHEM" },
        { courseCode: "MATH 1221", courseTitle: "ODE, PDE & Vector Calculus", credits: 3.0, semester: 2, year: 1, department: "MATH" },
        { courseCode: "ME 2121", courseTitle: "Basic Mechanical Engineering", credits: 3.0, semester: 2, year: 1, department: "ME" },
        { courseCode: "HSS 1221", courseTitle: "Bangladesh Studies", credits: 3.0, semester: 2, year: 1, department: "HSS" },

        // Year 2 Semester 1
        { courseCode: "CSE 2101", courseTitle: "Data Structures", credits: 3.0, semester: 3, year: 2 },
        { courseCode: "CSE 2102", courseTitle: "Data Structures Sessional", credits: 1.5, semester: 3, year: 2, isTheory: false, isSessional: true },
        { courseCode: "CSE 2103", courseTitle: "Digital Logic Design", credits: 3.0, semester: 3, year: 2 },
        { courseCode: "CSE 2104", courseTitle: "Digital Logic Design Sessional", credits: 0.75, semester: 3, year: 2, isTheory: false, isSessional: true },
        { courseCode: "CSE 2106", courseTitle: "Numerical Analysis", credits: 1.5, semester: 3, year: 2 },
        { courseCode: "EEE 2101", courseTitle: "Electronic Device & Circuit", credits: 3.0, semester: 3, year: 2, department: "EEE" },
        { courseCode: "MATH 2121", courseTitle: "Complex Variable & Statistics", credits: 3.0, semester: 3, year: 2, department: "MATH" },
        { courseCode: "HSS 2121", courseTitle: "Sociology", credits: 3.0, semester: 3, year: 2, department: "HSS" },

        // Year 2 Semester 2
        { courseCode: "CSE 2201", courseTitle: "Algorithm Design & Analysis", credits: 3.0, semester: 4, year: 2 },
        { courseCode: "CSE 2202", courseTitle: "Algorithm Design Sessional", credits: 1.5, semester: 4, year: 2, isTheory: false, isSessional: true },
        { courseCode: "CSE 2203", courseTitle: "Database Management System", credits: 3.0, semester: 4, year: 2 },
        { courseCode: "CSE 2204", courseTitle: "DBMS Sessional", credits: 0.75, semester: 4, year: 2, isTheory: false, isSessional: true },
        { courseCode: "CSE 2206", courseTitle: "Mobile App Development Project", credits: 1.5, semester: 4, year: 2, isTheory: false, isSessional: true },
        { courseCode: "EEE 2201", courseTitle: "Electrical Drives & Instrumentation", credits: 3.0, semester: 4, year: 2, department: "EEE" },
        { courseCode: "MATH 2221", courseTitle: "Linear Algebra, Laplace & Fourier", credits: 4.0, semester: 4, year: 2, department: "MATH" },
        { courseCode: "HSS 2221", courseTitle: "Business Law", credits: 3.0, semester: 4, year: 2, department: "HSS" },

        // Year 3 Semester 1
        { courseCode: "CSE 3101", courseTitle: "Information System Analysis & Design", credits: 3.0, semester: 5, year: 3 },
        { courseCode: "CSE 3102", courseTitle: "ISA&D Sessional", credits: 0.75, semester: 5, year: 3, isTheory: false, isSessional: true },
        { courseCode: "CSE 3103", courseTitle: "Computer Architecture", credits: 3.0, semester: 5, year: 3 },
        { courseCode: "CSE 3105", courseTitle: "Compiler Design", credits: 3.0, semester: 5, year: 3 },
        { courseCode: "CSE 3106", courseTitle: "Compiler Design Sessional", credits: 0.75, semester: 5, year: 3, isTheory: false, isSessional: true },
        { courseCode: "CSE 3107", courseTitle: "Data Communication", credits: 3.0, semester: 5, year: 3 },
        { courseCode: "CSE 3108", courseTitle: "Data Communication Sessional", credits: 0.75, semester: 5, year: 3, isTheory: false, isSessional: true },
        { courseCode: "CSE 3109", courseTitle: "Microprocessor & Assembly Language", credits: 3.0, semester: 5, year: 3 },
        { courseCode: "CSE 3110", courseTitle: "Microprocessor Sessional", credits: 0.75, semester: 5, year: 3, isTheory: false, isSessional: true },
        { courseCode: "HSS 3121", courseTitle: "Financial, Cost & Managerial Accounting", credits: 3.0, semester: 5, year: 3, department: "HSS" },

        // Year 3 Semester 2
        { courseCode: "CSE 3201", courseTitle: "Operating System", credits: 3.0, semester: 6, year: 3 },
        { courseCode: "CSE 3202", courseTitle: "OS Sessional", credits: 1.5, semester: 6, year: 3, isTheory: false, isSessional: true },
        { courseCode: "CSE 3203", courseTitle: "Computer Network", credits: 3.0, semester: 6, year: 3 },
        { courseCode: "CSE 3204", courseTitle: "Computer Network Sessional", credits: 1.5, semester: 6, year: 3, isTheory: false, isSessional: true },
        { courseCode: "CSE 3205", courseTitle: "Software Engineering", credits: 3.0, semester: 6, year: 3 },
        { courseCode: "CSE 3206", courseTitle: "Software Engineering Sessional", credits: 0.75, semester: 6, year: 3, isTheory: false, isSessional: true },
        { courseCode: "CSE 3207", courseTitle: "Theory of Computation", credits: 3.0, semester: 6, year: 3 },
        { courseCode: "CSE 3209", courseTitle: "Mathematical Analysis for CS", credits: 3.0, semester: 6, year: 3 },
        { courseCode: "HSS 3221", courseTitle: "Economics", credits: 3.0, semester: 6, year: 3, department: "HSS" },

        // Year 4 Semester 1
        { courseCode: "CSE 4101", courseTitle: "Artificial Intelligence", credits: 3.0, semester: 7, year: 4 },
        { courseCode: "CSE 4102", courseTitle: "AI Sessional", credits: 0.75, semester: 7, year: 4, isTheory: false, isSessional: true },
        { courseCode: "CSE 4103", courseTitle: "Machine Learning", credits: 3.0, semester: 7, year: 4 },
        { courseCode: "CSE 4104", courseTitle: "ML Sessional", credits: 0.75, semester: 7, year: 4, isTheory: false, isSessional: true },
        { courseCode: "CSE 4105", courseTitle: "Computer Graphics & Animation", credits: 3.0, semester: 7, year: 4 },
        { courseCode: "CSE 4106", courseTitle: "CG&A Sessional", credits: 0.75, semester: 7, year: 4, isTheory: false, isSessional: true },
        { courseCode: "CSE 4000", courseTitle: "Project/Thesis", credits: 3.0, semester: 7, year: 4, isTheory: false, isSessional: true },

        // Year 4 Semester 2
        { courseCode: "CSE 4201", courseTitle: "Cyber Security", credits: 3.0, semester: 8, year: 4 },
        { courseCode: "CSE 4202", courseTitle: "Cyber Security Sessional", credits: 0.75, semester: 8, year: 4, isTheory: false, isSessional: true },
        { courseCode: "CSE 4203", courseTitle: "Data Science", credits: 3.0, semester: 8, year: 4 },
        { courseCode: "IPE 4221", courseTitle: "Industrial Management", credits: 3.0, semester: 8, year: 4, department: "IPE" },
    ]

    console.log(`Seeding ${courses.length} courses...`)

    for (const course of courses) {
        await upsertCourse(course)
    }

    // Link Prerequisites
    const setPrereq = async (courseCode: string, prereqCode: string) => {
        try {
            const course = await prisma.course.findUnique({ where: { courseCode } })
            const prereq = await prisma.course.findUnique({ where: { courseCode: prereqCode } })

            if (course && prereq) {
                await prisma.course.update({
                    where: { id: course.id },
                    data: {
                        preRequisites: {
                            connect: { id: prereq.id }
                        }
                    }
                })
            }
        } catch (e: any) {
            console.error(`Error linking ${courseCode} -> ${prereqCode}`, e.message)
        }
    }

    // Basic chains
    await setPrereq("CSE 1201", "CSE 1101")
    await setPrereq("CSE 2101", "CSE 1201")
    await setPrereq("CSE 2201", "CSE 2101")

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
