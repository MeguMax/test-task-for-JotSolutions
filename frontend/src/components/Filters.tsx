import { memo, useMemo } from 'react';
import type { CandidateStatus, SortOption } from '../types';

interface FiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: CandidateStatus | 'all';
    onStatusFilterChange: (value: CandidateStatus | 'all') => void;
    skillFilter: string;
    onSkillFilterChange: (value: string) => void;
    sortOption: SortOption;
    onSortChange: (value: SortOption) => void;
    availableSkills: string[];
}

export const Filters = memo(({
                                 searchTerm,
                                 onSearchChange,
                                 statusFilter,
                                 onStatusFilterChange,
                                 skillFilter,
                                 onSkillFilterChange,
                                 sortOption,
                                 onSortChange,
                                 availableSkills,
                             }: FiltersProps) => {
    const sortedSkills = useMemo(() => {
        return [...availableSkills].sort((a, b) => a.localeCompare(b));
    }, [availableSkills]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Search by name
                    </label>
                    <div className="relative">
                        <input
                            id="search"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Enter name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                            aria-label="Search candidates by name"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        id="status"
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value as CandidateStatus | 'all')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
                        aria-label="Filter candidates by status"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="interview">Interview</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-2">
                        Skill
                    </label>
                    <select
                        id="skill"
                        value={skillFilter}
                        onChange={(e) => onSkillFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
                        aria-label="Filter candidates by skill"
                    >
                        <option value="">All Skills</option>
                        {sortedSkills.map((skill) => (
                            <option key={skill} value={skill}>
                                {skill}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                        Sort by
                    </label>
                    <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value as SortOption)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
                        aria-label="Sort candidates"
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                    </select>
                </div>
            </div>

            {(searchTerm || statusFilter !== 'all' || skillFilter) && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Active filters:</span>
                    {searchTerm && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
              Search: {searchTerm}
            </span>
                    )}
                    {statusFilter !== 'all' && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md">
              Status: {statusFilter}
            </span>
                    )}
                    {skillFilter && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
              Skill: {skillFilter}
            </span>
                    )}
                    <button
                        onClick={() => {
                            onSearchChange('');
                            onStatusFilterChange('all');
                            onSkillFilterChange('');
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
});

Filters.displayName = 'Filters';
