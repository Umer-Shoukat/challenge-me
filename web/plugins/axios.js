import { apiEndPoint } from '~/config'

export default (app) => {
  // Create a custom axios instance

  const $axios = app.$axios
  // Set baseURL to something different
  $axios.setBaseURL(apiEndPoint)

  $axios.onRequest((config) => {
    return config
  })

  $axios.onResponse((response) => {
    if (response.data.msg) {
      app.$notify({
        group: 'foo',
        title: 'Success',
        text: response.data.msg,
      })
    }
    return response
  })

  $axios.onError((err) => {
    app.$notify({
      group: 'foo',
      title: 'Error',
      text: err?.response?.data?.error ?? 'Something Went Wrong...!!!',
      type: 'error',
    })
    return err
  })

  // Inject to context as $api
  // inject('api', api)
}
