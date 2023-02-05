const path = require('path');

const exclusionList = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');

const modules = Object.keys({
  ...require('../package.json').peerDependencies,
});

const root = path.resolve(__dirname, '..');

const watchFolders = [root, path.join(__dirname, './node_modules')];

module.exports = (() => {
  return {
    projectRoot: __dirname,
    transformer: {
      getTransformOptions: () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      blockList: exclusionList(
        modules.map(
          m =>
            new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`),
        ),
      ),
      extraNodeModules: modules.reduce((acc, name) => {
        acc[name] = path.join(__dirname, 'node_modules', name);
        return acc;
      }, {}),
    },
    watchFolders,
  };
})();
