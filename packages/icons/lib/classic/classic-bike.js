"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const ClassicBike = ({
  title,
  ...props
}) => /*#__PURE__*/_react.default.createElement("svg", _extends({
  xmlns: "http://www.w3.org/2000/svg",
  version: "1.1",
  viewBox: "0 0 100 61.3",
  height: "100%",
  width: "100%"
}, props), /*#__PURE__*/_react.default.createElement("path", {
  d: "M0,41.6C0,52.3,8.7,61,19.4,61c9.4,0,17.2-6.7,19-15.5c0.1,0,0.1,0,0.2,0c15.3-0.6,4.6,4.2,33-25.7c0.5,1.5,0.9,2.9,1.4,4.3  c-6.9,3-11.8,9.8-11.8,17.9c0,10.7,8.7,19.4,19.4,19.4c10.7,0,19.4-8.7,19.4-19.4s-8.7-19.4-19.4-19.4c-1.2,0-2.4,0.1-3.6,0.3  C69.5-1.5,71.9,0.1,57.9,0v3.9c10.2,0,8.9-0.6,11.2,7.3H35.3L34,7.5c7.6-1.7,9.7-1.7,8.2-3.7H25.1v3.8l4.5,0.1l1.3,3.6  c-2.1,4.6-3.8,8.5-5.3,11.9c-2-0.7-4-1-6.2-1C8.7,22.2,0,30.9,0,41.6z M74.4,28.4c4.8,15.4,4.4,15.1,6.3,15.3c1.1-0.1,1.9-0.9,1.9-2  c0-1.3,0.5,0.4-4.2-14.5c0.7-0.1,1.4-0.2,2.2-0.2c8.2,0,14.9,6.7,14.9,14.9s-6.7,14.9-14.9,14.9s-14.9-6.7-14.9-14.9  C65.7,35.9,69.3,30.7,74.4,28.4z M37,15.3l33,0.1L46.6,41L37,15.3z M29.4,24.9l3.6-8.1l9.4,24.6l-3.6,0C38.8,34.5,35,28.3,29.4,24.9  z M34.3,41.5l-12.3,0l5.6-12.4C31.6,31.8,34.2,36.3,34.3,41.5z M4.5,41.6c0-8.2,6.7-14.9,14.9-14.9c1.5,0,3,0.2,4.3,0.6  c-6.7,14.9-7,15.4-7,16.2c0.2,2.7,1.6,1.9,17.1,1.9c-1.7,6.3-7.5,11-14.3,11C11.2,56.4,4.5,49.8,4.5,41.6z"
}));

var _default = ClassicBike;
exports.default = _default;