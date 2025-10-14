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
    Avatar,
    Stack,
    Chip
} from '@mui/material';
import { format, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';

const TeamCollaboration = ({ commits, pullRequests }) => {
    const stats = useMemo(() => {
        if (!commits?.length) return null;

        const developers = {};
        const lastMonth = subMonths(new Date(), 1);

        commits.forEach(commit => {
            const author = commit.author.name;
            const commitDate = new Date(commit.author.date);
            
            if (!developers[author]) {
                developers[author] = {
                    name: author,
                    avatar: commit.author.imageUrl,
                    totalCommits: 0,
                    recentCommits: 0,
                    pullRequests: 0,
                    reviewedPRs: 0,
                    repositories: new Set()
                };
            }

            developers[author].totalCommits++;
            developers[author].repositories.add(commit.repository.name);
            
            if (commitDate > lastMonth) {
                developers[author].recentCommits++;
            }
        });

        // PR istatistiklerini ekle
        pullRequests?.forEach(pr => {
            const author = pr.createdBy.displayName;
            if (developers[author]) {
                developers[author].pullRequests++;
            }

            // Review'ları say
            pr.reviewers?.forEach(reviewer => {
                if (developers[reviewer.displayName]) {
                    developers[reviewer.displayName].reviewedPRs++;
                }
            });
        });

        return Object.values(developers)
            .map(dev => ({
                ...dev,
                repositories: dev.repositories.size,
                collaborationScore: (
                    dev.recentCommits * 2 + 
                    dev.pullRequests * 3 + 
                    dev.reviewedPRs * 2
                ) / 7
            }))
            .sort((a, b) => b.collaborationScore - a.collaborationScore);
    }, [commits, pullRequests]);

    if (!stats) return null;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Takım İş Birliği Metrikleri
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Geliştirici</TableCell>
                                    <TableCell align="center">Son Ay Commits</TableCell>
                                    <TableCell align="center">Pull Requests</TableCell>
                                    <TableCell align="center">Code Reviews</TableCell>
                                    <TableCell align="center">Repositories</TableCell>
                                    <TableCell align="right">İş Birliği Skoru</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stats.map((dev) => (
                                    <TableRow key={dev.name}>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar src={dev.avatar} />
                                                <Typography>{dev.name}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">{dev.recentCommits}</TableCell>
                                        <TableCell align="center">{dev.pullRequests}</TableCell>
                                        <TableCell align="center">{dev.reviewedPRs}</TableCell>
                                        <TableCell align="center">{dev.repositories}</TableCell>
                                        <TableCell align="right">
                                            <Chip 
                                                label={dev.collaborationScore.toFixed(1)}
                                                color={dev.collaborationScore > 5 ? 'success' : 'default'}
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

export default TeamCollaboration; 
