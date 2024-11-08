import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Fab, Link, Stack } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import CustomGrid from 'components/DataGrid';
import MainCard from 'components/MainCard';
import UserDelete from 'sections/admin/user-list/Delete';
import UserEdit from 'sections/admin/user-list/Edit';
import BuildHistory from 'sections/admin/project-list/BuildHistory';
import ReleaseHistory from 'sections/admin/project-list/ReleaseHistory';

// assets
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Link as LinkIcon, Lock as LockIcon, Public as PublicIcon } from '@mui/icons-material/';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';

// ==============================|| PROJECT LIST ||============================== //

export default function ProjectList() {
  const theme = useTheme();
  const navigate = useNavigate();
  const intl = useIntl();

  const items = useLoaderData();
  const revalidator = useRevalidator();
  const loadData = () => { revalidator.revalidate(); setRowData({}); }

  const rows = items?.value || [];

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
        field: 'id',
        headerName: 'ID',
        description: 'ID',
        flex: 1,
        minWidth: 150,
        headerAlign: 'center',
        align: 'center'
      },
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
        field: 'state',
        headerName: "state",
        description: "state",
        flex: 0.75,
        minWidth: 100
      },
      {
        field: 'revision',
        headerName: "revision",
        description: "revision",
        flex: 0.75,
        minWidth: 100,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'lastUpdateTime',
        headerName: "lastUpdateTime",
        description: "lastUpdateTime",
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
        renderCell: (params) => (
          <Link href={params.value} target="_blank" rel="noopener">
            <LinkIcon style={{ fontSize: '20px', color: theme.palette.primary.main }} />
          </Link>
        ),
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
        title={<FormattedMessage id="project-list" />}
        secondary={
          <Stack direction="row" spacing={2}>
            <Box id="filter-panel" />
            {/* <AnimateButton>
              <Fab variant="extended" color="primary" aria-label="add" size="small" onClick={() => { }} style={{ boxShadow: 'none', paddingLeft: '14px', paddingRight: '14px' }}>
                <PlusOutlined />
                &nbsp;<FormattedMessage id="new-project" />
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
        <BuildHistory projects={rows} />
        <ReleaseHistory projects={rows} />
      </MainCard>
    </>
  );
}
