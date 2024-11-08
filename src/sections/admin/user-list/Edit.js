import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Modal, Stack } from '@mui/material';

// third-party
import { Buffer } from 'buffer';

// project-imports
import ReportForm from './Form';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

// ==============================|| REPORT ADD / EDIT ||============================== //

const ReportModal = ({ id, roleId, open, handleClose, loadData, filterTypes, topMenus, companies }) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState("");

  useEffect(() => {
    setLoading(true);
    setReport("");

    (async () => {
      // (id || roleId) && await Get({ componentId: id, roleId: roleId })
      //   .then((response) => {
      //     const encodedString = Buffer.from(response?.data?.value?.content, 'base64').toString('ascii');
      //     setReport({ ...response?.data?.value, content: encodedString });
      //   })
      //   .catch((error) => console.error('API hatası:', error));

      setLoading(false);
    })();

  }, [id, roleId]);

  const reportForm = useMemo(
    () => !loading && (
      <ReportForm
        report={report || null}
        handleClose={handleClose}
        loadData={loadData}
        filterTypes={filterTypes}
        topMenus={topMenus}
        companies={companies}
      />
    ),
    // eslint-disable-next-line
    [report, loading]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="report-modal-label"
          aria-describedby="report-modal-description"
          sx={{
            '& .MuiPaper-root:focus': {
              outline: 'none'
            }
          }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar
              sx={{
                maxHeight: `calc(100vh - 48px)`,
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              {loading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                reportForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

ReportModal.propTypes = {
  id: PropTypes.any,
  roleId: PropTypes.any,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  loadData: PropTypes.func,
  filterTypes: PropTypes.array,
  topMenus: PropTypes.array,
  companies: PropTypes.array
};

export default ReportModal;
