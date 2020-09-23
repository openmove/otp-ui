"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _leaflet = _interopRequireDefault(require("leaflet"));

var _lodash = _interopRequireDefault(require("lodash.isequal"));

var _types = require("@opentripplanner/core-utils/lib/types");

var _reactLeaflet = require("react-leaflet");

var _transitiveJs = _interopRequireDefault(require("transitive-js"));

var _transitiveStyles = _interopRequireDefault(require("./transitive-styles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("./leaflet-canvas-layer"); // TODO: move to util?


function checkHiPPI(canvas) {
  if (window.devicePixelRatio > 1) {
    const PIXEL_RATIO = 2;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    canvas.width *= PIXEL_RATIO;
    canvas.height *= PIXEL_RATIO;
    const context = canvas.getContext("2d");
    context.scale(PIXEL_RATIO, PIXEL_RATIO);
  }
}

const zoomFactors = [{
  minScale: 0,
  gridCellSize: 0,
  internalVertexFactor: 0,
  angleConstraint: 5,
  mergeVertexThreshold: 0,
  useGeographicRendering: true
}];

class TransitiveCanvasOverlay extends _reactLeaflet.MapLayer {
  // React Lifecycle Methods
  componentDidMount() {
    const {
      map
    } = this.props.leaflet;

    _leaflet.default.canvasLayer().delegate(this) // -- if we do not inherit from L.CanvasLayer  we can setup a delegate to receive events from L.CanvasLayer
    .addTo(map);
  }

  componentDidUpdate(prevProps) {
    // Check if we received new transitive data
    if (this.transitive && !(0, _lodash.default)(prevProps.transitiveData, this.props.transitiveData)) {
      this.transitive.updateData(this.props.transitiveData);
      if (!this.props.transitiveData) this.transitive.render();else this.updateBoundsAndRender();
    }

    if ( // this block only applies for profile trips where active option changed
    this.props.routingType === "PROFILE" && prevProps.activeItinerary !== this.props.activeItinerary) {
      if (this.props.activeItinerary == null) {
        // no option selected; clear focus
        this.transitive.focusJourney(null);
        this.transitive.render();
      } else if (this.props.transitiveData) {
        this.transitive.focusJourney(this.props.transitiveData.journeys[this.props.activeItinerary].journey_id);
        this.transitive.render();
      }
    }
  }

  componentWillUnmount() {
    if (this.transitive) {
      this.transitive.updateData(null);
      this.transitive.render();
    }
  } // Internal Methods


  initTransitive(canvas) {
    const {
      leaflet,
      transitiveData
    } = this.props;
    const {
      map
    } = leaflet; // set up the transitive instance

    const mapBounds = map.getBounds();
    this.transitive = new _transitiveJs.default({
      data: transitiveData,
      initialBounds: [[mapBounds.getWest(), mapBounds.getSouth()], [mapBounds.getEast(), mapBounds.getNorth()]],
      zoomEnabled: false,
      autoResize: false,
      styles: _transitiveStyles.default,
      zoomFactors,
      display: "canvas",
      canvas
    });
    checkHiPPI(canvas); // the initial map draw

    this.updateBoundsAndRender();
  }

  updateBoundsAndRender() {
    if (!this.transitive) {
      console.log("WARNING: Transitive object not set in transitive-canvas-overlay");
      return;
    }

    const mapBounds = this.props.leaflet.map.getBounds();
    this.transitive.setDisplayBounds([[mapBounds.getWest(), mapBounds.getSouth()], [mapBounds.getEast(), mapBounds.getNorth()]]);
    this.transitive.render();
  } // Leaflet Layer API Methods


  onDrawLayer(info) {
    if (!this.transitive) this.initTransitive(info.canvas);
    const mapSize = this.props.leaflet.map.getSize();

    if (this.lastMapSize && (mapSize.x !== this.lastMapSize.x || mapSize.y !== this.lastMapSize.y)) {
      const canvas = info.canvas;
      checkHiPPI(canvas);
      this.transitive.display.setDimensions(mapSize.x, mapSize.y);
      this.transitive.display.setCanvas(canvas);
    }

    this.updateBoundsAndRender();
    this.lastMapSize = this.props.leaflet.map.getSize();
  }

  createTile() {}

  createLeafletElement() {}

  updateLeafletElement() {}

}

TransitiveCanvasOverlay.propTypes = {
  /**
   * The transitiveData object is assumed to be the result of converting an
   * OpenTripPlanner itinerary result into a transitive-readable format. This is
   * typically done using the @opentripplanner/core-utils/map#itineraryToTransitive
   * function.
   */
  transitiveData: _types.transitiveDataType
};

var _default = (0, _reactLeaflet.withLeaflet)(TransitiveCanvasOverlay);

exports.default = _default;