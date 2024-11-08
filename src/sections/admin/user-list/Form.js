import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
  Box,
  Button,
  Checkbox,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

// third-party
import { Buffer } from 'buffer';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';

// project imports
import ReportDelete from './Delete';
import IconButton from 'components/@extended/IconButton';

import { openSnackbar } from 'api/snackbar';

// assets
import { DeleteFilled } from '@ant-design/icons';

// constant
const getInitialValues = (report) => {
  const newReport = {
    componentId: report?.componentId ?? '',
    componentName: report?.componentName ?? '',
    url: report?.url ?? '',
    content: report?.content ?? '',
    topMenu: report?.topMenu ?? '',
    dayRange: report?.dayRange ?? 0,
    filterTypes: report?.filterTypes ?? [],
    dbType: report?.dbType ?? 0,
    roleId: report?.roleId ?? 0,
    companyId: report?.companyId ?? 0
  };

  return newReport;
};

// ==============================|| REPORT ADD / EDIT - FORM ||============================== //

const ReportForm = ({ report, handleClose, loadData, filterTypes, topMenus, companies }) => {
  const intl = useIntl();

  const [openDelete, setOpenDelete] = useState(false);
  const handleClickDelete = useCallback(
    () => {
      setOpenDelete(true);
    },
    []
  );
  // eslint-disable-next-line no-unused-vars
  const handleCloseDelete = (event, reason) => {
    setOpenDelete(false);
  };

  const ReportSchema = Yup.object().shape({
    componentName: Yup
      .string()
      .max(255, intl.formatMessage({ id: "too-long" }))
      .matches(/[^\s*].*[^\s*]/g, intl.formatMessage({ id: "required-field" }))
      .required(intl.formatMessage({ id: "required-field" })),
    url: Yup
      .string()
      .max(255, intl.formatMessage({ id: "too-long" }))
      .matches(/[^\s*].*[^\s*]/g, intl.formatMessage({ id: "required-field" }))
      .required(intl.formatMessage({ id: "required-field" })),
    content: Yup
      .string()
      .matches(/[^\s*].*[^\s*]/g, intl.formatMessage({ id: "required-field" }))
      .required(intl.formatMessage({ id: "required-field" })),
    topMenu: Yup
      .string()
      .required(intl.formatMessage({ id: "required-field" })),
    dayRange: Yup
      .number()
      .label(intl.formatMessage({ id: "day-range" }))
      .typeError(({ label, type }) => `${label} ${intl.formatMessage({ id: "must-be-a" })} ${type}`)
      .min(0, ({ label, min }) => `${label} ${intl.formatMessage({ id: "greater-than" })} ${min}`)
      .max(9999, ({ label, max }) => `${label} ${intl.formatMessage({ id: "less-than" })} ${max}`)
      .required(intl.formatMessage({ id: "required-field" })),
    filterTypes: Yup
      .array(),
    dbType: Yup
      .string()
      .required(intl.formatMessage({ id: "required-field" })),
    companyId: Yup
      .string()
  });

  const formik = useFormik({
    initialValues: getInitialValues(report),
    validationSchema: ReportSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      try {
        // const encodedString = Buffer.from(values.content).toString('base64');

        // if (report) {
        //   await Update({ ...values, content: encodedString }).then(() => {
        //     openSnackbar({
        //       open: true,
        //       close: true,
        //       message: intl.formatMessage({ id: "updated-successfully" }),
        //       variant: 'alert',
        //       alert: {
        //         color: 'success'
        //       }
        //     });
        //     loadData();
        //     actions.setSubmitting(false);
        //     actions.resetForm();
        //     handleClose();
        //   })
        //     .catch((error) => console.error('API hatası:', error));

        // } else {
        //   await Create({ ...values, content: encodedString }).then(() => {
        //     openSnackbar({
        //       open: true,
        //       close: true,
        //       message: intl.formatMessage({ id: "created-successfully" }),
        //       variant: 'alert',
        //       alert: {
        //         color: 'success'
        //       }
        //     });
        //     loadData();
        //     actions.setSubmitting(false);
        //     actions.resetForm();
        //     handleClose();
        //   })
        //     .catch((error) => console.error('API hatası:', error));
        // }

      } catch (err) {
        actions.setStatus({ success: false });
        actions.setErrors({ submit: err.message });
        actions.setSubmitting(false);
      }
    }
  });

  let filterTypesSelect = filterTypes && filterTypes.map((item, i) => (
    <MenuItem key={i} value={item.id}>
      <Checkbox checked={formik?.values?.filterTypes?.indexOf(item.id) > -1} />
      <ListItemText primary={item.filterName} />
    </MenuItem>
  ));

  const topMenuSelect = topMenus && topMenus.map((item) => (<MenuItem key={item.id} value={item.id}>{item.componentName}</MenuItem>));
  const companySelect = companies && companies.map((item) => (<MenuItem key={item.id} value={item.id}>{item.companyName}</MenuItem>));

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
          <DialogTitle>{report ? <FormattedMessage id="edit-report" /> : <FormattedMessage id="new-report" />}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="report-name"><FormattedMessage id="report-name" /></InputLabel>
                  <TextField
                    fullWidth
                    id="report-name"
                    value={formik.values.componentName}
                    name="componentName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({ id: "report-name" })}
                    error={Boolean(formik.touched.componentName && formik.errors.componentName)}
                    helperText={formik.touched.componentName && formik.errors.componentName}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="url"><FormattedMessage id="url" /></InputLabel>
                  <TextField
                    fullWidth
                    id="url"
                    value={formik.values.url}
                    name="url"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({ id: "url" })}
                    error={Boolean(formik.touched.url && formik.errors.url)}
                    helperText={formik.touched.url && formik.errors.url}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="top-menu"><FormattedMessage id="top-menu" /></InputLabel>
                  <Select
                    displayEmpty
                    fullWidth
                    id="top-menu"
                    value={formik.values.topMenu}
                    name="topMenu"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    renderValue={(selected) => {
                      if (selected === "") {
                        return <em style={{ color: '#A9A9AC' }}><FormattedMessage id="please-select" /></em>;
                      }

                      return (topMenus.find((item) => item.id === selected)?.componentName)
                    }}
                    error={Boolean(formik.touched.topMenu && formik.errors.topMenu)}
                  >
                    <MenuItem value=""><em style={{ color: '#A9A9AC' }}><FormattedMessage id="please-select" /></em></MenuItem>
                    {topMenuSelect}
                  </Select>
                  {Boolean(formik.touched.topMenu && formik.errors.topMenu) && (
                    <FormHelperText error id="top-menu">
                      {formik.touched.topMenu && formik.errors.topMenu}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="day-range"><FormattedMessage id="day-range" /></InputLabel>
                  <TextField
                    type='number'
                    InputProps={{
                      inputMode: 'numeric', pattern: '[0-9]*',
                      inputProps: { min: 0, max: 9999 },
                    }}
                    fullWidth
                    id="day-range"
                    value={formik.values.dayRange}
                    name="dayRange"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({ id: "day-range" })}
                    error={Boolean(formik.touched.dayRange && formik.errors.dayRange)}
                    helperText={formik.touched.dayRange && formik.errors.dayRange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="sql-query"><FormattedMessage id="sql-query" /></InputLabel>
                  <TextField
                    multiline
                    maxRows={15}
                    fullWidth
                    id="sql-query"
                    value={formik.values.content}
                    name="content"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({ id: "sql-query" })}
                    error={Boolean(formik.touched.content && formik.errors.content)}
                    helperText={formik.touched.content && formik.errors.content}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="filter-types"><FormattedMessage id="filter-types" /></InputLabel>
                  <Select
                    multiple
                    displayEmpty
                    fullWidth
                    id="filter-types"
                    value={formik.values.filterTypes}
                    // eslint-disable-next-line no-unused-vars
                    onChange={(event, obj) => {
                      const {
                        target: { value },
                      } = event;
                      formik.handleChange({ target: { name: 'filterTypes', value: value } });
                    }}
                    input={<OutlinedInput label={intl.formatMessage({ id: "filter-types" })} />}
                    renderValue={(selected) => {

                      if (selected.length === 0) {
                        return <em style={{ color: '#A9A9AC' }}><FormattedMessage id="please-select" /></em>;
                      }

                      return (<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={filterTypes?.find((item) => item.id === value)?.filterName}
                            color="primary"
                            size="small"
                            sx={{ color: 'white' }}
                          />
                        ))}
                      </Box>)
                    }}
                  >
                    {filterTypesSelect}
                  </Select>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="db-type"><FormattedMessage id="db-type" /></InputLabel>
                  <TextField
                    select
                    fullWidth
                    id="db-type"
                    value={formik.values.dbType}
                    name="dbType"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.dbType && formik.errors.dbType)}
                    helperText={formik.touched.dbType && formik.errors.dbType}
                  >
                    <MenuItem value="0">Informix</MenuItem>
                    <MenuItem value="1">PostgreSQL</MenuItem>
                  </TextField>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company"><FormattedMessage id="company" /></InputLabel>
                  <TextField
                    select
                    fullWidth
                    id="company"
                    value={formik.values.companyId}
                    name="companyId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.companyId && formik.errors.companyId)}
                    helperText={formik.touched.companyId && formik.errors.companyId}
                  >
                    <MenuItem value="0"><FormattedMessage id="empty" /></MenuItem>
                    {companySelect}
                  </TextField>
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                {report && (
                  <Tooltip title={intl.formatMessage({ id: "delete" })} placement="top">
                    <IconButton onClick={handleClickDelete} size="large" color="error">
                      <DeleteFilled />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={handleClose}>
                    <FormattedMessage id='cancel' />
                  </Button>
                  <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                    {report ? <FormattedMessage id='edit' /> : <FormattedMessage id='add' />}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </FormikProvider>
      {report && <ReportDelete
        id={report.componentId}
        roleId={report.roleId}
        title={report.componentName}
        open={openDelete}
        handleClose={handleCloseDelete}
        loadData={loadData}
      />}
    </>
  );
};

ReportForm.propTypes = {
  report: PropTypes.object,
  handleClose: PropTypes.func,
  loadData: PropTypes.func,
  filterTypes: PropTypes.array,
  topMenus: PropTypes.array,
  companies: PropTypes.array
};

export default ReportForm;
