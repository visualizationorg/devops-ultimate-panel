import { useMemo } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Portal } from '@mui/base/Portal';
import { Pagination as MuiPagination } from '@mui/material';

// mui data grid
import {
    DataGrid,
    // GridActionsCellItem,
    // GridColumnMenu,
    gridClasses,
    gridPageCountSelector,
    GridPagination,
    // GridToolbar,
    // GridToolbarColumnsButton,
    // GridToolbarContainer,
    // GridToolbarDensitySelector,
    // GridToolbarFilterButton,
    GridToolbarQuickFilter,
    trTR,
    enUS,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';

// project-import
import { ThemeMode } from 'config';

// third-party
import { useIntl } from 'react-intl';

// ==============================|| GRID PAGINATION ||============================== //
function Pagination({ page, onPageChange, className }) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <MuiPagination
            variant="outlined"
            shape="rounded"
            color="primary"
            className={className}
            count={pageCount}
            page={page + 1}
            onChange={(event, newPage) => {
                onPageChange(event, newPage - 1);
            }}
        />
    );
};

Pagination.propTypes = {
    className: PropTypes.string,
    /**
     * Callback fired when the page is changed.
     *
     * @param {React.MouseEvent<HTMLButtonElement> | null} event The event source of the callback.
     * @param {number} page The page selected.
     */
    onPageChange: PropTypes.func.isRequired,
    /**
     * The zero-based index of the current page.
     */
    page: PropTypes.number.isRequired,
};

function CustomPagination(props) {
    return <GridPagination ActionsComponent={Pagination} {...props} />;
};

function CustomToolbar() {
    return (
        <Portal container={() => document.getElementById('filter-panel')}>
            <GridToolbarQuickFilter variant="outlined" size="small" />
        </Portal>
    );
};

// ==============================|| GRID SKELETON ||============================== //
export default function GridSkeleton(props) {
    const theme = useTheme();
    const intl = useIntl();

    const localeText = useMemo(
        () => {
            if (theme.language === 'tr')
                return trTR.components.MuiDataGrid.defaultProps.localeText;
            // else if (theme.language === 'en')
            else
                return enUS.components.MuiDataGrid.defaultProps.localeText;
        },
        // eslint-disable-next-line
        [theme, intl]
    );

    return (
        <DataGrid
            {...props}
            localeText={{
                ...localeText,
                MuiTablePagination: {
                    ...localeText.MuiTablePagination,
                    labelDisplayedRows: ({ from, to, count }) =>
                        `${from}-${to} / ${count}`,
                },
            }}
            ignoreDiacritics
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            sx={{
                [`& .${gridClasses.row}.even`]: (theme.palette.mode === ThemeMode.LIGHT) ? {
                    backgroundColor: theme.palette.background.default,
                    '&:hover, &.Mui-hovered': {
                        backgroundColor: theme.palette.divider,
                        '@media (hover: none)': {
                            backgroundColor: 'transparent',
                        },
                    },
                } : {},
                ...props.sx
            }}
            slots={{ pagination: CustomPagination, toolbar: CustomToolbar, ...props.slots }}
            // slotProps={{
            //     toolbar: {
            //         showQuickFilter: true,
            //         printOptions: { disableToolbarButton: true },
            //         csvOptions: { disableToolbarButton: true },
            //     },
            // }}
            // style={{ backgroundColor: 'white' }}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: props.pageSize ?? 10,
                        /* page: 0 // default value will be used if not passed */
                    },
                },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            autoHeight={true}
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
        />
    );
};
