import { socketIO } from '../config'

export default {
  sockets: [
    // Required
    {
      url: socketIO,
      default: true,
      vuex: {},
      namespaces: {
        /* see section below */
      },
    },
  ],
}
