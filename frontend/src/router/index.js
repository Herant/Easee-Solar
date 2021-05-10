import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Connect from "../views/Connect.vue";
import Devices from "../views/Devices.vue";
import NotFound from "../views/NotFound.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "login",
        component: Login,
        meta: {
            requiresGuest: true
        }
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/connect",
        name: "connect",
        component: Connect,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/devices",
        name: "devices",
        component: Devices,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "*",
        name: "NotFound",
        component: NotFound
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

// Guard
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!firebase.auth().currentUser) {
            next({
                path: "/",
                query: {
                    redirect: to.fullPath
                }
            });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
        if (firebase.auth().currentUser) {
            next({
                path: "/dashboard",
                query: {
                    redirect: to.fullPath
                }
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
