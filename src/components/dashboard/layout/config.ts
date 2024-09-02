import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { Role } from '@/types/user';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie', permissions: [Role.Admin, Role.Counter, Role.Supervisor] },
  { key: 'attendance-new', title: 'New Attendance', href: paths.dashboard.attendance.new, icon: 'files', permissions: [Role.Admin, Role.Supervisor] },
  { key: 'attendance-reports', title: 'Attendance Reports', href: paths.dashboard.attendance.report, icon: 'user-list', permissions: [Role.Admin, Role.Supervisor, Role.Counter] },
  { key: 'projects', title: 'Projects', href: paths.dashboard.projects, icon: 'building', permissions: [Role.Admin, Role.Counter] },
  { key: 'groups', title: 'Groups', href: paths.dashboard.groups, icon: 'users', permissions: [Role.Admin, Role.Counter] },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
