"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("@opentripplanner/core-utils/lib/types");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _endpoint = _interopRequireDefault(require("./endpoint"));

var Styled = _interopRequireWildcard(require("./styled"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DefaultMapMarkerIcon({
  location,
  type
}) {
  return /*#__PURE__*/_react.default.createElement(Styled.StackedIconContainer, {
    title: location.name
  }, type === "from" ?
  /*#__PURE__*/
  // From icon should have white circle background
  _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Styled.StackedCircle, {
    size: 24
  }), /*#__PURE__*/_react.default.createElement(Styled.StackedLocationIcon, {
    size: 24,
    type: type
  })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Styled.StackedToIcon, {
    size: 24,
    type: "to"
  }), /*#__PURE__*/_react.default.createElement(Styled.ToIcon, {
    size: 20,
    type: type
  })));
}

DefaultMapMarkerIcon.propTypes = {
  location: _types.locationType.isRequired,
  type: _propTypes.default.string.isRequired
};

function EndpointsOverlay({
  clearLocation,
  forgetPlace,
  fromLocation,
  locations,
  MapMarkerIcon,
  rememberPlace,
  setLocation,
  showUserSettings,
  toLocation
}) {
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_endpoint.default, {
    clearLocation: clearLocation,
    forgetPlace: forgetPlace,
    location: fromLocation,
    locations: locations,
    MapMarkerIcon: MapMarkerIcon,
    rememberPlace: rememberPlace,
    setLocation: setLocation,
    showUserSettings: showUserSettings,
    type: "from"
  }), /*#__PURE__*/_react.default.createElement(_endpoint.default, {
    clearLocation: clearLocation,
    forgetPlace: forgetPlace,
    location: toLocation,
    locations: locations,
    MapMarkerIcon: MapMarkerIcon,
    rememberPlace: rememberPlace,
    setLocation: setLocation,
    showUserSettings: showUserSettings,
    type: "to"
  }));
}

EndpointsOverlay.propTypes = {
  /**
   * Dispatched when a user clicks on the clear location button in the user
   * settings. Not needed unless user settings is activated. Dispatched with an
   * argument in the form of:
   *
   * { type: "from/to" }
   */
  clearLocation: _propTypes.default.func,

  /**
   * Dispatched when a user clicks on the forget location button in the user
   * settings. Not needed unless user settings is activated. Dispatched with a
   * string argument representing the type of saved location.
   */
  forgetPlace: _propTypes.default.func,

  /**
   * The from location.
   */
  fromLocation: _types.locationType,

  /**
   * An array of location that the user has saved. Not needed unless user
   * settings is activated.
   */
  locations: _propTypes.default.arrayOf(_types.locationType),

  /**
   * An optional custom component that can be used to create custom html that
   * is used in a leaflet divIcon to render the map marker icon for each
   * endpoint.
   *
   * See https://leafletjs.com/reference-1.6.0.html#divicon
   *
   * This component is passed 2 props:
   * - location: either the from or to location depending on the endpoint
   * - type: either "from" or "to"
   */
  MapMarkerIcon: _propTypes.default.elementType,

  /**
   * Dispatched when a user clicks on the remember place button in the user
   * settings. Not needed unless user settings is activated. Dispatched with an
   * argument in the form of:
   *
   * { location: {...location}, type: "home/work" }
   */
  rememberPlace: _propTypes.default.func,

  /**
   * Dispatched when a location is dragged somewhere else on the map. Dispatched
   * with an argument in the form of:
   *
   * { location: {...location}, reverseGeocode: true, type: "from/to" }
   */
  setLocation: _propTypes.default.func.isRequired,

  /**
   * Whether or not to show the user settings popup when an endpoint is clicked.
   */
  showUserSettings: _propTypes.default.bool,

  /**
   * To to location
   */
  toLocation: _types.locationType
};

const noop = () => {};

EndpointsOverlay.defaultProps = {
  clearLocation: noop,
  forgetPlace: noop,
  fromLocation: undefined,
  rememberPlace: noop,
  locations: [],
  MapMarkerIcon: DefaultMapMarkerIcon,
  showUserSettings: false,
  toLocation: undefined
};
var _default = EndpointsOverlay;
exports.default = _default;