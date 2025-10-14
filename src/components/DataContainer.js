import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import LoadingScreen from './LoadingScreen';
import ErrorDisplay from './ErrorDisplay';
import NoData from './NoData';

const DataContainer = ({
    loading,
    error,
    data,
    onRetry,
    loadingMessage,
    errorMessage,
    noDataMessage,
    children,
    sx = {}
}) => {
    if (loading) {
        return <LoadingScreen message={loadingMessage} />;
    }

    if (error) {
        return (
            <ErrorDisplay 
                error={error}
                message={errorMessage}
                onRetry={onRetry}
            />
        );
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
        return <NoData message={noDataMessage} />;
    }

    return (
        <Box sx={sx}>
            {children}
        </Box>
    );
};

DataContainer.propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.object,
    data: PropTypes.any,
    onRetry: PropTypes.func,
    loadingMessage: PropTypes.string,
    errorMessage: PropTypes.string,
    noDataMessage: PropTypes.string,
    children: PropTypes.node,
    sx: PropTypes.object
};

export default DataContainer; 
