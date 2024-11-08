import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Fab, Stack } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import CustomGrid from 'components/DataGrid';
import MainCard from 'components/MainCard';
import UserDelete from 'sections/admin/user-list/Delete';
import UserEdit from 'sections/admin/user-list/Edit';

// assets
import { DeleteOutlined, EditOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material/';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';

// ==============================|| USER LIST ||============================== //

export default function UserList() {
  const theme = useTheme();
  const navigate = useNavigate();
  const intl = useIntl();

  const items = useLoaderData();
  const revalidator = useRevalidator();
  const loadData = () => { revalidator.revalidate(); setRowData({}); }

  const rows = items?.value || [];

  // console.log(items)
  // console.log(rows)

  const [rowData, setRowData] = useState({});

  const [openEdit, setOpenEdit] = useState(false);
  const handleClickEdit = useCallback(
    (params) => () => {
      setRowData(params);
      setOpenEdit(true);
    },
    []
  );
  // eslint-disable-next-line no-unused-vars
  const handleCloseEdit = (event, reason) => {
    setOpenEdit(false);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const handleClickDelete = useCallback(
    (params) => () => {
      setRowData(params);
      setOpenDelete(true);
    },
    []
  );
  // eslint-disable-next-line no-unused-vars
  const handleCloseDelete = (event, reason) => {
    setOpenDelete(false);
  };

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
      // {
      //   field: 'edit',
      //   type: 'actions',
      //   headerName: intl.formatMessage({ id: "edit" }),
      //   description: intl.formatMessage({ id: "edit" }),
      //   flex: 0.5,
      //   minWidth: 100,
      //   getActions: (params) => [
      //     <GridActionsCellItem
      //       key="edit"
      //       icon={<EditOutlined style={{ fontSize: '16px', color: theme.palette.primary.main }} />}
      //       label={intl.formatMessage({ id: "edit" })}
      //       onClick={handleClickEdit(params)}
      //     />,
      //   ],
      // },
      // {
      //   field: 'delete',
      //   type: 'actions',
      //   headerName: intl.formatMessage({ id: "delete" }),
      //   description: intl.formatMessage({ id: "delete" }),
      //   flex: 0.5,
      //   minWidth: 100,
      //   getActions: (params) => [
      //     <GridActionsCellItem
      //       key="delete"
      //       icon={<DeleteOutlined style={{ fontSize: '16px', color: theme.palette.error.main }} />}
      //       label={intl.formatMessage({ id: "delete" })}
      //       onClick={handleClickDelete(params)}
      //     />,
      //   ],
      // }
    ],
    // eslint-disable-next-line
    [theme, intl]
  );

  return (
    <>
      {/* <UserEdit
        id={rowData.row?.id}
        roleId={rowData.row?.roleId ?? 0}
        open={openEdit}
        handleClose={handleCloseEdit}
        loadData={loadData}
        filterTypes={filterTypes}
        topMenus={topMenus}
        companies={companies}
      />
      <UserDelete
        id={rowData.row?.id}
        roleId={rowData.row?.roleId ?? 0}
        title={rowData.row?.componentName}
        open={openDelete}
        handleClose={handleCloseDelete}
        loadData={loadData}
      /> */}
      <MainCard
        content={false}
        title={<FormattedMessage id="user-list" />}
        secondary={
          <Stack direction="row" spacing={2}>
            <Box id="filter-panel" />
            {/* <AnimateButton>
              <Fab variant="extended" color="primary" aria-label="add" size="small" onClick={() => {}} style={{ boxShadow: 'none', paddingLeft: '14px', paddingRight: '14px' }}>
                <PlusOutlined />
                &nbsp;<FormattedMessage id="new-user" />
              </Fab>
            </AnimateButton> */}
            {/* <AnimateButton>
              <Fab variant="extended" color="primary" aria-label="add" size="small" onClick={() => navigate("/report-company")} style={{ boxShadow: 'none', paddingLeft: '14px', paddingRight: '14px' }}>
                <LinkOutlined />
                &nbsp;<FormattedMessage id="report-company" />
              </Fab>
            </AnimateButton> */}
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
