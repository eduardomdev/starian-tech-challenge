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
        label: 'Produtos',
        icon: 'trolley',
        route: '/starian-hub/products',
      },
      {
        label: 'Usuários',
        icon: 'group',
        route: '/starian-hub/users',
      },
    ],
  },
];

export const STARIAN_PROJECT_HUB_FOOTER_ITEMS: SidebarItem[] = [
  {
    label: 'Perfil',
    icon: 'person',
    route: '/starian-hub/profile',
  },
  {
    label: 'Sair',
    icon: 'logout',
    route: '/login',
  },
];
