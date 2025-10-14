import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent,
    Tabs,
    Tab,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Link
} from '@mui/material';
import { 
    Commit as CommitIcon,
    MergeType,
    Person,
    Schedule
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Line } from 'react-chartjs-2';
import { lineChartOptions } from 'utils/chartConfig';

const TabPanel = ({ children, value, index, ...other }) => (
    <div role="tabpanel" hidden={value !== index} {...other}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
);

const RepositoryDetails = ({ repository, commits, pullRequests, open, onClose }) => {
    const [tabValue, setTabValue] = useState(0);

    if (!repository) return null;

    const commitsByDate = commits?.reduce((acc, commit) => {
        const date = format(new Date(commit.author.date), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const commitData = {
        labels: Object.keys(commitsByDate),
        datasets: [{
            label: 'Commit Sayısı',
            data: Object.values(commitsByDate),
            borderColor: '#2196F3',
            tension: 0.1
        }]
    };

    const topContributors = commits?.reduce((acc, commit) => {
        const author = commit.author.name;
        acc[author] = (acc[author] || 0) + 1;
        return acc;
    }, {});

    const sortedContributors = Object.entries(topContributors)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {repository.name}
                <Typography variant="subtitle2" color="textSecondary">
                    {repository.project?.name}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Genel Bakış" />
                    <Tab label="Commit Analizi" />
                    <Tab label="Katkıda Bulunanlar" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <List>
                        <ListItem>
                            <ListItemIcon><CommitIcon /></ListItemIcon>
                            <ListItemText 
                                primary="Toplam Commit" 
                                secondary={commits?.length || 0} 
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><MergeType /></ListItemIcon>
                            <ListItemText 
                                primary="Açık Pull Request" 
                                secondary={pullRequests?.filter(pr => pr.status === 'active').length || 0} 
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText 
                                primary="Katkıda Bulunanlar" 
                                secondary={Object.keys(topContributors || {}).length} 
                            />
                        </ListItem>
                    </List>
                    <Box sx={{ mt: 2 }}>
                        <Link href={repository.remoteUrl} target="_blank" rel="noopener">
                            Repository&apos;yi Azure DevOps&apos;ta Aç
                        </Link>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ height: 300 }}>
                        <Line data={commitData} options={lineChartOptions} />
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <List>
                        {sortedContributors.map(([author, count]) => (
                            <ListItem key={author}>
                                <ListItemIcon><Person /></ListItemIcon>
                                <ListItemText 
                                    primary={author}
                                    secondary={`${count} commit`}
                                />
                                <Chip 
                                    label={`${Math.round(count / commits.length * 100)}%`}
                                    color="primary"
                                    size="small"
                                />
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
};

export default RepositoryDetails; 
