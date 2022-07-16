module.exports = {
  productionSourceMap: false,

  // configureWebpack: {
  //   devtool: "source-map",
  // },

  pwa: {
    name: "Zettelfix",
    themeColor: "#F5A623",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/pwa/service-worker.js",
      swDest: "service-worker.js",
    },
  },

  devServer: {
    port: 8088,
    proxy: {
      "^/api/": {
        target: "http://localhost:80/zettelfix.de/",
      },
    },
  },

  publicPath: "",
  outputDir: "../public/",
};
