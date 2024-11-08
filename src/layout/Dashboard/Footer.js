import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link, Stack, Typography } from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

const Footer = () => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: '24px 16px 0px', mt: 'auto' }}>
    <Typography variant="caption">
      <Typography component={Link} variant="subtitle2" href="https://burakzeytinci.com/" target="_blank" underline="hover">
        burakzeytinci
      </Typography>
      &nbsp;&copy;&nbsp;2024&nbsp;
      <FormattedMessage id="all-rights-reserved" />
    </Typography>
    {/* <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
      <Link component={RouterLink} to="https://www.solmaz.com/tarihce-c-27" target="_blank" variant="caption" color="textPrimary">
        <FormattedMessage id="about-us" />
      </Link>
      <Link component={RouterLink} to="https://www.solmaz.com/kisisel-verilerin-korunmasi-c-93" target="_blank" variant="caption" color="textPrimary">
        <FormattedMessage id="privacy" />
      </Link>
      <Link component={RouterLink} to="https://www.solmaz.com/iletisim-s-20" target="_blank" variant="caption" color="textPrimary">
        <FormattedMessage id="support" />
      </Link>
    </Stack> */}
  </Stack>
);

export default Footer;
