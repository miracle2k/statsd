const { globalState } = require("./client_handler");
const KEY_NOT_PRESENT_ERROR = "ERR TSDB: the key is not a TSDB key";

/**
 * Sends stuff to redis.
 */
const post_stats = async function rts_post_stats(stats, timestamp, labels) {
  let startTime = Date.now();

  // XXX use retention and labels
  const responses = await globalState.client.ts.mAdd(stats);

  // mAdd cannot auto-create time series, handle such errors and create timeseries
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];

    // No error
    if (!response.message) {
      continue;
    }

    if (response.message == KEY_NOT_PRESENT_ERROR) {
      const { key, timestamp, value } = stats[i];
      const singleR = await globalState.client.ts.add(key, timestamp, value);
      if (singleR.message) {
        console.log("add failure", singleR.message);
        globalState.stats.last_exception = Math.round(Date.now() / 1000);
      }
    } else {
      console.log("mAdd failure", response.message);
      globalState.stats.last_exception = Math.round(Date.now() / 1000);
    }
  }

  console.log("flushed");

  globalState.stats.flush_time = Date.now() - startTime;
  globalState.stats.flush_length = stats.length;
  globalState.stats.last_flush = Math.round(Date.now() / 1000);
};
exports.post_stats = post_stats;
