import { Box, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const LoadingScreen = ({ message = 'Yükleniyor...', fullScreen = false }) => {
    const content = (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            sx={{ 
                p: 3,
                minHeight: fullScreen ? '100vh' : '200px',
                width: '100%'
            }}
        >
            <CircularProgress />
            {message && (
                <Typography variant="body2" color="textSecondary">
                    {message}
                </Typography>
            )}
        </Box>
    );

    if (fullScreen) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'background.paper',
                    zIndex: 9999
                }}
            >
                {content}
            </Box>
        );
    }

    return content;
};

LoadingScreen.propTypes = {
    message: PropTypes.string,
    fullScreen: PropTypes.bool
};

export default LoadingScreen; 
