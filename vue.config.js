// const { defineConfig } = require('@vue/cli-service')
// const { VuetifyPlugin } = require('webpack-plugin-vuetify')

// module.exports = defineConfig({
//   transpileDependencies: true,
//   configureWebpack: {
//     plugins: [
//       new VuetifyPlugin({ autoImport: true })
//     ]
//   },
//   publicPath: '/',
//   devServer: {
//     client: {
//       overlay: {
//         runtimeErrors: (error) => {
//           const ignoreErrors = [
//             "ResizeObserver loop limit exceeded",
//             "ResizeObserver loop completed with undelivered notifications.",
//           ];
//           if (ignoreErrors.includes(error.message)) {
//             return false;
//           }
//           return true;
//         },
//       },
//     },
//   },
// })

const { defineConfig } = require('@vue/cli-service')
const { VuetifyPlugin } = require('webpack-plugin-vuetify')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  configureWebpack: {
    plugins: [
      new VuetifyPlugin({ autoImport: true })
    ]
  }
})