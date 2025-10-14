import React, { useMemo } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import { format, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';

const PerformanceMetrics = ({ commits, pullRequests }) => {
    const metrics = useMemo(() => {
        if (!commits?.length) return null;

        // PR çözüm süresi
        const prResolutionTime = pullRequests
            ?.filter(pr => pr.status === 'completed')
            .map(pr => ({
                id: pr.pullRequestId,
                title: pr.title,
                duration: differenceInDays(
                    new Date(pr.closedDate),
                    new Date(pr.creationDate)
                )
            })) || [];

        // Commit sıklığı
        const commitFrequency = commits.reduce((acc, commit) => {
            const author = commit.author.name;
            const date = format(new Date(commit.author.date), 'yyyy-MM');
            
            if (!acc[author]) acc[author] = {};
            acc[author][date] = (acc[author][date] || 0) + 1;
            
            return acc;
        }, {});

        return {
            prResolutionTime,
            commitFrequency,
            avgPRResolutionTime: prResolutionTime.reduce((acc, pr) => acc + pr.duration, 0) / 
                                (prResolutionTime.length || 1)
        };
    }, [commits, pullRequests]);

    if (!metrics) return null;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            PR Çözüm Süreleri
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>PR #</TableCell>
                                    <TableCell>Başlık</TableCell>
                                    <TableCell align="right">Süre (Gün)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {metrics.prResolutionTime.map(pr => (
                                    <TableRow key={pr.id}>
                                        <TableCell>{pr.id}</TableCell>
                                        <TableCell>{pr.title}</TableCell>
                                        <TableCell align="right">{pr.duration}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Ortalama Çözüm Süresi: {metrics.avgPRResolutionTime.toFixed(1)} gün
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Aylık Commit Sıklığı
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Geliştirici</TableCell>
                                    <TableCell align="right">Bu Ay</TableCell>
                                    <TableCell align="right">Geçen Ay</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(metrics.commitFrequency).map(([author, months]) => {
                                    const currentMonth = format(new Date(), 'yyyy-MM');
                                    const lastMonth = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM');
                                    
                                    return (
                                        <TableRow key={author}>
                                            <TableCell>{author}</TableCell>
                                            <TableCell align="right">{months[currentMonth] || 0}</TableCell>
                                            <TableCell align="right">{months[lastMonth] || 0}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PerformanceMetrics; 
