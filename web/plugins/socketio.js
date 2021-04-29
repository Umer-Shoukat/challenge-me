import io from 'socket.io-client'

import { socketIO } from '~/config'

export default (app, inject) => {
  const options = {}
  const socket = io.connect(socketIO, options)

  socket.on('connect_error', (err) => {
    if (process.browser) {
      app.$notify({
        group: 'foo',
        title: 'Connection Error...',
        text: err.message,
        type: 'error',
      })
    }
    console.log(`connect_error due to ${err} --- ${err.message}`)
  })

  inject('socket', socket)
}
