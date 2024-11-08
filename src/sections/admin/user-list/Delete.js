import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

import { openSnackbar } from 'api/snackbar';

// assets
import { DeleteFilled } from '@ant-design/icons';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// ==============================|| USER DELETE ||============================== //

export default function UserDelete({ id, roleId, title, open, handleClose, loadData }) {
  const intl = useIntl();

  const deletehandler = async () => {
    // await DeleteById({ componentId: id, roleId: roleId })
    //   .then(() => {
    //     openSnackbar({
    //       open: true,
    //       close: true,
    //       message: intl.formatMessage({ id: "deleted-successfully" }),
    //       variant: 'alert',
    //       alert: {
    //         color: 'success'
    //       }
    //     });
    //     loadData();
    //     handleClose();
    //   })
    //   .catch((error) => console.error('API hatası:', error));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              <FormattedMessage id='want-to-delete' />
            </Typography>
            <Typography align="center">
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{title}&quot;{' '}
              </Typography>
              <FormattedMessage id='delete-selected' />
              .
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              <FormattedMessage id='cancel' />
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deletehandler} autoFocus>
              <FormattedMessage id='delete' />
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

UserDelete.propTypes = {
  id: PropTypes.any,
  roleId: PropTypes.any,
  title: PropTypes.any,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  loadData: PropTypes.func
};
