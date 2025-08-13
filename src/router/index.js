import { createRouter, createWebHistory } from 'vue-router'
import auth from '../stores/auth'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import LoginView from '../pages/LoginView.vue'
import NotFoundView from '../pages/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Login',
        layout: 'empty',
        guest: true
      }
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../pages/DashboardView.vue'),
          meta: {
            title: 'Dashboard',
            requiresAuth: true
          }
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../pages/users/UserView.vue'),
          meta: { 
            title: 'Users Management',
            requiresSuperAdmin: true
          }
        },
        {
          path: 'settings/status-types',
          name: 'status-types',
          component: () => import('../pages/settings/StatusTypeView.vue'),
          meta: { 
            title: 'Status Types',
            requiresAuth: true
          }
        },
        {
          path: 'settings/statuses',
          name: 'statuses',
          component: () => import('../pages/settings/StatusView.vue'),
          meta: { 
            title: 'Statuses',
            requiresAuth: true
          }
        },
        {
          path: 'offers',
          name: 'offers',
          component: () => import('../pages/offers/OfferView.vue'),
          meta: {
            title: 'Takliflar',
            requiresAuth: true
          }
        },
        {
          path: 'offers/:id',
          name: 'offer-details',
          component: () => import('../pages/offers/OfferSingleView.vue'),
          meta: {
            title: 'Offer Details',
            requiresAuth: true
          }
        },
        {
          path: 'orders/report',
          name: 'order-reports',
          component: () => import('../pages/orders/OrderReportView.vue'),
          meta: {
            title: 'Order Reports',
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: 'Page Not Found',
        layout: 'empty'
      }
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Check auth state
  const hasAuth = await auth.checkAuth()
  
  // Redirect to dashboard if trying to access login page while authenticated
  if (to.path === '/login' && hasAuth) {
    return next('/')
  }
  
  // Redirect to login if trying to access protected page while not authenticated
  if (to.meta.requiresAuth && !hasAuth) {
    return next('/login')
  } else if (to.meta.guest && hasAuth) {
    return next('/')
  } else if (to.meta.requiresStorekeeper && !auth.isStorekeeper) {
    return next('/')
  } else if (to.meta.requiresCashier && !auth.isCashier) {
    return next('/')
  } else if (to.meta.requiresSuperAdmin && !auth.isSuperAdmin) {
    return next('/')
  } else if (to.meta.requiresMsAdmin && !auth.isMsAdmin && !auth.isSuperAdmin) {
    return next('/')
  } else {
    // Update document title
    document.title = to.meta.title 
      ? `MyCPA Admin by Mgoods ERP | ${to.meta.title}`
      : 'MyCPA Admin by Mgoods ERP'
    return next()
  }
})

export default router