import { RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const App = () => (
  <ThemeCustomization>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Locales>
        <ScrollTop>
          <Notistack>
            <RouterProvider router={router} />
            <Snackbar />
          </Notistack>
        </ScrollTop>
      </Locales>
    </LocalizationProvider>
  </ThemeCustomization>
);

export default App;
