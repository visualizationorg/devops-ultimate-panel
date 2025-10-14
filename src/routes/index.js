import { createBrowserRouter } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import ErrorRoutes from './ErrorRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
    [
        MainRoutes,
        ErrorRoutes
    ],
    { basename: "/devops-ultimate-panel" }
);

export default router;
