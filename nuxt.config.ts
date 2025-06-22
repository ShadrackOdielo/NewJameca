// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
    ],

  css: ['~/assets/css/main.css'],
  i18n: {
    locales: [{
      code: 'de',
      name: 'Deutsch'
    }, {
      code: 'en',
      name: 'English'
    }, {
      code: 'fr',
      name: 'Français'
    }],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
  },
  supabase: {
      redirectOptions: {
    login: '/login',
    callback: '/confirm',
    include: undefined,
    exclude: [],
    saveRedirectToCookie: true,
  }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27'
})