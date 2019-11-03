const moment = require('moment');

/**
 * This function will output a given event into an easily parsed log entry.
 * This output will make use of console.log.
 *
 * @param event
 *        The only parameter for this method, we only use 1 object because this allows for
 *        swift changes in the way we structure events.
 *        This object will include all the neccessary data for logging.
 *        All this data is optional.
 * @param event.message
 *        This attribute is simply the message that should be added to the event.
 *        The default is undefined.
 * @param event.source
 *        This attribute can take multiple values.
 *        If no source was provided, the source will be 'source: unkown source'.
 * @param event.tags
 *        An optional attribute to allow for more detailed filtering of the logs.
 *        The default is [].
 *
 * @post The event will be output using console.log in an easily parsed log entry.
 */
function myLog(event) {
  if (!event.tags) {
    event.tags = [];
  }

  let timestamp = moment().format();
  let entry = timestamp + '; ';

  if (!event.tags || event.tags.length == 0) {
    entry += '[]; ';
  } else {
    entry += '[';
    for (let i = 0; i < event.tags.length - 1; i++) {
      entry += event.tags[i] + ', ';
    }
    entry += event.tags[event.tags.length - 1] + ']; ';
  }

  if (event.source == 'hook') {
    entry += 'source: hook server; ';
  } else if (event.source == 'grappler') {
    entry += 'source: grappler client; ';
  } else if (event.source) {
    entry += 'source: ' + event.source + ' ';
  } else {
    entry += 'source: unknown source; ';
  }

  entry += event.message;
  console.log(entry);
}

module.exports.myLog = myLog;
