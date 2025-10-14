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
    TableRow,
    Chip
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { barChartOptions } from 'utils/chartConfig';

const RepositoryComparison = ({ repositories, commits, pullRequests }) => {
    const stats = useMemo(() => {
        if (!repositories?.length || !commits?.length) return null;

        const repoStats = repositories.map(repo => {
            const repoCommits = commits.filter(c => c.repository.id === repo.id);
            const repoPRs = pullRequests?.filter(pr => pr.repository.id === repo.id) || [];
            const last30Days = subDays(new Date(), 30);

            const recent = repoCommits.filter(c => 
                new Date(c.author.date) > last30Days
            ).length;

            return {
                id: repo.id,
                name: repo.name,
                totalCommits: repoCommits.length,
                recentCommits: recent,
                openPRs: repoPRs.filter(pr => pr.status === 'active').length,
                authors: new Set(repoCommits.map(c => c.author.name)).size
            };
        });

        return repoStats.sort((a, b) => b.totalCommits - a.totalCommits);
    }, [repositories, commits, pullRequests]);

    if (!stats) return null;

    const chartData = {
        labels: stats.map(repo => repo.name),
        datasets: [
            {
                label: 'Toplam Commit',
                data: stats.map(repo => repo.totalCommits),
                backgroundColor: '#2196F3'
            },
            {
                label: 'Son 30 Gün',
                data: stats.map(repo => repo.recentCommits),
                backgroundColor: '#4CAF50'
            }
        ]
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Repository Karşılaştırması
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <Bar data={chartData} options={barChartOptions} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Detaylı Karşılaştırma
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Repository</TableCell>
                                    <TableCell align="right">Toplam Commit</TableCell>
                                    <TableCell align="right">Son 30 Gün</TableCell>
                                    <TableCell align="right">Açık PR</TableCell>
                                    <TableCell align="right">Katkıda Bulunanlar</TableCell>
                                    <TableCell align="right">Aktivite</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stats.map(repo => (
                                    <TableRow key={repo.id}>
                                        <TableCell>{repo.name}</TableCell>
                                        <TableCell align="right">{repo.totalCommits}</TableCell>
                                        <TableCell align="right">{repo.recentCommits}</TableCell>
                                        <TableCell align="right">{repo.openPRs}</TableCell>
                                        <TableCell align="right">{repo.authors}</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                size="small"
                                                color={repo.recentCommits > 0 ? 'success' : 'default'}
                                                label={repo.recentCommits > 0 ? 'Aktif' : 'Pasif'}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default RepositoryComparison; 
