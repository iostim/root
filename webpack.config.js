const path = require("path");
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const proxyFHIR = require("webpack-proxy-fhir");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "iostim";
  const projectName = "root-config";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName,
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  // Proxy
  const proxy = {};

  // FHIR proxy on /fhir
  if (process.env.FHIR_PROXY_URL) {
    Object.assign(proxy, proxyFHIR(process.env.FHIR_PROXY_URL));
  }

  return merge(defaultConfig, {
    // entry (input) and output of the module
    entry: path.resolve(process.cwd(), `src/${projectName}`),
    output: Object.assign({}, defaultConfig.output, {
      filename: `${orgName}/${projectName}.js`,
    }),
    // EJS templating
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
    ],
    devServer: {
      proxy,
    },
  });
};
