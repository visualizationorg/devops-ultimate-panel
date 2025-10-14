import { Grid, Card, CardHeader, CardContent } from '@mui/material';
import BuildsTable from 'sections/admin/builds-list/BuildsTable';

const BuildsPage = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader 
                        title="Builds" 
                        subheader="Tüm projelerdeki build'leri görüntüle ve filtrele"
                    />
                    <CardContent>
                        <BuildsTable />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default BuildsPage; 
