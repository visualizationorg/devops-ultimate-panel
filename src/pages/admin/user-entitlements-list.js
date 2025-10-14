import React, { useMemo } from 'react';
import { useLoaderData, } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Stack } from '@mui/material';

// project imports
import CustomGrid from 'components/DataGrid';
import MainCard from 'components/MainCard';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';

// ==============================|| USER ENTITLEMENTS LIST ||============================== //

export default function UserList() {
  const theme = useTheme();
  const intl = useIntl();

  const items = useLoaderData();
  const rows = items?.members || [];

  const columns = useMemo(
    () => [
      // {
      //   field: 'id',
      //   headerName: 'ID',
      //   description: 'ID',
      //   flex: 1,
      //   minWidth: 150,
      //   headerAlign: 'center',
      //   align: 'center'
      // },
      {
        field: 'user',
        headerName: intl.formatMessage({ id: "user" }),
        description: intl.formatMessage({ id: "user" }),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => params.row.user.displayName
      },
      {
        field: 'mailAddress',
        headerName: "mailAddress",
        description: "mailAddress",
        flex: 1,
        minWidth: 150,
        renderCell: (params) => params.row.user.mailAddress
      },
      {
        field: 'licenseDisplayName',
        headerName: "Access Level",
        description: "Access Level",
        flex: 1,
        minWidth: 150,
        renderCell: (params) => params.row.accessLevel.licenseDisplayName
      },
      {
        field: 'lastAccessedDate',
        headerName: "lastAccessedDate",
        description: "lastAccessedDate",
        flex: 1,
        minWidth: 150,
        renderCell: (params) => Boolean(params.value) && moment(params.value).format('LLL')
      },
      {
        field: 'dateCreated',
        headerName: "dateCreated",
        description: "dateCreated",
        flex: 1,
        minWidth: 150,
        renderCell: (params) => Boolean(params.value) && moment(params.value).format('LLL')
      },
      {
        field: 'status',
        headerName: "status",
        description: "status",
        flex: 0.5,
        minWidth: 100,
        renderCell: (params) => params.row.accessLevel.status
        // renderCell: (params) => (
        //   params.row.accessLevel.status
        //     ? <CheckIcon style={{ fontSize: '20px', color: theme.palette.success.main }} />
        //     : <CloseIcon style={{ fontSize: '20px', color: theme.palette.error.main }} />
        // ),
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
          // getRowId={(row) => row.id + row.roleId}
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
