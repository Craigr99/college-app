import Vue from "vue";
import App from "./App.vue";
import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import Vuelidate from 'vuelidate'
import VueFlashMessage from 'vue-flash-message';
import moment from 'moment'

Vue.prototype.moment = moment

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Vuelidate);
Vue.use(VueFlashMessage);
Vue.use(moment);


import router from "./router";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
