import { memo } from 'react';
import type { Candidate } from '../types';

interface CandidateCardProps {
    candidate: Candidate;
    onViewDetails: (candidate: Candidate) => void;
}

const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const statusConfig = {
    active: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        label: 'Active',
    },
    interview: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        label: 'Interview',
    },
    rejected: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        label: 'Rejected',
    },
};

const avatarColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-indigo-500',
];

export const CandidateCard = memo(({ candidate, onViewDetails }: CandidateCardProps) => {
    const config = statusConfig[candidate.status];
    const avatarColor = avatarColors[candidate.id % avatarColors.length];

    const handleClick = () => {
        onViewDetails(candidate);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onViewDetails(candidate);
        }
    };

    return (
        <div className="card-enter opacity-0">
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover-lift p-5 group cursor-pointer transition-all duration-300"
                role="article"
                aria-label={`Candidate ${candidate.name}`}
                onClick={handleClick}
            >
                <div className="flex items-start space-x-3 mb-4">
                    <div
                        className={`w-14 h-14 rounded-xl ${avatarColor} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md group-hover:shadow-lg transition-all group-hover:scale-110`}
                        aria-hidden="true"
                    >
                        {getInitials(candidate.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">{candidate.position}</p>
                    </div>
                </div>

                <div className="mb-4">
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-all group-hover:scale-105 ${config.bg} ${config.text} ${config.border}`}
        >
          <span className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{
              backgroundColor: candidate.status === 'active' ? '#10b981' :
                  candidate.status === 'interview' ? '#3b82f6' : '#ef4444'
          }}></span>
            {config.label}
        </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-md text-xs font-medium border border-blue-100 transition-all hover:shadow-sm"
                        >
            {skill}
          </span>
                    ))}
                    {candidate.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
            +{candidate.skills.length - 3}
          </span>
                    )}
                </div>

                <button
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all transform group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md ripple"
                    aria-label={`View details for ${candidate.name}`}
                >
                    View Details
                </button>
            </div>
        </div>
    );
});

CandidateCard.displayName = 'CandidateCard';
