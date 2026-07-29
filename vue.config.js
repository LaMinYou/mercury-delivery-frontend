const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: {
        // Runtime errors တွေကို handle လုပ်တဲ့နေရာမှာ
        // ResizeObserver loop error တစ်ခုတည်းကိုပဲ overlay မပြအောင် ပိတ်ထားမယ်
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
