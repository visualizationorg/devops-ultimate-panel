import { useAzureDevOps } from 'hooks/useAzureDevOps';

const AzureDevOpsWorkItems = () => {
    const { workItems, loading, error } = useAzureDevOps();

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {error.message}</div>;
    
    // System.State durumuna göre gruplama
    const stateCounts = workItems.reduce((acc, item) => {
        const state = item.fields['System.State'];
        // undefined olanları saymamaya dikkat et
        if (state) {
            acc[state] = (acc[state] || 0) + 1;
        }
        return acc;
    }, {});

    return (
        <div>
            <h1>Work Items</h1>
            <ul>
                {Object.entries(stateCounts).map(([key, value]) => (
                    <li key={key}>
                        {key}: {value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AzureDevOpsWorkItems;
