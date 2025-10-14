import React, { useMemo } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Box,
    LinearProgress,
    Tooltip
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { format, subMonths, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import { lineChartOptions } from 'utils/chartConfig';

const TrendAnalysis = ({ commits, pullRequests }) => {
    const trends = useMemo(() => {
        if (!commits?.length) return null;

        const startDate = subMonths(new Date(), 3);
        const endDate = new Date();
        
        // Haftalık aralıkları oluştur
        const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
        
        const weeklyStats = weeks.map(week => {
            const weekStart = startOfWeek(week);
            const weekEnd = endOfWeek(week);
            
            const weekCommits = commits.filter(commit => {
                const commitDate = new Date(commit.author.date);
                return commitDate >= weekStart && commitDate <= weekEnd;
            });

            const weekPRs = pullRequests?.filter(pr => {
                const prDate = new Date(pr.creationDate);
                return prDate >= weekStart && prDate <= weekEnd;
            }) || [];

            return {
                week: format(week, 'dd MMM', { locale: tr }),
                commits: weekCommits.length,
                prs: weekPRs.length,
                authors: new Set(weekCommits.map(c => c.author.name)).size
            };
        });

        // Büyüme oranları
        const growth = {
            commits: ((weeklyStats[weeklyStats.length - 1]?.commits || 0) / 
                     (weeklyStats[0]?.commits || 1) - 1) * 100,
            prs: ((weeklyStats[weeklyStats.length - 1]?.prs || 0) / 
                  (weeklyStats[0]?.prs || 1) - 1) * 100,
            authors: ((weeklyStats[weeklyStats.length - 1]?.authors || 0) / 
                     (weeklyStats[0]?.authors || 1) - 1) * 100
        };

        return { weeklyStats, growth };
    }, [commits, pullRequests]);

    if (!trends) return null;

    const chartData = {
        labels: trends.weeklyStats.map(stat => stat.week),
        datasets: [
            {
                label: 'Commitler',
                data: trends.weeklyStats.map(stat => stat.commits),
                borderColor: '#2196F3',
                tension: 0.1
            },
            {
                label: 'Pull Requestler',
                data: trends.weeklyStats.map(stat => stat.prs),
                borderColor: '#4CAF50',
                tension: 0.1
            },
            {
                label: 'Aktif Geliştiriciler',
                data: trends.weeklyStats.map(stat => stat.authors),
                borderColor: '#FFC107',
                tension: 0.1
            }
        ]
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            3 Aylık Trend Analizi
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <Line data={chartData} options={lineChartOptions} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Commit Büyüme Oranı
                        </Typography>
                        <Tooltip title="Son 3 aydaki büyüme">
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h4" color={trends.growth.commits > 0 ? 'success.main' : 'error.main'}>
                                    {trends.growth.commits.toFixed(1)}%
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={Math.min(Math.abs(trends.growth.commits), 100)}
                                    color={trends.growth.commits > 0 ? 'success' : 'error'}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Tooltip>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            PR Büyüme Oranı
                        </Typography>
                        <Tooltip title="Son 3 aydaki büyüme">
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h4" color={trends.growth.prs > 0 ? 'success.main' : 'error.main'}>
                                    {trends.growth.prs.toFixed(1)}%
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={Math.min(Math.abs(trends.growth.prs), 100)}
                                    color={trends.growth.prs > 0 ? 'success' : 'error'}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Tooltip>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Geliştirici Büyüme Oranı
                        </Typography>
                        <Tooltip title="Son 3 aydaki büyüme">
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h4" color={trends.growth.authors > 0 ? 'success.main' : 'error.main'}>
                                    {trends.growth.authors.toFixed(1)}%
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={Math.min(Math.abs(trends.growth.authors), 100)}
                                    color={trends.growth.authors > 0 ? 'success' : 'error'}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Tooltip>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default TrendAnalysis; 
