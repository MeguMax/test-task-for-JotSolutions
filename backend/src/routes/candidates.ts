import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateStatusDTO, validateCreateCandidateDTO, validateUpdateCandidateDTO } from '../types/dto';

const router = Router();
const prisma = new PrismaClient();

// GET /api/candidates/all-skills
router.get('/all-skills', async (_req, res) => {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { name: 'asc' },
        });
        res.status(200).json(skills.map(s => s.name));
    } catch (error) {
        console.error('GET /api/candidates/all-skills error:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

// GET /api/candidates
router.get('/', async (_req, res) => {
    try {
        const candidates = await prisma.candidate.findMany({
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const formatted = candidates.map((candidate) => ({
            ...candidate,
            skills: candidate.skills.map((cs) => cs.skill.name),
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error('GET /api/candidates error:', error);
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
});

// GET /api/candidates/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const candidateId = parseInt(id, 10);

        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID' });
        }

        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
            },
        });

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        const formatted = {
            ...candidate,
            skills: candidate.skills.map((cs) => cs.skill.name),
        };

        res.status(200).json(formatted);
    } catch (error) {
        console.error('GET /api/candidates/:id error:', error);
        res.status(500).json({ error: 'Failed to fetch candidate' });
    }
});

// POST /api/candidates
router.post('/', async (req, res) => {
    try {
        const validation = validateCreateCandidateDTO(req.body);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const { name, position, status, email, phone, description, skills } = validation.data!;

        const existingCandidate = await prisma.candidate.findUnique({
            where: { email },
        });

        if (existingCandidate) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const candidate = await prisma.$transaction(async (tx) => {
            const skillRecords = await Promise.all(
                skills.map(async (skillName) => {
                    const skill = await tx.skill.upsert({
                        where: { name: skillName },
                        update: {},
                        create: { name: skillName },
                    });
                    return skill;
                })
            );

            const newCandidate = await tx.candidate.create({
                data: {
                    name,
                    position,
                    status,
                    email,
                    phone,
                    description,
                    skills: {
                        create: skillRecords.map((skill) => ({
                            skill: {
                                connect: { id: skill.id },
                            },
                        })),
                    },
                },
                include: {
                    skills: {
                        include: {
                            skill: true,
                        },
                    },
                },
            });

            return newCandidate;
        });

        const formatted = {
            ...candidate,
            skills: candidate.skills.map((cs) => cs.skill.name),
        };

        res.status(201).json(formatted);
    } catch (error) {
        console.error('POST /api/candidates error:', error);
        res.status(500).json({ error: 'Failed to create candidate' });
    }
});

// PUT /api/candidates/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const candidateId = parseInt(id, 10);

        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID' });
        }

        const validation = validateUpdateCandidateDTO(req.body);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const updateData = validation.data!;

        if (updateData.email) {
            const existing = await prisma.candidate.findFirst({
                where: {
                    email: updateData.email,
                    NOT: { id: candidateId },
                },
            });

            if (existing) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }

        const candidate = await prisma.$transaction(async (tx) => {
            const existingCandidate = await tx.candidate.findUnique({
                where: { id: candidateId },
            });

            if (!existingCandidate) {
                throw new Error('NOT_FOUND');
            }

            if (updateData.skills) {
                await tx.candidateSkill.deleteMany({
                    where: { candidateId },
                });

                const skillRecords = await Promise.all(
                    updateData.skills.map(async (skillName) => {
                        const skill = await tx.skill.upsert({
                            where: { name: skillName },
                            update: {},
                            create: { name: skillName },
                        });
                        return skill;
                    })
                );

                const updated = await tx.candidate.update({
                    where: { id: candidateId },
                    data: {
                        ...(updateData.name && { name: updateData.name }),
                        ...(updateData.position && { position: updateData.position }),
                        ...(updateData.email && { email: updateData.email }),
                        ...(updateData.phone && { phone: updateData.phone }),
                        ...(updateData.description && { description: updateData.description }),
                        skills: {
                            create: skillRecords.map((skill) => ({
                                skill: { connect: { id: skill.id } },
                            })),
                        },
                    },
                    include: {
                        skills: {
                            include: { skill: true },
                        },
                    },
                });

                return updated;
            } else {
                const updated = await tx.candidate.update({
                    where: { id: candidateId },
                    data: {
                        ...(updateData.name && { name: updateData.name }),
                        ...(updateData.position && { position: updateData.position }),
                        ...(updateData.email && { email: updateData.email }),
                        ...(updateData.phone && { phone: updateData.phone }),
                        ...(updateData.description && { description: updateData.description }),
                    },
                    include: {
                        skills: {
                            include: { skill: true },
                        },
                    },
                });

                return updated;
            }
        });

        const formatted = {
            ...candidate,
            skills: candidate.skills.map((cs) => cs.skill.name),
        };

        res.status(200).json(formatted);
    } catch (error: any) {
        console.error('PUT /api/candidates/:id error:', error);

        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.status(500).json({ error: 'Failed to update candidate' });
    }
});

// PATCH /api/candidates/:id/status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const candidateId = parseInt(id, 10);

        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID' });
        }

        const validation = validateStatusDTO(req.body);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const { status } = validation.data!;

        const candidate = await prisma.$transaction(async (tx) => {
            const existing = await tx.candidate.findUnique({
                where: { id: candidateId },
            });

            if (!existing) {
                throw new Error('NOT_FOUND');
            }

            const updated = await tx.candidate.update({
                where: { id: candidateId },
                data: { status },
                include: {
                    skills: {
                        include: {
                            skill: true,
                        },
                    },
                },
            });

            return updated;
        });

        const formatted = {
            ...candidate,
            skills: candidate.skills.map((cs) => cs.skill.name),
        };

        res.status(200).json(formatted);
    } catch (error: any) {
        console.error('PATCH /api/candidates/:id/status error:', error);

        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.status(500).json({ error: 'Failed to update status' });
    }
});

// DELETE /api/candidates/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const candidateId = parseInt(id, 10);

        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID' });
        }

        await prisma.$transaction(async (tx) => {
            const existing = await tx.candidate.findUnique({
                where: { id: candidateId },
            });

            if (!existing) {
                throw new Error('NOT_FOUND');
            }

            await tx.candidate.delete({
                where: { id: candidateId },
            });
        });

        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error: any) {
        console.error('DELETE /api/candidates/:id error:', error);

        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.status(500).json({ error: 'Failed to delete candidate' });
    }
});

export default router;
