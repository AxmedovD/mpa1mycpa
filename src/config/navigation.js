export const sidebarMenuItems = [
  { 
    name: 'Asosiy', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    route: '/',
    allowedRoles: ['superadmin', 'admin', 'msadmin'] // All roles can access dashboard
  },

  {
    name: 'Foydalanuvchilar',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    route: '/users',
    allowedRoles: ['superadmin'] // Only superadmin can manage users
  },

  {
    name: 'Takliflar',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    route: '/offers',
    allowedRoles: ['superadmin', 'admin', 'msadmin'] // All roles can access offers
  },

  {
    name: 'Buyurtmalar',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    children: [
      {
        name: 'Kechikkan buyurtmalar',
        route: '/orders/report',
        allowedRoles: ['superadmin', 'admin'] // All roles can access order reports
      }
    ],
    allowedRoles: ['superadmin', 'admin'] // All roles can access orders
  },

  {
    name: 'Sozlamalar',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    allowedRoles: ['superadmin', 'admin'], // Only superadmin and admin can access settings
    children: [
      {
        name: 'Status turlari',
        route: '/settings/status-types',
        allowedRoles: ['superadmin', 'admin'] // Only superadmin and admin can access status types
      },
      {
        name: 'Statuslar',
        route: '/settings/statuses',
        allowedRoles: ['superadmin', 'admin'] // Only superadmin and admin can access statuses
      }
    ]
  }
]