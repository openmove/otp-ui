"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeFormat = getTimeFormat;
exports.getDateFormat = getDateFormat;
exports.getLongDateFormat = getLongDateFormat;
exports.formatDuration = formatDuration;
exports.formatDurationWithSeconds = formatDurationWithSeconds;
exports.formatTime = formatTime;
exports.formatSecondsAfterMidnight = formatSecondsAfterMidnight;
exports.getUserTimezone = getUserTimezone;
exports.getCurrentTime = getCurrentTime;
exports.getCurrentDate = getCurrentDate;
exports.OTP_API_TIME_FORMAT = exports.OTP_API_DATE_FORMAT = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// special constants for making sure the following date format is always sent to
// OTP regardless of whatever the user has configured as the display format
const OTP_API_DATE_FORMAT = "YYYY-MM-DD";
exports.OTP_API_DATE_FORMAT = OTP_API_DATE_FORMAT;
const OTP_API_TIME_FORMAT = "HH:mm";
/**
 * @param  {[type]} config the OTP config object found in store
 * @return {string}        the config-defined time formatter or HH:mm (24-hr time)
 */

exports.OTP_API_TIME_FORMAT = OTP_API_TIME_FORMAT;

function getTimeFormat(config) {
  return config.dateTime && config.dateTime.timeFormat ? config.dateTime.timeFormat : OTP_API_TIME_FORMAT;
}

function getDateFormat(config) {
  return config.dateTime && config.dateTime.dateFormat ? config.dateTime.dateFormat : OTP_API_DATE_FORMAT;
}

function getLongDateFormat(config) {
  return config.dateTime && config.dateTime.longDateFormat ? config.dateTime.longDateFormat : "D MMMM YYYY";
}
/**
 * Formats an elapsed time duration for display in narrative
 * TODO: internationalization
 * @param {number} seconds duration in seconds
 * @returns {string} formatted text representation
 */


function formatDuration(seconds) {
  const dur = _momentTimezone.default.duration(seconds, "seconds");

  let text = "";
  if (dur.hours() > 0) text += `${dur.hours()} hr, `;
  text += `${dur.minutes()} min`;
  return text;
}
/**
 * Formats an elapsed time in seconds, minutes, hours duration for display in narrative
 * TODO: internationalization
 * @param {number} seconds duration in seconds
 * @returns {string} formatted text representation
 */


function formatDurationWithSeconds(seconds) {
  const dur = _momentTimezone.default.duration(seconds, "seconds");

  let text = "";
  if (dur.hours() > 0) text += `${dur.hours()} hr, `;
  if (dur.minutes() > 0) text += `${dur.minutes()} min, `;
  text += `${dur.seconds()} sec`;
  return text;
}
/**
 * Formats a time value for display in narrative
 * TODO: internationalization/timezone
 * @param {number} ms epoch time value in milliseconds
 * @returns {string} formatted text representation
 */


function formatTime(ms, options) {
  return (0, _momentTimezone.default)(ms + (options && options.offset ? options.offset : 0)).format(options && options.format ? options.format : OTP_API_TIME_FORMAT);
}
/**
 * Formats a seconds after midnight value for display in narrative
 * @param  {number} seconds  time since midnight in seconds
 * @param  {string} timeFormat  A valid moment.js time format
 * @return {string}                   formatted text representation
 */


function formatSecondsAfterMidnight(seconds, timeFormat) {
  return (0, _momentTimezone.default)().startOf("day").seconds(seconds).format(timeFormat);
}
/**
 * Get the timezone name that is set for the user that is currently looking at
 * this website. Use a bit of hackery to force a specific timezone if in a
 * test environment.
 */


function getUserTimezone() {
  if (process.env.NODE_ENV === "test") return process.env.TZ; // FIXME There is an issue with tz.guess being undefined that has not yet been
  // resolved. https://github.com/opentripplanner/otp-ui/issues/152

  if (!_momentTimezone.default.tz || typeof _momentTimezone.default.tz.guess !== "function") {
    // eslint-disable-next-line no-console
    console.warn("Error guessing user's timezone (moment.tz or moment.tz.guess not defined). Defaulting to America/New_York.");
    return "America/New_York";
  }

  return _momentTimezone.default.tz.guess();
}
/**
 * Formats current time for use in OTP query
 * The conversion to the user's timezone is needed for testing purposes.
 */


function getCurrentTime(timezone = getUserTimezone()) {
  return (0, _momentTimezone.default)().tz(timezone).format(OTP_API_TIME_FORMAT);
}
/**
 * Formats current date for use in OTP query
 * The conversion to the user's timezone is needed for testing purposes.
 */


function getCurrentDate(timezone = getUserTimezone()) {
  return (0, _momentTimezone.default)().tz(timezone).format(OTP_API_DATE_FORMAT);
}