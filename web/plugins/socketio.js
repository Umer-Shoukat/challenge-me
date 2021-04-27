import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'

import { socketIO } from '~/config'

const socket = io('ws://localhost:3000', {
  // transports: ['websocket'],
  reconnectionDelay: 1500,
  rejectUnauthorized: false,
  reconnection: true,
  reconnectionAttempts: 10,
  agent: false,
  upgrade: false,
  allowEIO3: true,
  withCredentials: false,
  timeout: 5000,
})

socket.on('connect_error', (err) => {
  console.log(`connect_error due to ${err} --- ${err.message}`)
})

// socket.on('error', (e) => {
//   console.log('error ===>', e)
// })

// socket.on('reconnect_error', (e) => console.log('reconnect error', e))

// socket.on('reconnect_failed', (e) => console.log('reconnect_failed', e))

// socket.on('ping', (e) => console.log('ping ', e))

export default () => {
  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: socket,
    })
  )
}
