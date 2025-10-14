import React, { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Stack } from '@mui/material';

// project imports
import CustomGrid from 'components/DataGrid';
import MainCard from 'components/MainCard';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// ==============================|| USER LIST ||============================== //

export default function UserList() {
  const theme = useTheme();
  const intl = useIntl();

  const items = useLoaderData();
  const rows = items?.value || [];

  const columns = useMemo(
    () => [
      {
        field: 'descriptor',
        headerName: 'ID',
        description: 'ID',
        flex: 1,
        minWidth: 150,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'displayName',
        headerName: intl.formatMessage({ id: "user" }),
        description: intl.formatMessage({ id: "user" }),
        flex: 1,
        minWidth: 150
      },
      {
        field: 'subjectKind',
        headerName: "subjectKind",
        description: "subjectKind",
        flex: 1,
        minWidth: 150
      },
      {
        field: 'domain',
        headerName: "domain",
        description: "domain",
        flex: 1,
        minWidth: 150
      },
      {
        field: 'mailAddress',
        headerName: "mailAddress",
        description: "mailAddress",
        flex: 1,
        minWidth: 150
      },
      {
        field: 'origin',
        headerName: "origin",
        description: "origin",
        flex: 1,
        minWidth: 150
      },
    ],
    // eslint-disable-next-line
    [theme, intl]
  );

  return (
    <>
      <MainCard
        content={false}
        title={<FormattedMessage id="user-list" />}
        secondary={
          <Stack direction="row" spacing={2}>
            <Box id="filter-panel" />
          </Stack>
        }
      >
        <CustomGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.descriptor}
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
