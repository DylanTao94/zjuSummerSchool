import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify/lib'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
const axios = require('axios').default;

new Vue({
  router,
  render: function (h) { return h(App) },
  vuetify,
  vuetify: new Vuetify(),
  props: {
    source: String,
  },
}).$mount('#app')
