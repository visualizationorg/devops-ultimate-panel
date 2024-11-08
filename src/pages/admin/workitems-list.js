import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';

import axios from 'axios';
import AssigneeDetails from 'sections/admin/workitems-list/AssigneeDetails';

const pat = process.env.REACT_APP_API_PAT;
const token = btoa(`:${pat}`);
const organization = 'nadidurna1';

// function createData(name, design, newVal, done, inProgress, toDo, committed, approved, ready, closed) {
//     const total = design + newVal + done + inProgress + toDo + committed + approved + ready + closed;
//     return { name, design, newVal, done, inProgress, toDo, committed, approved, ready, closed, total };
// }

// const rows = [
//     createData('Nadi Durna', 68, 3, 7, 5, 2, 2, 1, 3, 1),
//     createData('(blank)', 0, 31, 5, 9, 6, 5, 3, 0, 0),
//     createData('lsteel109@outlook.com', 0, 0, 6, 0, 0, 0, 0, 0, 0),
//     createData('nmunger109@outlook.com', 0, 0, 0, 0, 0, 0, 0, 0, 0),
//     createData('craig109@outlook.com', 0, 0, 4, 0, 0, 0, 0, 0, 0),
//     createData('ckelly109@outlook.com', 0, 0, 4, 0, 0, 0, 0, 0, 0),
// ];

// // Kolon toplamlarını hesaplayan fonksiyon
// const calculateColumnTotals = (rows) => {
//     const totals = rows.reduce((acc, row) => {
//         Object.keys(row).forEach((key) => {
//             if (key !== 'name') {
//                 acc[key] = (acc[key] || 0) + row[key];
//             }
//         });
//         return acc;
//     }, {});
//     return totals;
// };

export default function CustomTable() {
    // const columnTotals = calculateColumnTotals(rows);

    const [workItems, setWorkItems] = useState([]);

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
                            `https://dev.azure.com/${organization}/_apis/wit/workitems?ids=${idsChunk.join(',')}&fields=System.State,System.AssignedTo,System.TeamProject,System.Title,System.WorkItemType&api-version=7.2-preview.3`,
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

    // // System.State durumuna göre gruplama ve AssignedTo'nun displayName'ini elde etme
    // const stateCountsWithAssignee = workItems.reduce((acc, item) => {
    //     const state = item.fields['System.State'];
    //     const assignedTo = item.fields['System.AssignedTo'];

    //     // State varsa saymaya devam et
    //     if (state) {
    //       // State objesini oluştur veya güncelle
    //       acc[state] = acc[state] || { count: 0, assignees: {} };
    //       acc[state].count += 1;

    //       // AssignedTo varsa displayName'i assignees nesnesine ekle
    //       if (assignedTo && assignedTo.displayName) {
    //         const displayName = assignedTo.displayName;
    //         acc[state].assignees[displayName] = (acc[state].assignees[displayName] || 0) + 1;
    //       } else {
    //         // AssignedTo yoksa "blank" olarak atama yap
    //         acc[state].assignees["blank"] = (acc[state].assignees["blank"] || 0) + 1;
    //       }
    //     }

    //     return acc;
    //   }, {});

    console.log(workItems)
    console.log(stateCounts)
    // console.log(stateCountsWithAssignee);

    // workItems verisinden stateCountsWithAssignee nesnesini oluşturma
    const stateCountsWithAssignee = workItems.reduce((acc, item) => {
        const state = item.fields['System.State'];
        const assignedTo = item.fields['System.AssignedTo']
            ? item.fields['System.AssignedTo'].displayName
            : 'blank';

        if (state) {
            if (!acc[assignedTo]) {
                acc[assignedTo] = {};
            }
            acc[assignedTo][state] = (acc[assignedTo][state] || 0) + 1;
        }
        return acc;
    }, {});

    console.log(stateCountsWithAssignee);

    // Kolon başlıklarını ve row verilerini oluşturma
    const columns = new Set();
    Object.values(stateCountsWithAssignee).forEach(assigneeCounts => {
        Object.keys(assigneeCounts).forEach(state => {
            columns.add(state);
        });
    });

    // Tüm durumlar
    const allStates = Array.from(columns);
    const rows = Object.entries(stateCountsWithAssignee).map(([assignee, counts]) => {
        const row = { name: assignee };
        allStates.forEach(state => {
            row[state] = counts[state] || 0; // Eğer yoksa 0 atama
        });
        return row;
    });

    // Toplam hesaplama
    const totalCounts = {};
    rows.forEach(row => {
        Object.keys(row).forEach(key => {
            if (key !== 'name') {
                totalCounts[key] = (totalCounts[key] || 0) + row[key];
            }
        });
    });




    const [selectedAssignee, setSelectedAssignee] = useState(null); // Yeni state

    const handleRowClick = (assignee) => {
        setSelectedAssignee(assignee); // Satır tıklama olayını yönetme
    };



    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="custom table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="right"
                                className="MuiTableHead-root css-1x7t93e-MuiTableHead-root MuiTableCell-root MuiTableCell-head MuiTableCell-sizeMedium css-qcv3-MuiTableCell-root"
                            >

                            </TableCell>
                            {allStates.map((column) => (
                                <TableCell key={column} align="right">{column}</TableCell>
                            ))}
                            <TableCell align="left">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name} onClick={() => handleRowClick(row.name)}>
                                <TableCell
                                    align="right"
                                    component="th"
                                    scope="row"
                                    className="MuiTableHead-root css-1x7t93e-MuiTableHead-root MuiTableCell-root MuiTableCell-head MuiTableCell-sizeMedium css-qcv3-MuiTableCell-root"
                                >
                                    {row.name}
                                </TableCell>
                                {allStates.map((column) => (
                                    <TableCell key={column} align="right">{row[column]}</TableCell>
                                ))}
                                <TableCell
                                    align="left"
                                    className="MuiTableHead-root css-1x7t93e-MuiTableHead-root MuiTableRow-root MuiTableRow-head css-chk0ig-MuiTableRow-root MuiTableCell-root MuiTableCell-head MuiTableCell-alignRight MuiTableCell-sizeMedium css-lgd6ze-MuiTableCell-root"
                                >
                                    {Object.values(row).slice(1).reduce((sum, value) => sum + value, 0)}
                                </TableCell> {/* Toplam */}
                            </TableRow>
                        ))}

                        {/* Toplam satır */}
                        <TableRow>
                            <TableCell
                                align="right"
                                component="th"
                                scope="row"
                                className="MuiTableHead-root css-1x7t93e-MuiTableHead-root MuiTableCell-root MuiTableCell-head MuiTableCell-sizeMedium css-qcv3-MuiTableCell-root"
                            >
                                Total
                            </TableCell>
                            {allStates.map((column) => (
                                <TableCell
                                    key={column}
                                    align="right"
                                    className="MuiTableHead-root css-1x7t93e-MuiTableHead-root MuiTableCell-root MuiTableCell-head MuiTableCell-sizeMedium css-qcv3-MuiTableCell-root"
                                >
                                    {totalCounts[column] || 0}
                                </TableCell>
                            ))}
                            <TableCell
                                align="left"
                                className="MuiTableHead-root css-1x7t93e-MuiTableHead-root MuiTableCell-root MuiTableCell-head MuiTableCell-sizeMedium css-qcv3-MuiTableCell-root"
                            >
                                {Object.values(totalCounts).reduce((sum, value) => sum + value, 0)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            
            <br />

            {selectedAssignee && (
                <AssigneeDetails workItems={workItems} assignee={selectedAssignee} />
            )}
        </>
    );
}
