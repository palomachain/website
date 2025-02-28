// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  trailingSlash: true,
  reactStrictMode: true,
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
  },
  webpack: (config, { dev }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };
    // The condition is to have the plugin on build time, not to perturb live refresh
    // !dev && config.plugins.push(new BundleAnalyzerPlugin());

    return config;
  },
  env: {
    STORYBLOK_ACCESS_TOKEN: process.env.STORYBLOK_ACCESS_TOKEN,
    BASE_URL: process.env.BASE_URL,
    API_BASE_URL: process.env.API_BASE_URL,
    WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
    ONRAMPER_API_KEY: process.env.ONRAMPER_API_KEY,
    PALOMA_EXTENSION_ID: process.env.PALOMA_EXTENSION_ID,
    PALOMA_NEST_SERVICE_API_BASE_URL: process.env.PALOMA_NEST_SERVICE_API_BASE_URL,
    MORALIS_SERVICE_API_KEY: process.env.MORALIS_SERVICE_API_KEY,
    NODESALE_CONTRACT_ETH: process.env.NODESALE_CONTRACT_ETH,
    NODESALE_CONTRACT_BNB: process.env.NODESALE_CONTRACT_BNB,
    NODESALE_CONTRACT_BASE: process.env.NODESALE_CONTRACT_BASE,
    NODESALE_CONTRACT_ARB: process.env.NODESALE_CONTRACT_ARB,
    NODESALE_CONTRACT_OP: process.env.NODESALE_CONTRACT_OP,
    NODESALE_CONTRACT_POLYGON: process.env.NODESALE_CONTRACT_POLYGON,
    NODESALE_CONTRACT_FIAT: process.env.NODESALE_CONTRACT_FIAT,
    PASSCODE: process.env.PASSCODE,
    TRANSAK_API_KEY: process.env.TRANSAK_API_KEY,
    COINBASE_API_KEY: process.env.COINBASE_API_KEY,
    IS_NODESALE_DISABLE: process.env.IS_NODESALE_DISABLE,
  },
};
