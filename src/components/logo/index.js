import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project import
import Logo from './LogoMain';
import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from 'config';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ isIcon, height, sx, to }) => {

  return (
    <ButtonBase disableRipple component={Link} to={!to ? APP_DEFAULT_PATH : to} sx={sx}>
      {isIcon
        ? <LogoIcon width='35px' />
        : <Logo height={height ?? '23px'} />
      }
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  isIcon: PropTypes.bool,
  height: PropTypes.string,
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
