/**
 * Performs all moods given a time configuration.
 * Will keep happening so long as should_run_again is a function and returns true.
 *
 * @param {{
 *      time_interval_in_seconds: Number,
 *      should_run_again_fn: Function,
 *      moods: Array<Function>,
 *      initialValue: Any
 * }} Object Timer configuration
 * @returns {Promise} Returns a promise that resolves when should_run_again returns false. Will only reject when an error happens.
 */
function TimerSeesaw({ time_interval_in_seconds, should_run_again_fn, moods, initialValue } = {}) {
    return new Promise((resolve, reject) => {
        let intervalReference = null;
        let currentResult = initialValue;

        intervalReference = setInterval(() => {
            if (!Array.isArray(moods)) {
                return resolve(undefined);
            }

            currentResult = processMoods(moods, currentResult);

            const shouldRunAgain = typeof should_run_again_fn === 'function' ? should_run_again_fn(currentResult) : false;

            if (!shouldRunAgain) {
                clearInterval(intervalReference);
                return resolve(currentResult);
            }
        }, time_interval_in_seconds);
    });
}

/**
 * Takes in an array of functions and calls them sequentially,
 * passing the result of the previous mood into the next mood.
 *
 * @param {Array} moods
 * @param {*} initialValue Initial value passed to the first mood in the mood array.
 * @returns {*} Returns the end result of the last mood. If moods is not an array, returns back moods.
 */
function processMoods(moods, initialValue) {
    if (Array.isArray(moods)) {
        return moods.reduce((result, currentMood) => currentMood(result), initialValue);
    }

    return moods;
}

module.exports = TimerSeesaw;
