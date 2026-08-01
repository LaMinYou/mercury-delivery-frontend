const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    vuetify: {
      // Vuetify 3 အတွက် Auto Import နှင့် Styles Config 
      // 'expose' အစား true သို့မဟုတ် { transformAssetUrls: true } သုံးပေးရပါမည်
      autoImport: true,
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