import { useState, useEffect } from 'react';
import type { Candidate, CandidateStatus } from '../types';

interface CandidateModalProps {
    candidate: Candidate;
    onClose: () => void;
    onStatusChange: (id: number, status: CandidateStatus) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onEdit: (candidate: Candidate) => void;
}

const statusConfig = {
    active: {
        bg: 'bg-green-600',
        hoverBg: 'hover:bg-green-700',
        label: 'Active',
        icon: '✓',
    },
    interview: {
        bg: 'bg-blue-600',
        hoverBg: 'hover:bg-blue-700',
        label: 'Interview',
        icon: '⏱',
    },
    rejected: {
        bg: 'bg-red-600',
        hoverBg: 'hover:bg-red-700',
        label: 'Rejected',
        icon: '✕',
    },
};

const headerColors = {
    active: 'bg-gradient-to-r from-green-600 to-green-500',
    interview: 'bg-gradient-to-r from-blue-600 to-blue-500',
    rejected: 'bg-gradient-to-r from-red-600 to-red-500',
};

export const CandidateModal = ({
                                   candidate,
                                   onClose,
                                   onStatusChange,
                                   onDelete,
                                   onEdit,
                               }: CandidateModalProps) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [justChanged, setJustChanged] = useState(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showDeleteConfirm) {
                    setShowDeleteConfirm(false);
                } else {
                    onClose();
                }
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, showDeleteConfirm]);

    const handleStatusChange = async (newStatus: CandidateStatus) => {
        if (newStatus === candidate.status || isUpdating) return;

        setIsUpdating(true);
        setJustChanged(true);

        try {
            await onStatusChange(candidate.id, newStatus);
            setTimeout(() => setJustChanged(false), 600);
        } catch (error) {
            setJustChanged(false);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(candidate.id);
            onClose();
        } catch (error) {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const currentConfig = statusConfig[candidate.status];

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 modal-backdrop"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with gradient */}
                <div className={`sticky top-0 ${headerColors[candidate.status]} text-white px-6 py-5 rounded-t-xl transition-all duration-300 ${justChanged ? 'status-changed' : ''}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 id="modal-title" className="text-2xl font-bold mb-1">
                                {candidate.name}
                            </h2>
                            <p className="text-white/90">{candidate.position}</p>
                            <div className="mt-2 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                <span className="text-lg">{currentConfig.icon}</span>
                                <span className="font-medium">{currentConfig.label}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                📧 Email
                            </label>
                            <a
                                href={`mailto:${candidate.email}`}
                                className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-all inline-flex items-center gap-2 group-hover:gap-3"
                            >
                                {candidate.email}
                                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                📞 Phone
                            </label>
                            <a
                                href={`tel:${candidate.phone}`}
                                className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-all inline-flex items-center gap-2 group-hover:gap-3"
                            >
                                {candidate.phone}
                                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Skills with animation */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            💼 Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill, index) => (
                                <span
                                    key={skill}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 rounded-lg text-sm font-semibold border border-blue-100 hover:shadow-md hover:scale-105 transition-all cursor-default"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                  {skill}
                </span>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            📝 Description
                        </label>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {candidate.description}
                        </p>
                    </div>

                    {/* Edit Button */}
                    <div>
                        <button
                            onClick={() => onEdit(candidate)}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 ripple shadow-md flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Candidate
                        </button>
                    </div>

                    {/* Status Change */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            🔄 Change Status
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {(Object.keys(statusConfig) as CandidateStatus[]).map((status) => {
                                const config = statusConfig[status];
                                const isActive = candidate.status === status;

                                return (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        disabled={isUpdating || isActive}
                                        className={`relative px-4 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ripple ${
                                            isActive
                                                ? `${config.bg} text-white shadow-lg scale-105`
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                                        }`}
                                        aria-pressed={isActive}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-lg">{config.icon}</span>
                                            <span>{config.label}</span>
                                        </div>
                                        {isActive && (
                                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg checkmark-animation">
                                                <span className="text-green-600 text-sm font-bold">✓</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {isUpdating && (
                            <div className="mt-4 flex items-center justify-center text-sm text-gray-600 slide-in-right">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 mr-2"></div>
                                Updating status...
                            </div>
                        )}
                    </div>

                    {/* Delete Section */}
                    <div className="pt-4 border-t border-gray-200">
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 ripple flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Candidate
                            </button>
                        ) : (
                            <div className="space-y-3 slide-in-right">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-center text-red-800 font-semibold flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Are you sure you want to delete this candidate?
                                    </p>
                                    <p className="text-center text-red-600 text-sm mt-1">This action cannot be undone.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ripple"
                                    >
                                        {isDeleting ? (
                                            <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Deleting...
                      </span>
                                        ) : (
                                            'Yes, Delete'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        disabled={isDeleting}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
