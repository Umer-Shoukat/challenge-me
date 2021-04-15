import Vue from 'vue'
import Notifications from 'vue-notification'
Vue.use(Notifications)
export default (app, inject) => {
  inject('notify', Vue.notify)
}
