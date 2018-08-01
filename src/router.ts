import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Stage from './views/Stage.vue'
import Gear from './views/Gear.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/stage',
      name: 'stage',
      component: Stage
    },
    {
      path: '/gear',
      name: 'gear',
      component: Gear
    }
  ]
})
