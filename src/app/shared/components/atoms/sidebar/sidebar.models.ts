export interface SidebarItem {
  label: string;
  icon?: string;
  collapsedIcon?: string;
  route?: string;
  children?: SidebarItem[];
}

export interface SidebarSection {
  name: string;
  items: SidebarItem[];
}
