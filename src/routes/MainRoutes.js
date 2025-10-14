import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import DashboardLayout from 'layout/Dashboard';
import ErrorBoundary from 'components/ErrorBoundary';
import Loadable from 'components/Loadable';

import { Loader as projectListLoader } from 'api/ProjectsApi';
import { Loader as userListLoader } from 'api/UsersApi';
import { Loader as userEntitlementsListLoader } from 'api/UserEntitlementsApi';
import BuildsPage from 'pages/builds';
import CommitsPage from 'pages/commits';
import PullRequestsPage from 'pages/pull-requests';

// render
const Dashboard = Loadable(lazy(() => import('pages/dashboard')));
const ProjectList = Loadable(lazy(() => import('pages/admin/project-list')));
const ProjectUserList = Loadable(lazy(() => import('pages/admin/project-user-list')));
const BuildHistory = Loadable(lazy(() => import('pages/builds/build-history')));
const ReleaseHistory = Loadable(lazy(() => import('pages/builds/release-history')));
const RepoList = Loadable(lazy(() => import('pages/admin/repo-list')));
const UserList = Loadable(lazy(() => import('pages/admin/user-list')));
const UserProjectList = Loadable(lazy(() => import('pages/admin/user-project-list')));
const UserEntitlementsList = Loadable(lazy(() => import('pages/admin/user-entitlements-list')));
const WorkItemsList = Loadable(lazy(() => import('pages/admin/workitems-list')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ErrorBoundary>
      <DashboardLayout />
    </ErrorBoundary>
  ),
  children: [
    {
      index: true,
      element: <Dashboard />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    },
    {
      path: '/project-list',
      element: <ProjectList />,
      loader: projectListLoader
    },
    {
      path: '/project-user-list',
      element: <ProjectUserList />
    },
    {
      path: '/build-history',
      element: <BuildHistory />
    },
    {
      path: '/release-history',
      element: <ReleaseHistory />
    },
    {
      path: '/repo-list',
      element: <RepoList />
    },
    {
      path: '/user-list',
      element: <UserList />,
      loader: userListLoader
    },
    {
      path: '/user-entitlements-list',
      element: <UserEntitlementsList />,
      loader: userEntitlementsListLoader
    },
    {
      path: '/user-project-list',
      element: <UserProjectList />
    },
    {
      path: '/workitems-list',
      element: <WorkItemsList />
    },
    {
      path: 'builds',
      element: (
        <ErrorBoundary>
          <BuildsPage />
        </ErrorBoundary>
      )
    },
    {
      path: 'commits',
      element: (
        <ErrorBoundary>
          <CommitsPage />
        </ErrorBoundary>
      )
    },
    {
      path: 'pull-requests',
      element: (
        <ErrorBoundary>
          <PullRequestsPage />
        </ErrorBoundary>
      )
    },
    {
      path: '*',
      element: <Navigate to="/error/404" />
    }
  ]
};

export default MainRoutes;
