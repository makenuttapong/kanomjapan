import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import firebaseApp from './firebase/firebase_app';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'sweetalert2/dist/sweetalert2.min.css';
import "vue-toastification/dist/index.css";
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import DatePicker from 'vue2-datepicker';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueFormWizard from 'vue-form-wizard'
import ThailandAutoComplete from 'vue-thailand-address-autocomplete'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import VueSidebarMenu from 'vue-sidebar-menu'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import DrVueEcharts from 'dr-vue-echarts';
import 'vue2-datepicker/index.css';
import "vue-select/dist/vue-select.css";
import VueClipboard from 'vue-clipboard2'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSweetalert2 from 'vue-sweetalert2';
import VuePromptpayQr from 'vue-promptpay-qr'
import Toast from "vue-toastification";
import VueApexCharts from 'vue-apexcharts'

Vue.use(IconsPlugin)
Vue.use(BootstrapVue)
Vue.use(VueFormWizard)
Vue.component('ThailandAutoComplete', ThailandAutoComplete)
library.add(faUserSecret)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueSidebarMenu)
Vue.use(DatePicker)
Vue.use(VueAxios, axios)
Vue.use(DrVueEcharts)
Vue.use(VueClipboard)
Vue.use(VuePromptpayQr)
const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
};
Vue.use(VueSweetalert2,options);
Vue.config.productionTip = false
const options_toast = {
  transition: "Vue-Toastification__fade"
};
Vue.use(Toast, options_toast);
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

firebaseApp.auth().onAuthStateChanged(() => {
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
})