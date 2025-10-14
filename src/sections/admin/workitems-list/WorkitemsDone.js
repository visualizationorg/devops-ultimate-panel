import React, { useState, useEffect } from 'react';
import { fetchAllProjects, fetchProcesses, fetchStateCategory, fetchWorkItemsForProject, fetchWorkItemDetails } from 'services/AzureDevOpsService';

const WorkitemsDone = () => {
    const [workItems, setWorkItems] = useState([]);
    const [completionPercentage, setCompletionPercentage] = useState({});
    const [stateCategoryMap, setStateCategoryMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Projeleri ve process tiplerini çek
                const projects = await fetchAllProjects();
                const projectProcessMap = await fetchProcesses();

                // State kategorilerini çek
                const tempStateCategoryMap = {};
                for (const projectName in projectProcessMap) {
                    tempStateCategoryMap[projectName] = await fetchStateCategory(projectProcessMap[projectName]);
                }
                setStateCategoryMap(tempStateCategoryMap);

                // Work itemları çek
                let allWorkItems = [];
                let workItemIdsSet = new Set();

                for (const project of projects) {
                    const workItemIds = await fetchWorkItemsForProject(project.name);
                    workItemIds.forEach(item => {
                        if (item?.id && !workItemIdsSet.has(item.id)) {
                            workItemIdsSet.add(item.id);
                        }
                    });
                }

                // Work item detaylarını çek
                const idsArray = Array.from(workItemIdsSet);
                while (idsArray.length > 0) {
                    const chunk = idsArray.splice(0, 200);
                    const details = await fetchWorkItemDetails(chunk, 'System.TeamProject,System.IterationPath,System.IterationLevel1,System.IterationLevel2,System.State,System.AssignedTo');
                    allWorkItems = [...allWorkItems, ...details];
                }

                setWorkItems(allWorkItems);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const stateCounts = {};
        let sprintCounts = {};
        let completionData = {};

        // Work Item'ları dolaşarak State sayımlarını yap
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

                // State kategorisi Completed olanlara göre sayım yap
                if (stateCategoryMap[teamProject]?.[state] === 'Completed') {
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

export default WorkitemsDone;
