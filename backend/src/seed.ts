import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const skillsData = [
    'React', 'TypeScript', 'Node.js', 'Python', 'JavaScript',
    'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB',
    'Express', 'GraphQL', 'REST API', 'CI/CD', 'Git'
];

const candidatesData = [
    {
        name: 'Alex Johnson',
        position: 'Senior Full Stack Developer',
        status: 'active',
        email: 'alex.johnson@example.com',
        phone: '+1-555-0101',
        description: 'Experienced developer with 5+ years in React and Node.js, passionate about building scalable applications',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS']
    },
    {
        name: 'Maria Garcia',
        position: 'Frontend Developer',
        status: 'interview',
        email: 'maria.garcia@example.com',
        phone: '+1-555-0102',
        description: 'Specializes in creating modern UIs with React and TypeScript, strong focus on user experience',
        skills: ['React', 'TypeScript', 'JavaScript', 'REST API']
    },
    {
        name: 'David Chen',
        position: 'Backend Developer',
        status: 'active',
        email: 'david.chen@example.com',
        phone: '+1-555-0103',
        description: 'Expert in Node.js, Python and microservices architecture, experienced in high-load systems',
        skills: ['Node.js', 'Python', 'Docker', 'Kubernetes', 'MongoDB']
    },
    {
        name: 'Sarah Williams',
        position: 'DevOps Engineer',
        status: 'rejected',
        email: 'sarah.williams@example.com',
        phone: '+1-555-0104',
        description: 'Experience in CI/CD pipelines and cloud infrastructure management',
        skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git']
    },
    {
        name: 'Michael Brown',
        position: 'Full Stack Developer',
        status: 'active',
        email: 'michael.brown@example.com',
        phone: '+1-555-0105',
        description: 'Versatile developer with experience from frontend to DevOps, strong problem-solving skills',
        skills: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker']
    },
    {
        name: 'Emily Davis',
        position: 'React Developer',
        status: 'interview',
        email: 'emily.davis@example.com',
        phone: '+1-555-0106',
        description: 'Focus on building scalable React applications with modern best practices',
        skills: ['React', 'TypeScript', 'GraphQL', 'REST API', 'Git']
    },
    {
        name: 'James Wilson',
        position: 'Python Backend Developer',
        status: 'active',
        email: 'james.wilson@example.com',
        phone: '+1-555-0107',
        description: 'Developing high-load backend systems with Python, experienced in distributed systems',
        skills: ['Python', 'PostgreSQL', 'MongoDB', 'Docker', 'REST API']
    },
    {
        name: 'Lisa Anderson',
        position: 'Junior Full Stack Developer',
        status: 'rejected',
        email: 'lisa.anderson@example.com',
        phone: '+1-555-0108',
        description: 'Junior developer with foundational skills in full stack development, eager to learn',
        skills: ['JavaScript', 'React', 'Node.js', 'Git']
    },
    {
        name: 'Robert Taylor',
        position: 'Cloud Architect',
        status: 'interview',
        email: 'robert.taylor@example.com',
        phone: '+1-555-0109',
        description: 'Specialized in cloud infrastructure design and implementation on AWS',
        skills: ['AWS', 'Kubernetes', 'Docker', 'Python', 'CI/CD']
    },
    {
        name: 'Jennifer Martinez',
        position: 'Frontend Engineer',
        status: 'active',
        email: 'jennifer.martinez@example.com',
        phone: '+1-555-0110',
        description: 'Expert in modern frontend frameworks with strong TypeScript skills',
        skills: ['React', 'TypeScript', 'JavaScript', 'GraphQL', 'Git']
    }
];

async function main() {
    console.log('Start seeding...');

    // Create skills
    for (const skillName of skillsData) {
        await prisma.skill.upsert({
            where: { name: skillName },
            update: {},
            create: { name: skillName },
        });
    }
    console.log('Skills created');

    // Create candidates with skills
    for (const candidateData of candidatesData) {
        const { skills, ...data } = candidateData;

        const candidate = await prisma.candidate.create({
            data: {
                ...data,
                skills: {
                    create: skills.map((skillName) => ({
                        skill: {
                            connect: { name: skillName },
                        },
                    })),
                },
            },
        });

        console.log(`Created candidate: ${candidate.name}`);
    }

    console.log('Seeding finished!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
