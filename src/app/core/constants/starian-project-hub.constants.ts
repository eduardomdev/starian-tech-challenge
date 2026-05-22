import { SidebarSection, SidebarItem } from '../../shared/components/atoms/sidebar/sidebar.models';

export const STARIAN_PROJECT_HUB_SECTIONS: SidebarSection[] = [
  {
    name: 'MENU',
    items: [
      {
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/starian-hub/dashboard',
      },
      {
        label: 'Products',
        icon: 'trolley',
        route: '/starian-hub/products',
      },
    ],
  },
];

export const STARIAN_PROJECT_HUB_FOOTER_ITEMS: SidebarItem[] = [
  {
    label: 'Profile',
    icon: 'person',
    route: '/starian-hub/profile',
  },
  {
    label: 'Logout',
    icon: 'logout',
    route: '/login',
  },
];
