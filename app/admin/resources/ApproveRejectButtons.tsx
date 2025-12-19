'use client';

import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface ApproveRejectButtonsProps {
    resourceId: string;
}

export function ApproveRejectButtons({ resourceId }: ApproveRejectButtonsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

    const handleApprove = async () => {
        setLoading('approve');
        try {
            const response = await fetch(`/api/admin/resources/${resourceId}/approve`, {
                method: 'POST',
            });
            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to approve resource');
            }
        } catch (error) {
            alert('Error approving resource');
        } finally {
            setLoading(null);
        }
    };

    const handleReject = async () => {
        if (!confirm('Are you sure you want to reject and delete this resource?')) return;

        setLoading('reject');
        try {
            const response = await fetch(`/api/admin/resources/${resourceId}/approve`, {
                method: 'DELETE',
            });
            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to reject resource');
            }
        } catch (error) {
            alert('Error rejecting resource');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={handleApprove}
                disabled={loading !== null}
                className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50 transition-colors"
                title="Approve"
            >
                {loading === 'approve' ? (
                    <span className="block h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                ) : (
                    <CheckIcon className="h-4 w-4" />
                )}
            </button>
            <button
                onClick={handleReject}
                disabled={loading !== null}
                className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
                title="Reject"
            >
                {loading === 'reject' ? (
                    <span className="block h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                ) : (
                    <XMarkIcon className="h-4 w-4" />
                )}
            </button>
        </div>
    );
}
