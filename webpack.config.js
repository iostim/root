const path = require("path");
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
    // /fhir proxy
    devServer: {
      proxy: {
        "/fhir": {
          target: process.env.FHIR_TARGET,
          pathRewrite: { "^/fhir": process.env.FHIR_PATH },
        },
      },
    },
  });
};
