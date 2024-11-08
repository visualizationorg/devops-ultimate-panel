import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import PagesLayout from 'layout/Pages';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));

// ==============================|| MAIN ROUTING ||============================== //

const ErrorRoutes = {
  path: '/error',
  element: <PagesLayout />,
  children: [
    {
      path: '404',
      element: <MaintenanceError />
    },
    {
      path: '500',
      element: <MaintenanceError500 />
    },
    {
      path: 'under-construction',
      element: <MaintenanceUnderConstruction />
    }
  ]
};

export default ErrorRoutes;
