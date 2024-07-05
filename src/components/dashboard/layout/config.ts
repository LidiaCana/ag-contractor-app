import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'projects', title: 'Projects', href: paths.dashboard.projects, icon: 'building' },
  { key: 'employees', title: 'Employees', href: paths.dashboard.employees, icon: 'users' },
  { key: 'clients', title: 'Clients', href: paths.dashboard.clients, icon: 'users' },
  { key: 'attendance', title: 'Attendance', href: paths.dashboard.attendance, icon: 'files' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
