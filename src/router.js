import Vue from 'vue'
import Router from 'vue-router'
import Routers from './routers/routers'
import {
  api
} from "./app/Api";

Vue.use(Router)

const router = new Router({
  base: process.env.BASE_URL,
  mode: process.env.NODE_ENV == 'production' ? 'history' : 'hash',
  routes: Routers
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const loggedIn = api.auth.loggedIn();

    if (!loggedIn) {
      if (to.name != 'login' && to.name != 'signup') {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      } else {
        next()
      }
    } else if (to.name == 'login' || to.name == 'signup') {
      next({
        path: '/',
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router;
