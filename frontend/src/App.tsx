import { useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useCandidates } from './hooks/useCandidates';
import { CandidateCard } from './components/CandidateCard';
import { CandidateModal } from './components/CandidateModal';
import { AddCandidateModal } from './components/AddCandidateModal';
import { EditCandidateModal } from './components/EditCandidateModal';
import { Filters } from './components/Filters';
import type { Candidate, CandidateStatus, SortOption } from './types';

function App() {
    const { candidates, loading, error, updateStatus, createCandidate, updateCandidate, deleteCandidate } = useCandidates();
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
    const [skillFilter, setSkillFilter] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('date-desc');

    const availableSkills = useMemo(() => {
        const skillsSet = new Set<string>();
        candidates.forEach((candidate) => {
            candidate.skills.forEach((skill) => skillsSet.add(skill));
        });
        return Array.from(skillsSet);
    }, [candidates]);

    const filteredAndSortedCandidates = useMemo(() => {
        let result = candidates.filter((candidate) => {
            const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
            const matchesSkill = !skillFilter || candidate.skills.includes(skillFilter);
            return matchesSearch && matchesStatus && matchesSkill;
        });

        result.sort((a, b) => {
            switch (sortOption) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'date-asc':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'date-desc':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });

        return result;
    }, [candidates, searchTerm, statusFilter, skillFilter, sortOption]);

    const stats = useMemo(() => {
        return {
            total: candidates.length,
            active: candidates.filter((c) => c.status === 'active').length,
            interview: candidates.filter((c) => c.status === 'interview').length,
            rejected: candidates.filter((c) => c.status === 'rejected').length,
        };
    }, [candidates]);

    const handleEdit = (candidate: Candidate) => {
        setSelectedCandidate(null);
        setEditingCandidate(candidate);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading candidates...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white rounded-lg p-8 shadow-lg max-w-md">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <header className="mb-8 animate-fade-in">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Candidate Management
                            </h1>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-sm ripple"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Candidate
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover-lift">
                                <p className="text-sm text-gray-600 mb-1">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover-lift">
                                <p className="text-sm text-gray-600 mb-1">Active</p>
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover-lift">
                                <p className="text-sm text-gray-600 mb-1">Interview</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.interview}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover-lift">
                                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                            </div>
                        </div>
                    </header>

                    <Filters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        skillFilter={skillFilter}
                        onSkillFilterChange={setSkillFilter}
                        sortOption={sortOption}
                        onSortChange={setSortOption}
                        availableSkills={availableSkills}
                    />

                    {filteredAndSortedCandidates.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-gray-500 text-lg font-medium">No candidates found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAndSortedCandidates.map((candidate) => (
                                <CandidateCard
                                    key={candidate.id}
                                    candidate={candidate}
                                    onViewDetails={setSelectedCandidate}
                                />
                            ))}
                        </div>
                    )}

                    {selectedCandidate && (
                        <CandidateModal
                            candidate={candidates.find(c => c.id === selectedCandidate.id) || selectedCandidate}
                            onClose={() => setSelectedCandidate(null)}
                            onStatusChange={updateStatus}
                            onDelete={deleteCandidate}
                            onEdit={handleEdit}
                        />
                    )}

                    {editingCandidate && (
                        <EditCandidateModal
                            candidate={candidates.find(c => c.id === editingCandidate.id) || editingCandidate}
                            onClose={() => setEditingCandidate(null)}
                            onSubmit={updateCandidate}
                        />
                    )}

                    {showAddModal && (
                        <AddCandidateModal
                            onClose={() => setShowAddModal(false)}
                            onSubmit={createCandidate}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
