const flush_stats = require("./flush_stats");
const status = require("./status");
const { globalState } = require("./client_handler");

exports.init = function rts_init(startup_time, config, events, logger) {
  if (!config || !events) {
    return false;
  }
  let redisHost = config.redisHost || "localhost";
  let redisPort = config.redisPort || 6379;
  let authPassword = config.redisPassword;

  globalState.connectToRedis(
    redisHost,
    redisPort,
    authPassword
  );

  // Set config
  globalState.retention = config.retention || 5000;

  // Set stats
  globalState.stats.last_flush = startup_time;
  globalState.stats.last_exception = startup_time;
  globalState.stats.multi_flush_time = 0;
  globalState.stats.flush_time = 0;
  globalState.stats.flush_length = 0;

  events.on("flush", flush_stats.flush_stats);
  events.on("status", status.status);
  return true;
};
