module.exports = {
  // webpack: (config, { isServer }) => {
  //   // Fixes npm packages that depend on `fs` module
  //   if (!isServer) {
  //     config.node = {
  //       fs: 'empty'
  //     }
  //   }
  //
  //   return config
  // },
  cssModules: false,
  experimental: {
    css: false,
    productionBrowserSourceMaps: true,
  },
};
