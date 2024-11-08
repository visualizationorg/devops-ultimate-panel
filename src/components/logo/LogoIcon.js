import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// project-import
import { ThemeMode } from 'config';

import logoIconDark from 'assets/logos/slogolight.png';
import logoIcon from 'assets/logos/slogo.png';

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = ({ height = null, width = null }) => {
  const theme = useTheme();

  return (
    <img
      src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon}
      alt="Logo"
      style={{
        width: width ?? '100',
        ...(height ? { height: height } : {})
      }}
    />
  );
};

LogoIcon.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string
};

export default LogoIcon;
