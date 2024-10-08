export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    projects: '/dashboard/projects',
    groups: '/dashboard/groups',
    clients: '/dashboard/clients',
    attendance: {
      new:'/dashboard/attendance/new',
      report: '/dashboard/attendance/report'
    },
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
