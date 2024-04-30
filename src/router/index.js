import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Form from '../views/form.vue'
import Order from "../views/Order.vue";
import Stock from "../views/Stock.vue";
import Gestion from "../views/Gestion.vue";
import Articles from "../views/articles.vue";

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'classActive',
  routes: [
    {
      path: '/form',
      component: Form,
    },
    {
      path: '/home',
      component: HomeView,
    },
    {
      path: '/order',
      component: Order,
    },
    {
      path: '/stock',
      component: Stock,
    },
    {
      path: '/gestion',
      component: Gestion,
    },
    {
      path: '/articles/:id',
      component: Articles,
    },


  ],
})

export default router
