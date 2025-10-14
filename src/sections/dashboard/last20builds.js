import React from 'react';
import { useAzureDevOps } from 'hooks/useAzureDevOps';

const AzureDevOpsBuilds = () => {
    const { builds, loading, error } = useAzureDevOps();

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {error.message}</div>;

    return (
        <div>
            <h1>Organizasyon İçindeki Tüm Projelerden Son 20 Build</h1>
            <ul>
                {builds.map((build) => (
                    <li key={build.id}>
                        Proje: {build.project.name} - Build ID: {build.id} - Status: {build.status} -
                        Result: {build.result} - Başlangıç Zamanı: {new Date(build.startTime).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AzureDevOpsBuilds;
