import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, 
    Tabs, Tab, Box, Typography, 
    List, ListItem, ListItemText,
    Chip, Link, Paper
} from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useCommitDetails } from 'hooks/useAzureDevOps';
import DiffViewer from 'components/DiffViewer';

const CommitDetails = ({ commit, open, onClose }) => {
    const [tabValue, setTabValue] = useState(0);
    const { data: details, loading } = useCommitDetails(
        commit?.repository?.project?.name,
        commit?.repository?.id,
        commit?.commitId
    );

    if (!commit) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="div">
                    Commit: {commit.commitId.slice(0, 7)}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                    {commit.comment}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Detaylar" />
                    <Tab label="Değişiklikler" />
                </Tabs>

                <Box role="tabpanel" hidden={tabValue !== 0} sx={{ mt: 2 }}>
                    {tabValue === 0 && (
                        <List>
                            <ListItem>
                                <ListItemText 
                                    primary="Yazar"
                                    secondary={commit.author.name}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Tarih"
                                    secondary={format(
                                        new Date(commit.author.date),
                                        'dd MMMM yyyy HH:mm',
                                        { locale: tr }
                                    )}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Repository"
                                    secondary={commit.repository.name}
                                />
                            </ListItem>
                            {details?.stats && (
                                <ListItem>
                                    <Box>
                                        <Chip 
                                            label={`${details.stats.additions} ekleme`}
                                            color="success"
                                            size="small"
                                            sx={{ mr: 1 }}
                                        />
                                        <Chip 
                                            label={`${details.stats.deletions} silme`}
                                            color="error"
                                            size="small"
                                        />
                                    </Box>
                                </ListItem>
                            )}
                        </List>
                    )}
                </Box>

                <Box role="tabpanel" hidden={tabValue !== 1} sx={{ mt: 2 }}>
                    {tabValue === 1 && (
                        loading ? (
                            <Typography>Yükleniyor...</Typography>
                        ) : (
                            details?.changes?.map((change, index) => (
                                <Paper key={index} sx={{ mb: 2, p: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {change.item.path}
                                    </Typography>
                                    <DiffViewer 
                                        oldContent={change.originalContent}
                                        newContent={change.content}
                                    />
                                </Paper>
                            ))
                        )
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CommitDetails; 
