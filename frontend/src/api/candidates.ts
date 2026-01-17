import axios from 'axios';
import type { Candidate, CandidateStatus, CreateCandidateDTO, UpdateCandidateDTO } from '../types';

const API_BASE = 'https://candidate-api-mj3z.onrender.com/api';

export const candidatesAPI = {
    getAll: async (): Promise<Candidate[]> => {
        const response = await axios.get(`${API_BASE}/candidates`);
        return response.data;
    },

    getById: async (id: number): Promise<Candidate> => {
        const response = await axios.get(`${API_BASE}/candidates/${id}`);
        return response.data;
    },

    getAllSkills: async (): Promise<string[]> => {
        const response = await axios.get(`${API_BASE}/candidates/all-skills`);
        return response.data;
    },

    create: async (data: CreateCandidateDTO): Promise<Candidate> => {
        const response = await axios.post(`${API_BASE}/candidates`, data);
        return response.data;
    },

    update: async (id: number, data: UpdateCandidateDTO): Promise<Candidate> => {
        const response = await axios.put(`${API_BASE}/candidates/${id}`, data);
        return response.data;
    },

    updateStatus: async (id: number, status: CandidateStatus): Promise<Candidate> => {
        const response = await axios.patch(`${API_BASE}/candidates/${id}/status`, { status });
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE}/candidates/${id}`);
    },
};
