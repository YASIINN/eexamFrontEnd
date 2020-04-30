import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import store from "./store";
import axios from "axios";

import moment from "moment";
import tr from "moment/locale/tr";
import ArgonDashboard from "./plugins/argon-dashboard";

axios.defaults.baseURL = "http://127.0.0.1:8000/api";

//axios.defaults.baseURL = 'http://10.0.0.55/sinavapi/api'
//axios.defaults.baseURL = 'http://www.sinav.zaferkoleji.com.tr:60006/sinavapi/api'

//axios.defaults.baseURL = 'http://e-exam/api'
//sabit
//axios.defaults.baseURL = 'http://sinavapi.emesai.net/api'

Vue.filter("formatToday", function(value) {
  if (value) {
    return moment(String(value)).format("LL");
  }
});

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("MM.DD.YYYY");
  }
});
Vue.config.productionTip = false;

Vue.use(ArgonDashboard);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
