import React, { useState, useEffect } from 'react';
import axios from 'axios';

const pat = process.env.REACT_APP_API_PAT;
const token = btoa(`:${pat}`);
const organization = 'nadidurna1';

const AzureDevOpsWorkItems = () => {
    const [workItems, setWorkItems] = useState([]);
    const [completionPercentage, setCompletionPercentage] = useState({});

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
                let workItemIdsSet = new Set();

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
                            `https://dev.azure.com/${organization}/_apis/wit/workitems?ids=${idsChunk.join(',')}&fields=System.TeamProject,System.IterationPath,System.IterationLevel1,System.IterationLevel2,System.State,System.AssignedTo&api-version=7.2-preview.3`,
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
    useEffect(() => {
        const stateCounts = {};
        let sprintCounts = {};
        let completionData = {};

        workItems.forEach((item) => {
            const state = item.fields['System.State'];
            const teamProject = item.fields['System.TeamProject'];
            const iterationLevel1 = item.fields['System.IterationLevel1'];
            const iterationLevel2 = item.fields['System.IterationLevel2'];

            // Eğer iterationLevel2 yoksa işleme alma
            if (!iterationLevel2) return;

            // Parent grup anahtarını oluştur (TeamProject + IterationLevel1)
            const parentGroup = `${teamProject} - ${iterationLevel1}`;
            const sprintName = iterationLevel2;

            // console.log(`Parent Group: ${parentGroup}, Sprint: ${sprintName}, State: ${state}`);

            // State sayımlarını yap
            if (state) {
                if (!stateCounts[parentGroup]) {
                    stateCounts[parentGroup] = {};
                }
                if (!stateCounts[parentGroup][sprintName]) {
                    stateCounts[parentGroup][sprintName] = { Done: 0, InProgress: 0 };
                }
                if (!sprintCounts[parentGroup]) {
                    sprintCounts[parentGroup] = {};
                }
                if (!sprintCounts[parentGroup][sprintName]) {
                    sprintCounts[parentGroup][sprintName] = { total: 0, completed: 0 };
                }

                sprintCounts[parentGroup][sprintName].total++;
                if (state === 'Done' || state === 'Closed') {
                    sprintCounts[parentGroup][sprintName].completed++;
                }
            }
        });

        // Yüzdeyi hesapla
        Object.keys(sprintCounts).forEach((parentGroup) => {
            Object.keys(sprintCounts[parentGroup]).forEach((sprintName) => {
                const { total, completed } = sprintCounts[parentGroup][sprintName];
                const percentage = total > 0 ? (completed / total) * 100 : 0;
                if (!completionData[parentGroup]) {
                    completionData[parentGroup] = {};
                }
                completionData[parentGroup][sprintName] = percentage.toFixed(2);
            });
        });

        setCompletionPercentage(completionData);
    }, [workItems]);

    return (
        <div>
            <h1>Work Items Done Rate</h1>
            <strong>Team Project - Iteration Level 1</strong>
            <ul>
                {Object.entries(completionPercentage).map(([parentGroup, sprints]) => (
                    <li key={parentGroup}>
                        <strong>{parentGroup}</strong>
                        <ul>
                            {Object.entries(sprints).map(([sprintName, percentage]) => (
                                <li key={sprintName}>
                                    {sprintName} için tamamlanan: %{percentage}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AzureDevOpsWorkItems;
