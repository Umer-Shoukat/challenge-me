import Vuex from 'vuex'

import app from './app'
import globalModal from './globalModal'
import team from './team'
import chatroom from './chatroom'

new Vuex.Store({
  app,
  globalModal,
  team,
  chatroom,
})
