import { Box, Typography } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';

const NoData = ({ 
    message = 'Görüntülenecek veri bulunamadı',
    icon: Icon = InboxOutlined,
    sx = {} 
}) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            sx={{ 
                p: 4,
                minHeight: '200px',
                width: '100%',
                ...sx
            }}
        >
            <Icon sx={{ fontSize: 48, color: 'action.disabled' }} />
            <Typography variant="body2" color="textSecondary">
                {message}
            </Typography>
        </Box>
    );
};

NoData.propTypes = {
    message: PropTypes.string,
    icon: PropTypes.elementType,
    sx: PropTypes.object
};

export default NoData; 
