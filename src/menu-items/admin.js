// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { CalendarTwoTone, ContainerTwoTone, FileTextTwoTone, FunnelPlotTwoTone, TagTwoTone } from '@ant-design/icons';

// icons
const icons = {
  CalendarTwoTone, ContainerTwoTone, FileTextTwoTone, FunnelPlotTwoTone, TagTwoTone
};

// ==============================|| MENU ITEMS - ADMIN ||============================== //

const admin = {
  id: 'admin',
  title: <FormattedMessage id="admin" />,
  type: 'group',
  children: [
    {
      id: 'projects',
      title: <FormattedMessage id="projects" />,
      type: 'collapse',
      icon: icons.FileTextTwoTone,
      children: [
        {
          id: 'project-list',
          title: <FormattedMessage id="project-list" />,
          type: 'item',
          url: '/project-list',
          icon: icons.FileTextTwoTone
        }
      ]
    },
    {
      id: 'repos',
      title: <FormattedMessage id="repos" />,
      type: 'collapse',
      icon: icons.FileTextTwoTone,
      children: [
        {
          id: 'repo-list',
          title: <FormattedMessage id="repo-list" />,
          type: 'item',
          url: '/repo-list',
          icon: icons.FileTextTwoTone
        }
      ]
    },
    {
      id: 'users',
      title: <FormattedMessage id="users" />,
      type: 'collapse',
      icon: icons.FileTextTwoTone,
      children: [
        // {
        //   id: 'user-list',
        //   title: <FormattedMessage id="user-list" />,
        //   type: 'item',
        //   url: '/user-list',
        //   icon: icons.FileTextTwoTone,
        //   // target: true // open in new tab
        // },
        {
          id: 'user-entitlements-list',
          title: <FormattedMessage id="user-entitlements-list" />,
          type: 'item',
          url: '/user-entitlements-list',
          icon: icons.FileTextTwoTone
        }
      ]
    },
    {
      id: 'workitems',
      title: <FormattedMessage id="workitems" />,
      type: 'collapse',
      icon: icons.FileTextTwoTone,
      children: [
        {
          id: 'workitems-list',
          title: <FormattedMessage id="workitems-list" />,
          type: 'item',
          url: '/workitems-list',
          icon: icons.FileTextTwoTone
        }
      ]
    }
  ]
};

export default admin;
