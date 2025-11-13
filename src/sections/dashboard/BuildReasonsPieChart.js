import React, { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import { LoadingOutlined } from '@ant-design/icons';
import { getStorageValue, STORAGE_KEYS } from 'utils/storage';

const BuildReasonsPieChart = () => {
    const [data, setData] = useState({ running: 0, stopped: 0 });
    const [loading, setLoading] = useState(true);

    const fetchBuilds = async () => {
        const pat = getStorageValue(STORAGE_KEYS.PAT, '');
        const token = btoa(`:${pat}`);
        const organization = getStorageValue(STORAGE_KEYS.ORGANIZATION, '');

        if (!pat || !organization) {
            setLoading(false);
            return;
        }

        const headers = {
            'Authorization': `Basic ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            const projectsResponse = await fetch(
                `https://dev.azure.com/${organization}/_apis/projects?api-version=7.2-preview.4`,
                { headers }
            );
            
            if (!projectsResponse.ok) {
                setLoading(false);
                return;
            }
            
            const projectsData = await projectsResponse.json();

            if (!projectsData.value || projectsData.value.length === 0) {
                setLoading(false);
                return;
            }

            const reasonCounts = {};

            const buildPromises = projectsData.value.map(async (project) => {
                try {
                    const buildsResponse = await fetch(
                        `https://dev.azure.com/${organization}/${project.name}/_apis/build/builds?api-version=7.0&$top=100`,
                        { headers }
                    );
                    
                    if (!buildsResponse.ok) return;
                    
                    const buildsData = await buildsResponse.json();

                    if (buildsData.value && Array.isArray(buildsData.value)) {
                        buildsData.value.forEach(build => {
                            const reason = build.reason || 'unknown';
                            reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching builds for project ${project.name}:`, error);
                }
            });

            await Promise.all(buildPromises);
            
            const labelMap = {
                'manual': 'Manual',
                'pullRequest': 'Pull Request',
                'individualCI': 'Individual CI',
                'schedule': 'Schedule',
                'batchedCI': 'Batched CI',
                'buildCompletion': 'Build Completion',
                'continuous': 'Continuous',
                'triggered': 'Triggered',
                'unknown': 'Unknown'
            };

            const formattedData = {};
            Object.keys(reasonCounts).forEach(reason => {
                const label = labelMap[reason] || reason;
                formattedData[label] = reasonCounts[reason];
            });

            setData(formattedData);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching builds:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuilds();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Basit chart configuration - formatter yok
    const chartOptions = {
        chart: {
            type: 'pie',
        },
        labels: Object.keys(data),
        colors: ['#FF9800', '#4CAF50', '#FFC107', '#2196F3', '#9C27B0', '#F44336', '#00BCD4', '#795548'],
        legend: {
            position: 'right'
        },
        dataLabels: {
            enabled: true
        }
    };

    const series = Object.values(data);
    const hasData = series.length > 0 && series.some(val => val > 0);

    return (
        <div>
            {loading ? (
                <LoadingOutlined style={{ fontSize: 24 }} spin />
            ) : hasData ? (
                <ApexChart
                    options={chartOptions}
                    series={series}
                    type="pie"
                    width="500"
                />
            ) : (
                <div>Hiç build verisi bulunamadı</div>
            )}
        </div>
    );
};

export default BuildReasonsPieChart;
