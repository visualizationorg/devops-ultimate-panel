import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

// material-ui
import { Alert } from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// ==============================|| ELEMENT ERROR - COMMON ||============================== //

const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return <Alert color="error"><FormattedMessage id="400-alert" /></Alert>;
    }

    if (error.status === 401) {
      return <Alert color="error"><FormattedMessage id="401-alert" /></Alert>;
    }

    if (error.status === 403) {
      return <Alert color="error"><FormattedMessage id="403-alert" /></Alert>;
    }

    if (error.status === 404) {
      return <Alert color="error"><FormattedMessage id="404-alert" /></Alert>;
    }

    if (error.status === 415) {
      return <Alert color="error"><FormattedMessage id="415-alert" /></Alert>;
    }

    if (error.status === 418) {
      return <Alert color="error"><FormattedMessage id="418-alert" /></Alert>;
    }

    if (error.status === 429) {
      return <Alert color="error"><FormattedMessage id="429-alert" /></Alert>;
    }

    if (error.status === 500) {
      return <Alert color="error"><FormattedMessage id="500-alert" /></Alert>;
    }

    if (error.status === 502) {
      return <Alert color="error"><FormattedMessage id="502-alert" /></Alert>;
    }

    if (error.status === 503) {
      return <Alert color="error"><FormattedMessage id="503-alert" /></Alert>;
    }

    if (error.status === 504) {
      return <Alert color="error"><FormattedMessage id="504-alert" /></Alert>;
    }
  }

  // return <Alert color="error"><FormattedMessage id="other-alert" /></Alert>;
};

export default ErrorBoundary;
