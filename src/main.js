import Vue from 'vue'
import App from './App'
import jQuery from 'jquery'
import Chart from 'chart.js';
global.jQuery = jQuery
let Bootstrap = require('bootstrap');
import 'bootstrap/dist/css/bootstrap.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
