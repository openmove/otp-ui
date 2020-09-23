"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const StandardWalk = ({
  title,
  ...props
}) => /*#__PURE__*/_react.default.createElement("svg", _extends({
  version: "1.1",
  viewBox: "0 0 32 32",
  height: "100%",
  width: "100%"
}, props), /*#__PURE__*/_react.default.createElement("g", null, /*#__PURE__*/_react.default.createElement("path", {
  d: "M17.1,0c1.5,0,2.7,1.2,2.7,2.7c0,1.5-1.2,2.7-2.7,2.7s-2.7-1.2-2.7-2.7C14.5,1.2,15.7,0,17.1,0z M25.2,16.6 c-0.4,0.5-1.1,0.7-1.7,0.3h0c0,0-3.7-2.5-3.9-2.7c-0.3-0.2-0.4-0.6-0.5-0.8c-0.1-0.2-0.5-1-0.8-1.5L18,13.3l-0.9,3.9 c0,0,4.6,5.4,4.7,5.5c0.1,0.1,0.2,0.5,0.3,0.7c0.1,0.2,1.2,6.6,1.2,6.6c0.2,1-0.5,1.9-1.4,2.1c-1,0.2-1.9-0.5-2.1-1.4l-1.2-6.3 l-3.8-4.1c0,0-0.8,3.9-0.9,4c0,0.1-0.1,0.2-0.1,0.3c0,0.1-3.9,6.7-3.9,6.7c-0.5,0.9-1.6,1.1-2.5,0.6c-0.9-0.5-1.1-1.6-0.6-2.5 l3.4-5.8L13,11l-1.9,1.5l-1,4.5c0,0,0,0,0,0c0,0.6-0.7,1.1-1.4,0.9c-0.6-0.1-1-0.4-0.9-1.4h0c0,0,1.1-5,1.1-5.2 c0.1-0.2,0.2-0.5,0.3-0.6c0.8-0.6,3.8-3.1,4.6-3.8c1-0.8,1.5-1.1,2.3-1.1c0.7,0,1.4,0.2,2.1,1C18.7,7.1,19,7.7,19.1,8 c0.2,0.3,2.2,4.4,2.2,4.4l3.6,2.5c0,0,0,0,0,0C25.5,15.3,25.6,16,25.2,16.6z"
})));

var _default = StandardWalk;
exports.default = _default;