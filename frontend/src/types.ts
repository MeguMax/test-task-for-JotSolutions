export type CandidateStatus = 'active' | 'interview' | 'rejected';

export interface Candidate {
    id: number;
    name: string;
    position: string;
    status: CandidateStatus;
    email: string;
    phone: string;
    description: string;
    skills: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateCandidateDTO {
    name: string;
    position: string;
    status: CandidateStatus;
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

export type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';
