import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify/lib'
import vuetify from './plugins/vuetify';
import store from './store'

Vue.config.productionTip = false
const axios = require('axios').default;

new Vue({
  router,
  render: function (h) { return h(App) },
  vuetify,
  vuetify: new Vuetify(),
  store,

  props: {
    source: String,
  }
}).$mount('#app')
