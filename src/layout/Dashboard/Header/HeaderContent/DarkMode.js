// material-ui
import { Box, Tooltip } from '@mui/material';

// project import
import IconButton from 'components/@extended/IconButton';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

// ==============================|| HEADER CONTENT - DARK MODE ||============================== //

const DarkMode = () => {
  const { mode, onChangeMode } = useConfig();

  const handleModeChange = () => {
    if (mode === ThemeMode.LIGHT)
      onChangeMode(ThemeMode.DARK);
    else
      onChangeMode(ThemeMode.LIGHT);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title={mode === ThemeMode.LIGHT ? 'Dark Mode' : 'Light Mode'}>
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'text.primary', bgcolor: 'transparent' }}
          aria-label="dark mode toggler"
          onClick={handleModeChange}
        >
          {mode === ThemeMode.LIGHT ? <MoonOutlined /> : <SunOutlined />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default DarkMode;
