// shamelessly (partially) copied without thinking from https://github.com/firebase/firebase-tools/issues/1676

module.exports = {
  productionSourceMap: false,

  // configureWebpack: {
  //   devtool: "source-map",
  // },

  pwa: {
    name: "JuteBag",
    themeColor: "#F5A623",
  },

  devServer: {
    port: 8088 /* must be this port for my firebase setup */,
    proxy: {
      "^/__/": {
        target: "http://localhost:5000", // default hosting emulator port
      },
      "^/bagpy/": {
        target: "http://localhost:8000", // jutebag-py
      },
      // ...runProxy,
    },
  },

  publicPath: '',
  outputDir: '../public/'
};
