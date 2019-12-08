
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'RaspiFace',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway&display=swap' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#67c981', height: '3px' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  env: {
    baseUrl: "http://localhost:8080",
    fbAPIKey: process.env.FB_API_KEY || 'AIzaSyD2NgpfLpzXqODxj2uDIh72fRC8KqUgmJI'
  },
  transition: {
    name: '',
    mode: 'out-in',
    enterActiveClass: 'animated fadeIn',
    leaveActiveClass: 'animated fadeOut',
    duration: 100
  }
}
