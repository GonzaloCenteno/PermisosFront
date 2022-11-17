import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import Perfil from '../views/admin/Perfil.vue'
import NotFound from '../views/errors/NotFound.vue'
import Usuario from '../views/admin/usuario/Usuario.vue'
import NoAutorizado from '../views/errors/NoAutorizado.vue'
import App from '../App.vue'
import { canNavigate } from '@/acl/routeProtection'
import Rol from '../views/admin/rol/Rol.vue'
import Permisos from '../views/admin/rol/Permisos.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/admin'
    // component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      resource: 'Auth',
      action: 'read',
      redirectIfAuth: true
    }
  },
  {
    path: '/admin',
    component: App,
    meta: {
      requireAuth: true,
      action: 'viewAny',
      resource: 'admin'
    },
    children: [
      {
        path: 'perfil',
        name: 'Perfil',
        component: Perfil,
        meta: {
          requireAuth: true,
          action: 'viewAny',
          resource: 'user'
        }
      },
      {
        path: 'usuario',
        name: 'Usuario',
        component: Usuario,
        meta: {
          requireAuth: true,
          action: 'viewAny',
          resource: 'user'
        }
      },
      {
        path: 'roles',
        name: 'Rol',
        component: Rol,
        meta: {
          //requireAuth: true,
          action: 'viewAny',
          resource: 'role'
        }
      },
      {
        path: 'roles/:id/permisos',
        name: 'RolPermisos',
        component: Permisos
      } 
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  {
    path: '/no-autorizado',
    name: 'NoAutorizado',
    component: NoAutorizado,
    meta: {resource: 'Auth'}
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  /*
  if(to.meta.requireAuth) {
    let token = localStorage.getItem("token")
    if(token) {
      next()
    } else {
      next({name: 'Login'})
    }
  } else {
    next()
  }*/

  let token = localStorage.getItem("token")
  if(!canNavigate(to)){
    if(!token){
      return next({name: 'Login'})
    }
    return next({name: 'NoAutorizado'})
  }

  if(to.meta.redirectIfAuth && token){
    return next({name: 'Usuario'})
  }
  return next()

})

export default router
