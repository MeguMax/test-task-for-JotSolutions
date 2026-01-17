export interface UpdateStatusDTO {
    status: 'active' | 'interview' | 'rejected';
}

export interface CreateCandidateDTO {
    name: string;
    position: string;
    status: 'active' | 'interview' | 'rejected';
    email: string;
    phone: string;
    description: string;
    skills: string[];
}

export interface UpdateCandidateDTO {
    name?: string;
    position?: string;
    email?: string;
    phone?: string;
    description?: string;
    skills?: string[];
}

export function validateStatusDTO(body: any): { valid: boolean; error?: string; data?: UpdateStatusDTO } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body is required' };
    }

    const { status } = body;

    if (!status || typeof status !== 'string') {
        return { valid: false, error: 'Status is required and must be a string' };
    }

    const validStatuses: Array<'active' | 'interview' | 'rejected'> = ['active', 'interview', 'rejected'];
    if (!validStatuses.includes(status as any)) {
        return {
            valid: false,
            error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        };
    }

    return { valid: true, data: { status: status as 'active' | 'interview' | 'rejected' } };
}

export function validateCreateCandidateDTO(body: any): { valid: boolean; error?: string; data?: CreateCandidateDTO } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body is required' };
    }

    const { name, position, status, email, phone, description, skills } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return { valid: false, error: 'Name is required and must be a non-empty string' };
    }

    if (!position || typeof position !== 'string' || position.trim().length === 0) {
        return { valid: false, error: 'Position is required and must be a non-empty string' };
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return { valid: false, error: 'Valid email is required' };
    }

    if (!phone || typeof phone !== 'string') {
        return { valid: false, error: 'Phone is required' };
    }

    if (!description || typeof description !== 'string') {
        return { valid: false, error: 'Description is required' };
    }

    const validStatuses: Array<'active' | 'interview' | 'rejected'> = ['active', 'interview', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
        return { valid: false, error: 'Status must be: active, interview, or rejected' };
    }

    if (!Array.isArray(skills) || skills.length === 0) {
        return { valid: false, error: 'Skills must be a non-empty array' };
    }

    if (!skills.every((s) => typeof s === 'string' && s.trim().length > 0)) {
        return { valid: false, error: 'All skills must be non-empty strings' };
    }

    return {
        valid: true,
        data: {
            name: name.trim(),
            position: position.trim(),
            status: status as 'active' | 'interview' | 'rejected',
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            description: description.trim(),
            skills: skills.map((s: string) => s.trim()),
        },
    };
}

export function validateUpdateCandidateDTO(body: any): { valid: boolean; error?: string; data?: UpdateCandidateDTO } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body is required' };
    }

    const data: UpdateCandidateDTO = {};

    if (body.name !== undefined) {
        if (typeof body.name !== 'string' || body.name.trim().length === 0) {
            return { valid: false, error: 'Name must be a non-empty string' };
        }
        data.name = body.name.trim();
    }

    if (body.position !== undefined) {
        if (typeof body.position !== 'string' || body.position.trim().length === 0) {
            return { valid: false, error: 'Position must be a non-empty string' };
        }
        data.position = body.position.trim();
    }

    if (body.email !== undefined) {
        if (typeof body.email !== 'string' || !body.email.includes('@')) {
            return { valid: false, error: 'Valid email is required' };
        }
        data.email = body.email.trim().toLowerCase();
    }

    if (body.phone !== undefined) {
        if (typeof body.phone !== 'string') {
            return { valid: false, error: 'Phone must be a string' };
        }
        data.phone = body.phone.trim();
    }

    if (body.description !== undefined) {
        if (typeof body.description !== 'string') {
            return { valid: false, error: 'Description must be a string' };
        }
        data.description = body.description.trim();
    }

    if (body.skills !== undefined) {
        if (!Array.isArray(body.skills)) {
            return { valid: false, error: 'Skills must be an array' };
        }
        if (!body.skills.every((s: any) => typeof s === 'string' && s.trim().length > 0)) {
            return { valid: false, error: 'All skills must be non-empty strings' };
        }
        data.skills = body.skills.map((s: string) => s.trim());
    }

    return { valid: true, data };
}
