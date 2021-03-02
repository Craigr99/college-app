import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home";
import UserDashboard from "./views/user/Dashboard";
import Login from "./views/Login";
import Register from "./views/Register";
import CoursesIndex from "./views/courses/Index";
import CoursesShow from "./views/courses/Show";
import CoursesCreate from "./views/courses/Create";
import CoursesEdit from "./views/courses/Edit";
import EnrolmentsIndex from "./views/enrolments/Index";
import LecturersIndex from "./views/lecturers/Index";

Vue.use(Router);

// Function to authenticate routes
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

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/dashboard",
      name: "user_dashboard",
      component: UserDashboard,
      beforeEnter: guardRoute,
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
    },
    {
      path: "/courses/create",
      name: "courses_create",
      component: CoursesCreate,
      beforeEnter: guardRoute
    },
    {
      path: "/courses/:id",
      name: "courses_show",
      component: CoursesShow,
      beforeEnter: guardRoute
    },
    {
      path: "/courses/:id/edit",
      name: "courses_edit",
      component: CoursesEdit,
      beforeEnter: guardRoute
    },

    {
      path: "/enrolments",
      name: "enrolments_index",
      component: EnrolmentsIndex,
      beforeEnter: guardRoute
    },
    {
      path: "/lecturers",
      name: "lecturers_index",
      component: LecturersIndex,
      beforeEnter: guardRoute
    },
  ]
});


