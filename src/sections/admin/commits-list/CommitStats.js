import React, { useMemo } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { lineChartOptions, barChartOptions } from 'utils/chartConfig';

const CommitStats = ({ commits, startDate, endDate }) => {
    const stats = useMemo(() => {
        if (!commits?.length) return null;

        // Son 30 günlük commit aktivitesi
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = subDays(new Date(), i);
            return format(date, 'yyyy-MM-dd');
        }).reverse();

        const dateRange = {
            start: startDate ? startOfDay(startDate) : subDays(new Date(), 30),
            end: endDate ? endOfDay(endDate) : new Date()
        };

        const filteredCommits = commits.filter(commit => 
            isWithinInterval(new Date(commit.author.date), dateRange)
        );

        const commitsByDate = filteredCommits.reduce((acc, commit) => {
            const date = format(new Date(commit.author.date), 'yyyy-MM-dd');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const authorStats = filteredCommits.reduce((acc, commit) => {
            const author = commit.author.name;
            acc[author] = (acc[author] || 0) + 1;
            return acc;
        }, {});

        const topAuthors = Object.entries(authorStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        return {
            dailyCommits: last30Days.map(date => commitsByDate[date] || 0),
            dates: last30Days.map(date => format(new Date(date), 'd MMM', { locale: tr })),
            topAuthors,
            totalCommits: filteredCommits.length
        };
    }, [commits, startDate, endDate]);

    if (!stats) return null;

    const activityData = {
        labels: stats.dates,
        datasets: [{
            label: 'Günlük Commit Sayısı',
            data: stats.dailyCommits,
            borderColor: '#2196F3',
            tension: 0.1
        }]
    };

    const authorData = {
        labels: stats.topAuthors.map(([author]) => author),
        datasets: [{
            label: 'Commit Sayısı',
            data: stats.topAuthors.map(([, count]) => count),
            backgroundColor: '#4CAF50'
        }]
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Commit Aktivitesi
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
                            En Aktif Geliştiriciler
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Bar data={authorData} options={barChartOptions} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Özet
                        </Typography>
                        <Typography variant="h4" component="div" gutterBottom>
                            {stats.totalCommits}
                        </Typography>
                        <Typography color="textSecondary">
                            Toplam Commit
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CommitStats; 
