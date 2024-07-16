import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'attendance-new', title: 'New Attendance', href: paths.dashboard.attendance.new, icon: 'files' },
  { key: 'attendance-reports', title: 'Attendance Reports', href: paths.dashboard.attendance.report, icon: 'user-list' },
  { key: 'attendance-edit', title: 'Submit Hours', href: paths.dashboard.attendance.edit, icon: 'note-pencil' },
  { key: 'projects', title: 'Projects', href: paths.dashboard.projects, icon: 'building' },
  { key: 'employees', title: 'Employees', href: paths.dashboard.employees, icon: 'users' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
