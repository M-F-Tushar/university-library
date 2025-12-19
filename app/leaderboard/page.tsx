'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/lib/gamification/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Trophy, Medal, Award, User } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function LeaderboardPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const leaderboard = await getLeaderboard();
                setUsers(leaderboard);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="h-6 w-6 text-yellow-500" />;
            case 1: return <Medal className="h-6 w-6 text-gray-400" />;
            case 2: return <Medal className="h-6 w-6 text-amber-700" />;
            default: return <span className="font-bold text-gray-500">#{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-black">
            <div className="container mx-auto px-4 max-w-4xl space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-600">
                        Hall of Fame
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Top contributing students of CSTU CSE
                    </p>
                </div>

                <div className="grid gap-4">
                    {users.map((user, index) => (
                        <Card key={user.id} className={`transform transition-all hover:scale-[1.01] ${index === 0 ? 'border-yellow-500 shadow-lg shadow-yellow-500/10' : ''}`}>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 items-center justify-center shrink-0">
                                    {getRankIcon(index)}
                                </div>

                                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                    <User className="h-6 w-6 text-gray-400" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                                        {user.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {user.department || 'Student'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-8 text-right hidden sm:flex">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {user._count?.badges || 0}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Badges</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {user._count?.uploadedResources || 0}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Uploads</div>
                                    </div>
                                    <div className="min-w-[80px]">
                                        <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                                            {user.score}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Points</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {users.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No active students yet. Be the first to start climbing the ranks!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
