import React, { useMemo } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { format, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { pieChartOptions, barChartOptions } from 'utils/chartConfig';

const PullRequestStats = ({ pullRequests }) => {
    const stats = useMemo(() => {
        if (!pullRequests?.length) return null;

        const statusCounts = pullRequests.reduce((acc, pr) => {
            acc[pr.status] = (acc[pr.status] || 0) + 1;
            return acc;
        }, {});

        const repoStats = pullRequests.reduce((acc, pr) => {
            const repo = pr.repository?.name;
            if (repo) {
                acc[repo] = (acc[repo] || 0) + 1;
            }
            return acc;
        }, {});

        const avgTimeToMerge = pullRequests
            .filter(pr => pr.status === 'completed')
            .reduce((acc, pr) => {
                return acc + differenceInDays(
                    new Date(pr.closedDate),
                    new Date(pr.creationDate)
                );
            }, 0) / (pullRequests.filter(pr => pr.status === 'completed').length || 1);

        return {
            totalPRs: pullRequests.length,
            statusCounts,
            repoStats,
            avgTimeToMerge
        };
    }, [pullRequests]);

    if (!stats) return null;

    const statusData = {
        labels: Object.keys(stats.statusCounts),
        datasets: [{
            data: Object.values(stats.statusCounts),
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
        }]
    };

    const repoData = {
        labels: Object.keys(stats.repoStats),
        datasets: [{
            label: 'Pull Request Sayısı',
            data: Object.values(stats.repoStats),
            backgroundColor: '#2196F3'
        }]
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Genel Bakış
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1">
                                Toplam PR: {stats.totalPRs}
                            </Typography>
                            <Typography variant="body1">
                                Ortalama Merge Süresi: {stats.avgTimeToMerge.toFixed(1)} gün
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Durum Dağılımı
                        </Typography>
                        <Box sx={{ height: 200 }}>
                            <Pie data={statusData} options={pieChartOptions} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Repository Dağılımı
                        </Typography>
                        <Box sx={{ height: 200 }}>
                            <Bar data={repoData} options={barChartOptions} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PullRequestStats; 
