import { Link } from 'react-router-dom';

// project import
import { APP_DEFAULT_PATH } from 'config';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// assets
import construction from 'assets/images/maintenance/under-construction.svg';

// third-party
import { FormattedMessage } from 'react-intl';

// ==============================|| UNDER CONSTRUCTION - MAIN ||============================== //

function UnderConstruction() {
  return (
    <Grid container spacing={4} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', py: 2 }}>
      <Grid item xs={12}>
        <Box sx={{ width: { xs: 300, sm: 480 } }}>
          <img src={construction} alt="under-construction" style={{ width: '100%', height: 'auto' }} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Typography align="center" variant="h1">
            <FormattedMessage id="under-construction-title" />
          </Typography>
          <Typography color="textSecondary" align="center" sx={{ width: '85%' }}>
            <FormattedMessage id="under-construction-text" />
          </Typography>
          <Button component={Link} to={APP_DEFAULT_PATH} variant="contained">
            <FormattedMessage id="back-to-home" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default UnderConstruction;
