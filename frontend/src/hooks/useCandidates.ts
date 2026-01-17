import { useState, useEffect, useCallback } from 'react';
import type { Candidate, CandidateStatus, CreateCandidateDTO, UpdateCandidateDTO } from '../types';
import { candidatesAPI } from '../api/candidates';
import toast from 'react-hot-toast';

export const useCandidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCandidates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await candidatesAPI.getAll();
            setCandidates(data);
        } catch (err) {
            setError('Failed to load candidates');
            toast.error('Failed to load candidates');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    const updateStatus = async (id: number, status: CandidateStatus) => {
        const previousCandidates = [...candidates];

        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === id
                    ? { ...candidate, status, updatedAt: new Date().toISOString() }
                    : candidate
            )
        );

        try {
            const updated = await candidatesAPI.updateStatus(id, status);
            setCandidates((prev) =>
                prev.map((candidate) => (candidate.id === id ? updated : candidate))
            );
            toast.success('Status updated successfully');
        } catch (err) {
            setCandidates(previousCandidates);
            toast.error('Failed to update status');
            console.error('Failed to update status', err);
            throw err;
        }
    };

    const createCandidate = async (data: CreateCandidateDTO) => {
        try {
            const newCandidate = await candidatesAPI.create(data);
            setCandidates((prev) => [newCandidate, ...prev]);
            toast.success('Candidate added successfully');
            return newCandidate;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Failed to create candidate';
            toast.error(errorMsg);
            throw err;
        }
    };

    const updateCandidate = async (id: number, data: UpdateCandidateDTO) => {
        const previousCandidates = [...candidates];

        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === id
                    ? { ...candidate, ...data, updatedAt: new Date().toISOString() }
                    : candidate
            )
        );

        try {
            const updated = await candidatesAPI.update(id, data);
            setCandidates((prev) =>
                prev.map((candidate) => (candidate.id === id ? updated : candidate))
            );
            toast.success('Candidate updated successfully');
            return updated;
        } catch (err: any) {
            setCandidates(previousCandidates);
            const errorMsg = err.response?.data?.error || 'Failed to update candidate';
            toast.error(errorMsg);
            throw err;
        }
    };

    const deleteCandidate = async (id: number) => {
        const previousCandidates = [...candidates];

        setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));

        try {
            await candidatesAPI.delete(id);
            toast.success('Candidate deleted successfully');
        } catch (err) {
            setCandidates(previousCandidates);
            toast.error('Failed to delete candidate');
            throw err;
        }
    };

    return {
        candidates,
        loading,
        error,
        refetch: fetchCandidates,
        updateStatus,
        createCandidate,
        updateCandidate,
        deleteCandidate,
    };
};
