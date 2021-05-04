import colors from 'vuetify/es5/util/colors'
import io from './plugins/nuxt-socket-io'

export default {
  head: {
    titleTemplate: '%s - web',
    title: 'web',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    // script: [
    // ],
  },
  css: ['@/assets/scss/main.scss'],

  plugins: [
    '~/plugins/axios',
    '~/plugins/globalComponents',
    '~/plugins/filter',
    // { src: '~/plugins/socketio', ssr: false },
    { src: '~plugins/vue-notifications', ssr: false },
    { src: '~plugins/perfect-scroll-bar', ssr: false },
  ],

  components: true,

  buildModules: ['@nuxtjs/vuetify'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    '@nuxtjs/dayjs',
    'nuxt-socket-io',
  ],
  // socket io
  io,
  // dayjs
  dayjs: {
    plugins: ['utc', 'timezone', 'localizedFormat'],
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          // required: true,
          type: 'Bearer',
          maxAge: 60 * 60 * 24 * 30,
        },
        user: {
          property: 'user',
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/login', method: 'post' },
          logout: { url: '/logout', method: 'get' },
          user: { url: '/me', method: 'get' },
        },
      },
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  server: {
    port: 8080,
  },

  build: {},
}
