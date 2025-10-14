import React, { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Link, Stack } from '@mui/material';

// project imports
import CustomGrid from 'components/DataGrid';
import MainCard from 'components/MainCard';
import { getStorageValue, STORAGE_KEYS } from 'utils/storage';

// assets
import { Link as LinkIcon, Lock as LockIcon, Public as PublicIcon } from '@mui/icons-material/';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';

// ==============================|| PROJECT LIST ||============================== //

export default function ProjectList() {
  const theme = useTheme();
  const intl = useIntl();

  const items = useLoaderData();
  const rows = items?.value || [];

  const columns = useMemo(
    () => [
      {
        field: 'name',
        headerName: intl.formatMessage({ id: "name" }),
        description: intl.formatMessage({ id: "name" }),
        flex: 1,
        minWidth: 150
      },
      {
        field: 'description',
        headerName: intl.formatMessage({ id: "description" }),
        description: intl.formatMessage({ id: "description" }),
        flex: 2,
        minWidth: 150
      },
      {
        field: 'lastUpdateTime',
        headerName: "Son Güncelleme",
        description: "Son Güncelleme",
        flex: 1,
        minWidth: 150,
        renderCell: (params) => Boolean(params.value) && moment(params.value).format('LLL')
      },
      {
        field: 'visibility',
        headerName: 'Visibility',
        description: 'Visibility',
        flex: 0.5,
        minWidth: 100,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          params.value === 'public'
            ? <PublicIcon style={{ fontSize: '20px', color: theme.palette.success.main }} />
            : <LockIcon style={{ fontSize: '20px', color: theme.palette.error.main }} />
        ),
      },
      {
        field: 'url',
        headerName: intl.formatMessage({ id: "url" }),
        description: intl.formatMessage({ id: "url" }),
        flex: 0.5,
        minWidth: 100,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {
          const organization = getStorageValue(STORAGE_KEYS.ORGANIZATION, '');
          const projectUrl = `https://dev.azure.com/${organization}/${params.row.id}`;
          return (
            <Link href={projectUrl} target="_blank" rel="noopener">
              <LinkIcon style={{ fontSize: '20px', color: theme.palette.primary.main }} />
            </Link>
          );
        },
      },
    ],
    // eslint-disable-next-line
    [theme, intl]
  );

  return (
    <>
      <MainCard
        content={false}
        title={<FormattedMessage id="project-list" />}
        secondary={
          <Stack direction="row" spacing={2}>
            <Box id="filter-panel" />
          </Stack>
        }
      >
        <CustomGrid
          rows={rows}
          columns={columns}
          // getRowId={(row) => row.originId}
          getRowHeight={() => 'auto'}
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal",
              lineHeight: "normal"
            },
            "& .MuiDataGrid-columnHeader": {
              // Forced to use important since overriding inline styles
              height: "unset !important"
            },
            "& .MuiDataGrid-columnHeaders": {
              // Forced to use important since overriding inline styles
              maxHeight: "168px !important"
            },
            "& .MuiDataGrid-row": {
              minHeight: "66.5px !important"
              // maxHeight: "168px !important"
            },
            // "& .MuiDataGrid-cell": {
            //   // Forced to use important since overriding inline styles
            //   whiteSpace: "normal",
            //   lineHeight: "normal",
            //   height: "unset !important",
            // }
            '& .MuiDataGrid-cell:first-of-type': {
              paddingLeft: '24px', // Add extra space for first column
            },
            '& .MuiDataGrid-columnHeader:first-of-type': {
              paddingLeft: '24px', // Add extra space for first header
            },
          }}
        />
      </MainCard>
    </>
  );
}
