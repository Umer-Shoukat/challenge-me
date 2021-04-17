import Vue from 'vue'

Vue.filter('capitalize', (val) => val.toUpperCase())

Vue.filter('avatarName', (val) => val.substr(0, 2))
