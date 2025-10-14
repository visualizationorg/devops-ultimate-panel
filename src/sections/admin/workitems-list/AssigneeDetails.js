import React from 'react';
import {
    Table, 
    TableBody, 
    TableCell, 
    TableContainer,
    TableHead, 
    TableRow, 
    Paper
} from '@mui/material';

export default function AssigneeDetails({ workItems, assignee }) {
    const filteredWorkItems = workItems.filter(item => {
        const displayName = item.fields['System.AssignedTo']?.displayName || 'blank';
        return displayName === assignee;
    });

    return (
        <TableContainer component={Paper}>
            <Table aria-label="assignee details">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>Assigned To</TableCell>
                        <TableCell>Team Project</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Work Item Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredWorkItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.fields['System.State']}</TableCell>
                            <TableCell>{item.fields['System.AssignedTo']?.displayName || 'blank'}</TableCell>
                            <TableCell>{item.fields['System.TeamProject']}</TableCell>
                            <TableCell>{item.fields['System.Title']}</TableCell>
                            <TableCell>{item.fields['System.WorkItemType']}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
