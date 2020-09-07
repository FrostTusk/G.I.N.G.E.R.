const ginger = require('../../core/ginger')(true);

const interval = 1000; // 1 Second Intervals
const NUMBER_WANTED = 256;

function log(result) {
    console.log('Got result: ' + result);
    
    return result;
}

function doubleNumber(x) {
    return x * 2;
}

function end_early_if_number_wanted(end_result) {
    return end_result !== NUMBER_WANTED;
}

ginger.seesaws.TimerSeesaw({
    time_interval_in_seconds: interval,
    should_run_again_fn: end_early_if_number_wanted,
    moods: [doubleNumber, log],
    initialValue: 1
}).then(result => {
    console.log('Finished with result: ' + result);
}).catch(error => {
    console.error(error);
});