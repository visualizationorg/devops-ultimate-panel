// material-ui
import { Grid, Typography, Button, Stack, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import { ThemeMode, ThemeDirection } from 'config';

// assets
import WelcomeImage from 'assets/images/analytics/welcome-banner.png';
import WelcomeImageArrow from 'assets/images/analytics/welcome-arrow.png';

// third-party
import { FormattedMessage } from 'react-intl';

// ==============================|| ANALYTICS - WELCOME ||============================== //

const WelcomeBanner = () => {
  const theme = useTheme();

  return (
    <MainCard
      border={false}
      sx={{
        background:
          theme.direction === ThemeDirection.RTL
            ? `linear-gradient(60.38deg, ${theme.palette.primary.lighter} 114%, ${theme.palette.primary.light} 34.42%, ${theme.palette.primary.main} 60.95%, ${theme.palette.primary.dark} 84.83%, ${theme.palette.primary.darker} 104.37%)`
            : `linear-gradient(250.38deg, ${theme.palette.primary.lighter} 2.39%, ${theme.palette.primary.light} 34.42%, ${theme.palette.primary.main} 60.95%, ${theme.palette.primary.dark} 84.83%, ${theme.palette.primary.darker} 104.37%)`
      }}
    >
      <Grid container>
        <Grid item md={6} sm={6} xs={12}>
          <Stack spacing={2} sx={{ padding: 3.4 }}>
            <Typography variant="h2" color={theme.palette.background.paper}>
              <FormattedMessage id="welcome" />
            </Typography>
            <Typography variant="h6" color={theme.palette.background.paper}>
              Never accessed users affected cost, pipeline agent useage and effective useage of MS Hosted free agents.
            </Typography>
            <Box>
              <Button
                disableElevation
                variant="outlined"
                color="secondary"
                sx={{
                  cursor: 'default',
                  color: theme.palette.background.paper,
                  borderColor: theme.palette.background.paper,
                  '&:hover': {
                    color: 'background.paper',
                    borderColor: theme.palette.background.paper,
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.darker' : 'primary.main'
                  }
                }}
              >
                ORGANIZATION : {process.env.REACT_APP_ORGANIZATION}
              </Button>
            </Box>
          </Stack>
        </Grid>
        <Grid item sm={6} xs={12} sx={{ display: { xs: 'none', sm: 'initial' } }}>
          <Stack sx={{ position: 'relative', pr: { sm: 3, md: 8 } }} justifyContent="center" alignItems="flex-end">
            <img src={WelcomeImage} alt="Welcome" />
            <Box sx={{ position: 'absolute', bottom: 0, right: '10%' }}>
              <img src={WelcomeImageArrow} alt="Welcome Arrow" />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default WelcomeBanner;
