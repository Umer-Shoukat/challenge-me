import Vue from 'vue'

Vue.filter('capitalize', (val) => val.toUpperCase())

Vue.filter('avatarName', (val) => val && val.substr(0, 2))

Vue.filter('truncate', (val, length = 30) => {
  if (val.length > length) return val.substr(0, length) + ' ...'
  else return val
})
