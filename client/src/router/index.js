import Vue from "vue";
import VueRouter from "vue-router";

import Search from "../components/Search.vue";
import Test from "../components/Test.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Search",
    component: Search,
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
  },
  {
    path: "*",
    component: Search,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
