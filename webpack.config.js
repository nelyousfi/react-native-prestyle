const path = require("path");

module.exports = {
  mode: "production",
  entry: "./plugin.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "plugin.js",
    libraryTarget: "commonjs",
  },
  module: {
    rules: [
      {
        test: /node_modules\/react-native\/Libraries\/Components\/View\/ReactNativeStyleAttributes.js/,
        use: [
          {
            loader: "./custom-loader.js",
            options: {
              ignore: [
                "import type {AnyAttributeType} from '../../Renderer/shims/ReactNativeTypes';",
                "import processAspectRatio from '../../StyleSheet/processAspectRatio';",
                "import processColor from '../../StyleSheet/processColor';",
                "import processFontVariant from '../../StyleSheet/processFontVariant';",
                "import processTransform from '../../StyleSheet/processTransform';",
                "import sizesDiffer from '../../Utilities/differ/sizesDiffer';",
              ],
              replace: {
                processColor: "''",
                processAspectRatio: "true",
                sizesDiffer: "true",
                processTransform: "true",
                processFontVariant: "true",
              },
            },
          },
        ],
      },
      {
        test: /\.(js)$/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: path.resolve(__dirname, ".babelrc"),
          },
        },
      },
    ],
  },
};
