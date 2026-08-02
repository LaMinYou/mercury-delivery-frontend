const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  css: {
    extract: true,
  },
  pluginOptions: {
    vuetify: {
      styles: 'auto'
    }
  },
  publicPath: '/',
  devServer: {
    client: {
      overlay: {
        runtimeErrors: (error) => {
          const ignoreErrors = [
            "ResizeObserver loop limit exceeded",
            "ResizeObserver loop completed with undelivered notifications.",
          ];
          if (ignoreErrors.includes(error.message)) {
            return false;
          }
          return true;
        },
      },
    },
  },
})