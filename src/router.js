import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import CoursesIndex from "./views/courses/Index";
// import CoursesShow from "./views/courses/Show";
// import CoursesEdit from "./views/courses/Edit";

Vue.use(Router);

function guardRoute(to, from, next)
{
 var isAuthenticated= false;
 if(localStorage.getItem('token'))
  isAuthenticated = true;
 else
  isAuthenticated= false;
if(isAuthenticated) {
  next(); // allow to enter route
 } else{
  next('/login'); // go to '/login';
 }
}

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('token')) {
            next('/');
        } else {
            next();
        }
    },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('token')) {
            next('/');
        } else {
            next();
        }
    },
    },
    {
      path: "/courses",
      name: "courses_index",
      component: CoursesIndex,
      beforeEnter: guardRoute,
      meta: {
        requiresAuth: true,
      },
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

export default router;

