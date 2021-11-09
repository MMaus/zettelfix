module.exports = {
  productionSourceMap: false,

  // configureWebpack: {
  //   devtool: "source-map",
  // },

  pwa: {
    name: "Zettelfix",
    themeColor: "#F5A623",
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
