function setting(envVar) {
  return (
    process.env[envVar] ||
    (function () {
      throw new Error(`Must set ${envVar}`);
    })()
  );
}

function settings(envVars) {
  return envVars.map(setting);
}

module.exports = { settings };
