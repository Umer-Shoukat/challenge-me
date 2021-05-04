import Vue from 'vue'

Vue.filter('capitalize', (val) => val.toUpperCase())

Vue.filter('avatarName', (val) => {
  if (!val) return 'NA'

  let arr = val.split(' ')
  if (arr.length === 1) return val.substr(0, 2)

  return arr[0].charAt(0) + arr[1].charAt(0)
})

Vue.filter('truncate', (val, length = 30) => {
  if (val.length > length) return val.substr(0, length) + ' ...'
  else return val
})
