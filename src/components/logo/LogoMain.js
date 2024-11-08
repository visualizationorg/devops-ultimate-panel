import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// project-import
import { ThemeMode } from 'config';

import logoDark from 'assets/logos/logolight.png';
import logo from 'assets/logos/logo.png';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = ({ height = null, width = null }) => {
  const theme = useTheme();

  return (
    <img
      src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo}
      alt="Logo"
      style={{
        width: width ?? '100',
        ...(height ? { height: height } : {})
      }}
    />
  );
};

LogoMain.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string
};

export default LogoMain;
