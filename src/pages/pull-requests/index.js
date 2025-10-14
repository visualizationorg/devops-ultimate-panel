import { Grid, Card, CardHeader, CardContent } from '@mui/material';
import PullRequestsTable from 'sections/admin/pull-requests/PullRequestsTable';

const PullRequestsPage = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader 
                        title="Pull Requests" 
                        subheader="Tüm projelerdeki pull request'leri görüntüle ve filtrele"
                    />
                    <CardContent>
                        <PullRequestsTable />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PullRequestsPage; 
