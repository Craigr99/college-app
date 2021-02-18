import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home";
import CoursesIndex from "./views/courses/Index";
// import CoursesShow from "./views/courses/Show";
// import CoursesEdit from "./views/courses/Edit";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/courses",
      name: "courses_index",
      component: CoursesIndex
    },
    // {
    //   path: "/courses/show",
    //   name: "courses_show",
    //   component: CoursesShow
    // },
    // {
    //   path: "/courses/edit",
    //   name: "courses_edit",
    //   component: CoursesEdit
    // },
  ]
});
