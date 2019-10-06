/* eslint-disable class-methods-use-this */

// plugin needed to make webpack throw error when running directly via node API
// simply checks if there are any errors at the end of the build and throws error
// without this, build will exit with code 0 even if there is an error
class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('DonePlugin', stats => {
      if (stats.compilation.errors && stats.compilation.errors.length) {
        throw stats.compilation.errors[0];
      }
    });
  }
}

module.exports = DonePlugin;
