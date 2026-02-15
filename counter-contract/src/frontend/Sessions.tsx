import { useContract } from './hooks/useContract';
import { useWallet } from './hooks/useWallet';

export const Sessions = () => {
    const { completeSession, loading, error, contractClient } = useContract();
    const { connected } = useWallet();
    // const [activeSessions, setActiveSessions] = useState<bigint | null>(null);

    // Fetch active sessions count
    /*
    useEffect(() => {
      const fetchStats = async () => {
        if (contractClient) {
          try {
              // We can query the ledger state directly from the contract client?
              // Or use an exposed circuit.
              // The contract exposes counters. 
              // In a real app we'd use publicDataProvider to query the ledger.
              // For now, we might not have an easy way to read "activeSessions" without a helper.
              // actually contractClient.publicCircuits includes 'getStats' if we exported it?
              // index.d.ts says pureCircuits.getStats.
              
              // Let's assume we can't easily read it without implementing the query logic or using an indexer query.
              // We'll leave it as "Unknown" or Try to query if possible.
          } catch (e) {
            console.error(e);
          }
        }
      };
      fetchStats();
    }, [contractClient]);
    */

    const handleComplete = async () => {
        try {
            await completeSession('dummy-id'); // ID is ignored by current contract
            alert('Session completed successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to complete session');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Manage Sessions
                </h2>

                {!connected ? (
                    <div className="text-yellow-600 dark:text-yellow-400">
                        Please connect your wallet to manage sessions.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
                            <p className="text-sm text-blue-700 dark:text-blue-200">
                                Active Sessions (Global): See details in Stats page.
                            </p>
                            <p className="text-xs text-blue-500 mt-1">
                                *Note: This contract allows any "complete" action to decrement the global counter.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleComplete}
                                disabled={loading || !contractClient}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Complete a Session'}
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mt-2">
                                Error: {error}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
