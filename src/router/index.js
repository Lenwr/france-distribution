import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Form from '../views/form.vue'
import Order from "../views/Order.vue";
import Stock from "../views/Stock.vue";
import Gestion from "../views/Gestion.vue";
import Articles from "../views/articles.vue";
import UpdateStockView from "../views/updateStockView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'classActive',
  routes: [
    {
      path: '/form',
      component: Form,
    },
    {
      path: '/',
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
    {
      path: '/updateStock/:id',
      component: UpdateStockView,
    },


  ],
})

export default router
