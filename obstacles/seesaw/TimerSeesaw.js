/**
 * Calls all callbacks in specified intervals until the should_terminate function returns a truthy value.
 *
 * @param {{
 *      interval: Number ms
 *      should_terminate: Function,
 *      callbacks: Array<Function>,
 * }} Object Timer configuration
 * @returns {Promise} Returns a promise that resolves when should_run_again returns false. Will only reject when an error happens.
 */
function TimerSeesaw({ interval, should_terminate, callbacks } = {}) {
    return new Promise((resolve, reject) => {
        let intervalReference = null;

        intervalReference = setInterval(() => {
            if (Array.isArray(callbacks)) {
                callbacks.forEach(callback => callback(this));
            }

            const terminate = typeof should_terminate === 'function' ? should_terminate(this) : false;

            if (terminate) {
                clearInterval(intervalReference);
                return resolve(this);
            }
        }, interval);
    });
}

module.exports = TimerSeesaw;
