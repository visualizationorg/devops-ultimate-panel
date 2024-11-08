import { Link } from 'react-router-dom';

// project import
import { APP_DEFAULT_PATH } from 'config';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Button, Grid, Stack, Typography } from '@mui/material';

// assets
import error500 from 'assets/images/maintenance/Error500.png';

// third-party
import { FormattedMessage } from 'react-intl';

// ==============================|| ERROR 500 - MAIN ||============================== //

function Error500() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
      <Grid item xs={12}>
        <Box sx={{ width: { xs: 350, sm: 396 } }}>
          <img src={error500} alt="Error" style={{ height: '100%', width: '100%' }} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack justifyContent="center" alignItems="center">
          <Typography align="center" variant={matchDownSM ? 'h2' : 'h1'} gutterBottom>
            <FormattedMessage id="500-title" />
          </Typography>
          <Typography color="textSecondary" variant="body2" align="center" sx={{ width: { xs: '73%', sm: '70%' } }} gutterBottom>
            <FormattedMessage id="500-text" />
          </Typography>
          <Typography variant="subtitle2" align="center" sx={{ width: { xs: '73%', sm: '70%' } }}>
            <FormattedMessage id="500-text2" />
          </Typography>
          <Typography variant="subtitle2" align="center" sx={{ width: { xs: '73%', sm: '70%' } }}>
            <FormattedMessage id="500-text3" />
          </Typography>
          <Typography variant="subtitle2" align="center" sx={{ width: { xs: '73%', sm: '70%' } }}>
            <FormattedMessage id="500-text4" />
          </Typography>
          <Button component={Link} to={APP_DEFAULT_PATH} variant="contained" sx={{ textTransform: 'none', mt: 2 }}>
            <FormattedMessage id="back-to-home" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Error500;
