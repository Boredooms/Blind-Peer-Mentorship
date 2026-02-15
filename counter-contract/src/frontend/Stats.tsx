import { useState, useEffect } from 'react';
import { config } from './config';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
// @ts-ignore
import { getPublicStates } from '@midnight-ntwrk/midnight-js-contracts';
import { ledger, type Ledger } from '../managed/blind-mentorship/contract/index';

export const Stats = () => {
    const [stats, setStats] = useState<Ledger | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const publicDataProvider = indexerPublicDataProvider(config.indexerUrl, config.indexerWsUrl);

                const publicStates = await getPublicStates(publicDataProvider, config.contractAddress);

                if (publicStates && publicStates.contractState) {
                    const ledgerState = ledger(publicStates.contractState.data);
                    setStats(ledgerState);
                }
            } catch (err: any) {
                console.error('Failed to fetch stats:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Poll every 10 seconds?
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !stats) return <div>Loading statistics...</div>;
    if (error) return <div className="text-red-500">Error loading stats: {error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Users" value={stats?.totalUsers.toString() ?? '0'} />
            <StatCard title="Total Matches" value={stats?.totalMatches.toString() ?? '0'} />
            <StatCard title="Active Sessions" value={stats?.activeSessions.toString() ?? '0'} />
            <StatCard title="Completed Sessions" value={stats?.completedSessions.toString() ?? '0'} />
        </div>
    );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center">
        <div className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
            {title}
        </div>
        <div className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            {value}
        </div>
    </div>
);
