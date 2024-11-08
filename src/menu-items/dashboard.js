// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { HomeTwoTone } from '@ant-design/icons';

// icons
const icons = {
  HomeTwoTone
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/dashboard',
      icon: icons.HomeTwoTone
    },
  ]
};

export default dashboard;
