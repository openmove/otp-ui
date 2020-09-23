"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _coreUtils = _interopRequireDefault(require("@opentripplanner/core-utils"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactLeaflet = require("react-leaflet");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * An overlay to view a collection of stops.
 */
class StopsOverlay extends _reactLeaflet.MapLayer {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "refreshStops", () => {
      const {
        leaflet,
        minZoom,
        refreshStops
      } = this.props;

      if (leaflet.map.getZoom() < minZoom) {
        this.forceUpdate();
        return;
      }

      const bounds = leaflet.map.getBounds();

      if (!bounds.equals(this.lastBounds)) {
        setTimeout(() => {
          refreshStops({
            minLat: bounds.getSouth(),
            maxLat: bounds.getNorth(),
            minLon: bounds.getWest(),
            maxLon: bounds.getEast()
          });
          this.lastBounds = bounds;
        }, 300);
      }
    });
  }

  componentDidMount() {
    // set up pan/zoom listener
    this.props.leaflet.map.on("moveend", this.refreshStops);
  } // TODO: determine why the default MapLayer componentWillUnmount() method throws an error


  componentWillUnmount() {
    // Remove the pan/zoom listener set up above.
    this.props.leaflet.map.off("moveend", this.refreshStops);
  }
  /**
   * this method is used for backporting to React 15
   * v16:  return this.props.leaflet;
   * v15:  return this.context;
   */


  getLeafletContext() {
    return this.props.leaflet;
  }

  createLeafletElement() {}

  updateLeafletElement() {}

  render() {
    const {
      leaflet,
      minZoom,
      StopMarker,
      stops
    } = this.props; // Don't render if below zoom threshold or no stops visible

    if (!leaflet || !leaflet.map || leaflet.map.getZoom() < minZoom || !stops || stops.length === 0) {
      return /*#__PURE__*/_react.default.createElement(_reactLeaflet.FeatureGroup, null);
    } // Helper to create StopMarker from stop


    const createStopMarker = stop => /*#__PURE__*/_react.default.createElement(StopMarker, {
      key: stop.id,
      stop: stop
    }); // Singleton case; return FeatureGroup with single StopMarker


    if (stops.length === 1) {
      return /*#__PURE__*/_react.default.createElement(_reactLeaflet.FeatureGroup, null, createStopMarker(stops[0]));
    } // Otherwise, return FeatureGroup with mapped array of StopMarkers


    return /*#__PURE__*/_react.default.createElement(_reactLeaflet.FeatureGroup, null, stops.map(stop => createStopMarker(stop)));
  }

}

StopsOverlay.propTypes = {
  /** the leaflet reference as obtained from the withLeaflet wrapper */

  /* eslint-disable-next-line react/forbid-prop-types */
  leaflet: _propTypes.default.object.isRequired,

  /**
   * The zoom number at which this overlay will begin to show stop markers.
   */
  minZoom: _propTypes.default.number,

  /**
   * A callback for refreshing the stops in the event of a map bounds or zoom
   * change event.
   */
  refreshStops: _propTypes.default.func.isRequired,

  /**
   * A react component that can be used to render a stop marker. The component
   * will be sent a single prop of stop which will be a stopLayerStopType.
   */
  StopMarker: _propTypes.default.elementType.isRequired,

  /**
   * The list of stops to create stop markers for.
   */
  stops: _propTypes.default.arrayOf(_coreUtils.default.types.stopLayerStopType).isRequired
};
StopsOverlay.defaultProps = {
  minZoom: 15,
  stopMarkerPath: undefined,
  stopMarkerRadius: undefined
};

var _default = (0, _reactLeaflet.withLeaflet)(StopsOverlay);

exports.default = _default;