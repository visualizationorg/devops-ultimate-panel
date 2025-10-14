import React, { useMemo } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { lineChartOptions, barChartOptions } from 'utils/chartConfig';

const RepositoryStats = ({ commits, pullRequests }) => {
    const stats = useMemo(() => {
        if (!commits?.length) return null;

        // Son 30 günlük commit aktivitesi
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = subDays(new Date(), i);
            return format(date, 'yyyy-MM-dd');
        }).reverse();

        const commitActivity = last30Days.map(date => {
            return commits.filter(commit => 
                format(new Date(commit.author.date), 'yyyy-MM-dd') === date
            ).length;
        });

        // Repository bazlı commit sayıları
        const repoCommits = commits.reduce((acc, commit) => {
            const repo = commit.repository?.name;
            if (repo) {
                acc[repo] = (acc[repo] || 0) + 1;
            }
            return acc;
        }, {});

        return {
            commitActivity,
            repoCommits,
            totalCommits: commits.length,
            totalPRs: pullRequests?.length || 0,
            dates: last30Days.map(date => format(new Date(date), 'd MMM', { locale: tr }))
        };
    }, [commits, pullRequests]);

    if (!stats) return null;

    const activityData = {
        labels: stats.dates,
        datasets: [{
            label: 'Günlük Commit Sayısı',
            data: stats.commitActivity,
            fill: false,
            borderColor: '#2196F3',
            tension: 0.1
        }]
    };

    const repoData = {
        labels: Object.keys(stats.repoCommits),
        datasets: [{
            label: 'Repository Bazlı Commit Sayısı',
            data: Object.values(stats.repoCommits),
            backgroundColor: '#4CAF50'
        }]
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Commit Aktivitesi (Son 30 Gün)
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Line data={activityData} options={lineChartOptions} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Repository Bazlı Dağılım
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Bar data={repoData} options={barChartOptions} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Genel İstatistikler
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                Toplam Commit: {stats.totalCommits}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Toplam PR: {stats.totalPRs}
                            </Typography>
                            <Typography variant="body1">
                                Repository Sayısı: {Object.keys(stats.repoCommits).length}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default RepositoryStats; 
