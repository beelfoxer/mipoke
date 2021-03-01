import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/device',
    children: [
      {
        path: 'device',
        component: () => import('@/views/internal-network/device/index'),
        name: 'DeviceLink',
        meta: { title: '设备管理', icon: 'device', noCache: true, affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/internal',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/internal-network/internal/index'),
        name: 'InternalLInk',
        meta: { title: '内网管理', icon: 'meter', noCache: true }
      }
    ]
  },
  {
    path: '/mstp',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/internal-network/mstp/index'),
        name: 'mstp',
        meta: { title: 'MSTP管理', icon: 'meter', noCache: true }
      }
    ]
  },
  {
    path: '/pokemon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mipoke/pokemon/index.vue'),
        name: 'pokemon',
        meta: { title: 'pokemon', icon: 'meter', noCache: true }
      }
    ]
  },
  {
    path: '/attribute',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mipoke/attribute/index.vue'),
        name: 'attribute',
        meta: { title: 'attribute', icon: 'meter', noCache: true }
      }
    ]
  },
  {
    path: '/layer2',
    component: Layout,
    name: 'Layer2',
    meta: { title: '二层网络', icon: 'meter', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/internal-network/layer2/index'),
        name: 'Layer2Link',
        meta: { title: '业务管理', icon: 'meter', noCache: true }
      },
      {
        path: 'index_ac',
        component: () => import('@/views/internal-network/layer2/index_ac'),
        name: 'Layer2Link_ac',
        meta: { title: 'AC口管理', icon: 'meter', noCache: true }
      }
    ]
  },
  {
    path: '/layer3',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/internal-network/layer3/index'),
        name: 'Layer3Link',
        meta: { title: '三层网络', icon: 'meter', noCache: true }
      }
    ]
  },
  {
    path: '/topology',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/internal-network/topology/index'),
        name: 'TopologyLink',
        meta: { title: '拓扑管理', icon: 'meter', noCache: true }
      }
    ]
  },
  // {
  //   path: '/port',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'PortLink',
  //   alwaysShow: true,
  //   meta: {
  //     title: '端口管理',
  //     icon: 'port'
  //   },
  //   children: [
  //     {
  //       path: 'config',
  //       component: () => import('@/views/idc/port/index/'),
  //       name: 'PortConfigLink',
  //       meta: { title: '上行口配置', icon: 'port', noCache: true }
  //     },
  //     {
  //       path: 'down',
  //       component: () => import('@/views/idc/port/components/downPort'),
  //       name: 'PortConfigDownLink',
  //       meta: { title: '下行口配置', icon: 'port', noCache: true }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

// --resolve console log print uncaught error
const originalPush = Router.prototype.push

Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

//
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
