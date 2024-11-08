import { RouterProvider } from 'react-router-dom';

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
    <Locales>
      <ScrollTop>
        <Notistack>
          <RouterProvider router={router} />
          <Snackbar />
        </Notistack>
      </ScrollTop>
    </Locales>
  </ThemeCustomization>
);

export default App;
