const post_stats = require("./post_stats").post_stats;

const flush_stats = function rts_flush(timestamp, metrics) {
  const counters = metrics["counters"];
  const counterRates = metrics["counter_rates"];
  const gauges = metrics["gauges"];
  const timers = metrics["timers"];
  const timer_data = metrics["timer_data"];
  const sets = metrics["sets"];
  const stats = [];
  const labels = [];
  const timeInMilliSeconds = timestamp * 1000;
  
  // Counter stats
  for (let counter in counters) {
    let sample = {key: counter, value: counters[counter], timestamp: timeInMilliSeconds};
    labels.push("counter");
    stats.push(sample);
  }

  for (let counter in counterRates) {
    let sample = {key: `${counter}_rate`, value: counterRates[counter], timestamp: timeInMilliSeconds};
    labels.push("counter_rate");
    stats.push(sample);
  }

  // Gauge stats
  for (let gauge in gauges) {
    let sample = {key: gauge, value: gauges[gauge], timestamp: timeInMilliSeconds};
    labels.push("gauge");
    stats.push(sample);
  }

  // Timer stats
  for (let timer in timer_data) {
    for (let timer_stat in timer_data[timer]) {
      let sample = {key: `${timer}.${timer_stat}`, value: timer_data[timer][timer_stat], timestamp: timeInMilliSeconds};
      labels.push("timer");
      stats.push(sample);
    }
  }

  // // Sets stats
  // for (let set in sets) {
  //   let count = Object.keys(sets[set].store).length;
  //   let sample = new Sample(set, count, timeInMilliSeconds);
  //   labels.push("set");
  //   stats.push(sample);
  // }


  if (stats.length > 0) {
    post_stats(stats, timeInMilliSeconds, labels);
  }
};

exports.flush_stats = flush_stats;
