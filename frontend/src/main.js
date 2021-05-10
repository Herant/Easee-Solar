import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "./components/firebaseInit";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Donut from "vue-css-donut-chart";
import "vue-css-donut-chart/dist/vcdonut.css";
import VueApexCharts from "vue-apexcharts";

Vue.config.productionTip = false;
Vue.use(Donut);
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

let app;
// Remembers the state of Auth (No pushback to Login page on reload)
firebase.auth().onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
            router,
            vuetify,
            store,
            render: h => h(App)
        }).$mount("#app");
    }
});
