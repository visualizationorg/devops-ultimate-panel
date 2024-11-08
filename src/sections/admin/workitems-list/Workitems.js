import React, { useState, useEffect } from 'react';
import axios from 'axios';

const pat = process.env.REACT_APP_API_PAT;
const token = btoa(`:${pat}`);
const organization = 'nadidurna1';

const AzureDevOpsWorkItems = () => {const [workItems, setWorkItems] = useState([]);

    useEffect(() => {
        const fetchWorkItems = async () => {
            try {
                const projectsResponse = await axios.get(
                    `https://dev.azure.com/${organization}/_apis/projects?api-version=7.0-preview.4`,
                    {
                        headers: {
                            'Authorization': `Basic ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );
    
                const projects = projectsResponse.data.value;
                let allWorkItems = [];
                let workItemIdsSet = new Set(); // Tekrarları engellemek için Set kullanıyoruz
    
                for (const project of projects) {
                    let idsToFetch = [];
                    let continuationToken = null;
    
                    do {
                        const wiqlResponse = await axios.post(
                            `https://dev.azure.com/${organization}/${project.name}/_apis/wit/wiql?api-version=7.2-preview.2`,
                            {
                                query: `SELECT [System.Id], [System.State] FROM WorkItems`
                            },
                            {
                                headers: {
                                    'Authorization': `Basic ${token}`,
                                    'Content-Type': 'application/json',
                                    'X-MS-Continuation': continuationToken || '',
                                },
                            }
                        );
    
                        const workItemsFetched = wiqlResponse.data.workItems.filter(item => item && item.id);
    
                        // Work item ID'leri varsa ve Set'te değilse ekle
                        workItemsFetched.forEach(item => {
                            if (!workItemIdsSet.has(item.id)) {
                                workItemIdsSet.add(item.id);
                                idsToFetch.push(item.id);
                            }
                        });
    
                        continuationToken = wiqlResponse.headers['x-ms-continuationtoken'];
                    } while (continuationToken);
    
                    while (idsToFetch.length > 0) {
                        const idsChunk = idsToFetch.splice(0, 200);
    
                        const detailsResponse = await axios.get(
                            `https://dev.azure.com/${organization}/_apis/wit/workitems?ids=${idsChunk.join(',')}&fields=System.State,System.AssignedTo&api-version=7.2-preview.3`,
                            {
                                headers: {
                                    'Authorization': `Basic ${token}`,
                                    'Content-Type': 'application/json'
                                },
                            }
                        );
    
                        allWorkItems = [...allWorkItems, ...detailsResponse.data.value];
                    }
                }
    
                setWorkItems(allWorkItems);
            } catch (error) {
                console.error('Error fetching work items:', error);
            }
        };
    
        fetchWorkItems();
    }, []);

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
