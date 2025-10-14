import React from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent,
    Typography,
    Box,
    Chip,
    Link,
    Grid,
    Divider
} from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const PullRequestDetails = ({ pullRequest, open, onClose }) => {
    if (!pullRequest) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Pull Request #{pullRequest.pullRequestId}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            {pullRequest.title}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <Chip 
                                label={pullRequest.status}
                                color={pullRequest.status === 'completed' ? 'success' : 'default'}
                                size="small"
                                sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" color="textSecondary" component="span">
                                {format(new Date(pullRequest.creationDate), 'dd MMMM yyyy HH:mm', { locale: tr })}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Repository</Typography>
                        <Typography>{pullRequest.repository?.name}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Oluşturan</Typography>
                        <Typography>{pullRequest.createdBy?.displayName}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Açıklama</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {pullRequest.description || 'Açıklama bulunmuyor'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            <Link href={pullRequest.url} target="_blank" rel="noopener">
                                Azure DevOps&apos;ta Görüntüle
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default PullRequestDetails; 
