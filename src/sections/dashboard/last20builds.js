import React, { useState, useEffect } from 'react';
import axios from 'axios';

const pat = process.env.REACT_APP_API_PAT;
const token = btoa(`:${pat}`);
const organization = 'nadidurna1';

const AzureDevOpsBuilds = () => {
    const [builds, setBuilds] = useState([]);

    useEffect(() => {
        const fetchProjectsAndBuilds = async () => {
            try {
                // Organizasyondaki projeleri çek
                const projectsResponse = await axios.get(
                    `https://dev.azure.com/${organization}/_apis/projects?api-version=7.0`,
                    {
                        headers: {
                            'Authorization': `Basic ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );

                const projects = projectsResponse.data.value;

                // Her proje için API çağrılarını paralel yap
                const buildPromises = projects.map(project =>
                    axios.get(
                        `https://dev.azure.com/${organization}/${project.name}/_apis/build/builds?api-version=7.0&$top=20`,
                        {
                            headers: {
                                'Authorization': `Basic ${token}`,
                                'Content-Type': 'application/json'
                            },
                        }
                    )
                );

                const buildResponses = await Promise.all(buildPromises);

                // Gelen sonuçları birleştir
                let allBuilds = buildResponses.flatMap(response => response.data.value);

                // Build'leri başlangıç zamanına göre sıralayıp ilk 20 tanesini seç
                const sortedBuilds = allBuilds
                    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                    .slice(0, 20);

                setBuilds(sortedBuilds);
            } catch (error) {
                console.error('Error fetching builds:', error);
            }
        };

        fetchProjectsAndBuilds();
    }, []);

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
