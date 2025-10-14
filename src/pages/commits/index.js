import { Grid, Card, CardHeader, CardContent } from '@mui/material';
import CommitsTable from 'sections/admin/commits-list/CommitsTable';

const CommitsPage = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader 
                        title="Commits" 
                        subheader="Tüm projelerdeki commit'leri görüntüle ve filtrele"
                    />
                    <CardContent>
                        <CommitsTable />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CommitsPage; 
