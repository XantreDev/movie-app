module.exports = function override(config, env) {
  config.resolve.extensions.push('.tsx', '.ts')

  return config
}