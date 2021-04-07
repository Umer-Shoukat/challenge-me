export default ({ $axios }, inject) => {
  // Create a custom axios instance

  let token = ''

  if (process.browser) {
    if (localStorage.getItem('token')) {
      token = `Bearer ${localStorage.getItem('token')}`
    }
  }
  const api = $axios.create()

  api.setHeader('Authorization', token)

  api.onRequest((config) => {
    return config
  })

  api.onResponse((response) => response)

  api.onError((err) => err)

  // Set baseURL to something different
  api.setBaseURL('http://localhost:3000/api/v1/')

  // Inject to context as $api
  inject('$api', api)
}
