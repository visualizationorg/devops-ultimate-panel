import { DataGrid } from '@mui/x-data-grid';
import { Box, LinearProgress } from '@mui/material';
import PropTypes from 'prop-types';
import NoData from 'components/NoData';

const CustomDataGrid = ({
    rows = [],
    columns = [],
    loading = false,
    error = null,
    pageSize = 10,
    ...props
}) => {
    const defaultProps = {
        autoHeight: true,
        disableColumnMenu: true,
        disableSelectionOnClick: true,
        pageSize,
        rowsPerPageOptions: [5, 10, 25, 50],
        components: {
            LoadingOverlay: LinearProgress,
            NoRowsOverlay: () => (
                <NoData message={error ? error.message : 'Görüntülenecek veri bulunamadı'} />
            )
        },
        sx: {
            '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'background.neutral',
                borderRadius: 1
            },
            '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'divider'
            },
            '& .MuiDataGrid-columnSeparator': {
                display: 'none'
            },
            '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover'
            },
            ...props.sx
        }
    };

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <DataGrid
                {...defaultProps}
                {...props}
                rows={rows}
                columns={columns}
                loading={loading}
            />
        </Box>
    );
};

CustomDataGrid.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.object,
    pageSize: PropTypes.number,
    sx: PropTypes.object
};

export default CustomDataGrid; 
