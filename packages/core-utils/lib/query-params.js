"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatPlace = formatPlace;
exports.default = void 0;

var _itinerary = require("./itinerary");

var _storage = require("./storage");

var _time = require("./time");

/**
 * name: the default name of the parameter used for internal reference and API calls
 *
 * routingTypes: array of routing type(s) (ITINERARY, PROFILE, or both) this param applies to
 *
 * applicable: an optional function (accepting the current full query as a
 *   parameter) indicating whether this query parameter is applicable to the query.
 *   (Applicability is assumed if this function is not provided.)
 *
 * default: the default value for this parameter. The default can be also be a
 *  function that gets executed when accessing the default value.
 *
 * itineraryRewrite: an optional function for translating the key and/or value
 *   for ITINERARY mode only (e.g. 'to' is rewritten as 'toPlace'). Accepts the
 *   intial internal value as a function parameter.
 *
 * profileRewrite: an optional function for translating the value for PROFILE mode
 *
 * label: a text label for for onscreen display. May either be a text string or a
 *   function (accepting the current full query as a parameter) returning a string
 *
 * selector: the default type of UI selector to use in the form. Can be one of:
 *   - DROPDOWN: a standard drop-down menu selector
 *
 * options: an array of text/value pairs used with a dropdown selector
 *
 * TODO: validation system for rewrite functions and/or better user documentation
 * TODO: alphabetize below list
 */
// FIXME: Use for parsing URL values?
// const stringToLocation = string => {
//   const split = string.split(',')
//   return split.length === 2
//     ? {lat: split[0], lon: split[1]}
//     : {lat: null, lon: null}
// }

/**
 * Format location object as string for use in fromPlace or toPlace query param.
 */
function formatPlace(location, alternateName = "Place") {
  if (!location) return null;
  const name = location.name || `${alternateName} (${location.lat},${location.lon})`;
  return `${name}::${location.lat},${location.lon}`;
} // Load stored default query settings from local storage


const storedSettings = (0, _storage.getItem)("defaultQuery", {});
const queryParams = [{
  /* from - the trip origin. stored internally as a location (lat/lon/name) object  */
  name: "from",
  routingTypes: ["ITINERARY", "PROFILE"],
  default: null,
  itineraryRewrite: value => ({
    fromPlace: formatPlace(value, "Origin")
  }),
  profileRewrite: value => ({
    from: {
      lat: value.lat,
      lon: value.lon
    }
  }) // FIXME: Use for parsing URL values?
  // fromURL: stringToLocation

}, {
  /* to - the trip destination. stored internally as a location (lat/lon/name) object  */
  name: "to",
  routingTypes: ["ITINERARY", "PROFILE"],
  default: null,
  itineraryRewrite: value => ({
    toPlace: formatPlace(value, "Destination")
  }),
  profileRewrite: value => ({
    to: {
      lat: value.lat,
      lon: value.lon
    }
  }) // FIXME: Use for parsing URL values?
  // fromURL: stringToLocation

}, {
  /* date - the date of travel, in MM-DD-YYYY format */
  name: "date",
  routingTypes: ["ITINERARY", "PROFILE"],
  default: _time.getCurrentDate
}, {
  /* time - the arrival/departure time for an itinerary trip, in HH:mm format */
  name: "time",
  routingTypes: ["ITINERARY"],
  default: _time.getCurrentTime
}, {
  /* departArrive - whether this is a depart-at, arrive-by, or leave-now trip */
  name: "departArrive",
  routingTypes: ["ITINERARY"],
  default: "NOW",
  itineraryRewrite: value => ({
    arriveBy: value === "ARRIVE"
  })
}, {
  /* startTime - the start time for a profile trip, in HH:mm format */
  name: "startTime",
  routingTypes: ["PROFILE"],
  default: "07:00"
}, {
  /* endTime - the end time for a profile trip, in HH:mm format */
  name: "endTime",
  routingTypes: ["PROFILE"],
  default: "09:00"
}, {
  /* mode - the allowed modes for a trip, as a comma-separated list */
  name: "mode",
  routingTypes: ["ITINERARY", "PROFILE"],
  default: "WALK,TRANSIT",
  // TODO: make this dependent on routingType?
  profileRewrite: value => {
    const accessModes = [];
    const directModes = [];
    const transitModes = [];

    if (value && value.length > 0) {
      value.split(",").forEach(m => {
        if ((0, _itinerary.isTransit)(m)) transitModes.push(m);

        if ((0, _itinerary.isAccessMode)(m)) {
          accessModes.push(m); // TODO: make configurable whether direct-driving is considered

          if (!(0, _itinerary.isCar)(m)) directModes.push(m);
        }
      });
    }

    return {
      accessModes,
      directModes,
      transitModes
    };
  }
}, {
  /* showIntermediateStops - whether response should include intermediate stops for transit legs */
  name: "showIntermediateStops",
  routingTypes: ["ITINERARY"],
  default: true
}, {
  /* maxWalkDistance - the maximum distance in meters the user will walk to transit. */
  name: "maxWalkDistance",
  routingTypes: ["ITINERARY"],
  applicable: query => query.mode && (0, _itinerary.hasTransit)(query.mode) && query.mode.indexOf("WALK") !== -1,
  default: 1500,
  // 3/4 mi.
  selector: "DROPDOWN",
  label: "Distanza massima a piedi",
  options: [{
    text: "200 metri",
    value: 200
  }, {
    text: "500 metri",
    value: 500
  }, {
    text: "750 metri",
    value: 750
  }, {
    text: "1 Km",
    value: 1000
  }, {
    text: "1.5 Km",
    value: 1500
  }, {
    text: "2 Km",
    value: 2000
  }, {
    text: "3 Km",
    value: 3000
  }]
}, {
  /* maxBikeDistance - the maximum distance in meters the user will bike. Not
   * actually an OTP parameter (maxWalkDistance doubles for biking) but we
   * store it separately internally in order to allow different default values,
   * options, etc.  Translated to 'maxWalkDistance' via the rewrite function.
   */
  name: "maxBikeDistance",
  routingTypes: ["ITINERARY"],
  applicable: query => query.mode && (0, _itinerary.hasTransit)(query.mode) && query.mode.indexOf("BICYCLE") !== -1,
  default: 2000,
  // 3 mi.
  selector: "DROPDOWN",
  label: "Distanza massima in bici",
  options: [{
    text: "500 metri",
    value: 500
  }, {
    text: "750 metri",
    value: 750
  }, {
    text: "1 Km",
    value: 1000
  }, {
    text: "1.5 Km",
    value: 1500
  }, {
    text: "2 Km",
    value: 2000
  }, {
    text: "2.5 Km",
    value: 2500
  }, {
    text: "4 Km",
    value: 4000
  }, {
    text: "10 Km",
    value: 10000
  }, {
    text: "20 Km",
    value: 20000
  }, {
    text: "30 Km",
    value: 30000
  }],
  itineraryRewrite: value => ({
    maxWalkDistance: value,
    // ensures that the value is repopulated when loaded from URL params
    maxBikeDistance: value
  })
}, {
  /* optimize -- how to optimize a trip (non-bike, non-micromobility trips) */
  name: "optimize",
  applicable: query => (0, _itinerary.hasTransit)(query.mode) && !(0, _itinerary.hasBike)(query.mode),
  routingTypes: ["ITINERARY"],
  default: "QUICK",
  selector: "DROPDOWN",
  label: "Ottimizzato per",
  options: [{
    text: "Velocità",
    value: "QUICK"
  }, {
    text: "Pochi trasferimenti",
    value: "TRANSFERS"
  }]
}, {
  /* optimizeBike -- how to optimize an bike-based trip */
  name: "optimizeBike",
  applicable: query => (0, _itinerary.hasBike)(query.mode),
  routingTypes: ["ITINERARY"],
  default: "SAFE",
  selector: "DROPDOWN",
  label: "Optimize for",
  options: query => {
    const opts = [{
      text: "Velocità",
      value: "QUICK"
    }, {
      text: "Sicurezza",
      value: "SAFE"
    }, {
      text: "Pianeggiante",
      value: "FLAT"
    }]; // Include transit-specific option, if applicable

    if ((0, _itinerary.hasTransit)(query.mode)) {
      opts.splice(1, 0, {
        text: "Pochi trasferimenti",
        value: "TRANSFERS"
      });
    }

    return opts;
  },
  itineraryRewrite: value => ({
    optimize: value
  })
}, {
  /* maxWalkTime -- the maximum time the user will spend walking in minutes */
  name: "maxWalkTime",
  routingTypes: ["PROFILE"],
  default: 15,
  selector: "DROPDOWN",
  label: "Tempo massimo a piedi",
  applicable: query => query.mode && (0, _itinerary.hasTransit)(query.mode) && query.mode.indexOf("WALK") !== -1,
  options: [{
    text: "5 minuti",
    value: 5
  }, {
    text: "10 minuti",
    value: 10
  }, {
    text: "15 minuti",
    value: 15
  }, {
    text: "20 minuti",
    value: 20
  }, {
    text: "30 minuti",
    value: 30
  }, {
    text: "45 minuti",
    value: 45
  }, {
    text: "1 ora",
    value: 60
  }]
}, {
  /* walkSpeed -- the user's walking speed in m/s */
  name: "walkSpeed",
  routingTypes: ["ITINERARY", "PROFILE"],
  default: 1.11,
  selector: "DROPDOWN",
  label: "Velocità a piedi",
  applicable: query => query.mode && query.mode.indexOf("WALK") !== -1,
  options: [{
    text: "3 Kmh",
    value: 0.83
  }, {
    text: "4 Kmh",
    value: 1.11
  }, {
    text: "5 Kmh",
    value: 1.38
  }]
}, {
  /* maxBikeTime -- the maximum time the user will spend biking in minutes */
  name: "maxBikeTime",
  routingTypes: ["PROFILE"],
  default: 20,
  selector: "DROPDOWN",
  label: "Tempo massimo in bici",
  applicable: query => query.mode && (0, _itinerary.hasTransit)(query.mode) && query.mode.indexOf("BICYCLE") !== -1,
  options: [{
    text: "5 minuti",
    value: 5
  }, {
    text: "10 minuti",
    value: 10
  }, {
    text: "15 minuti",
    value: 15
  }, {
    text: "20 minuti",
    value: 20
  }, {
    text: "30 minuti",
    value: 30
  }, {
    text: "45 minuti",
    value: 45
  }, {
    text: "1 ora",
    value: 60
  }]
}, {
  /* bikeSpeed -- the user's bikeSpeed speed in m/s */
  name: "bikeSpeed",
  routingTypes: ["ITINERARY", "PROFILE"],
  default: 3.58,
  selector: "DROPDOWN",
  label: "Velocità in bici",
  applicable: query => query.mode && query.mode.indexOf("BICYCLE") !== -1,
  options: [{
    text: "10 Kmh",
    value: 2.77
  }, {
    text: "12 Kmh",
    value: 3.58
  }, {
    text: "14 Kmh",
    value: 3.88
  }, {
    text: "16 Kmh",
    value: 4.44
  }]
}, {
  /* maxEScooterDistance - the maximum distance in meters the user will ride
   * an E-scooter. Not actually an OTP parameter (maxWalkDistance doubles for
   * any non-transit mode except for car) but we store it separately
   * internally in order to allow different default values, options, etc.
   * Translated to 'maxWalkDistance' via the rewrite function.
   */
  name: "maxEScooterDistance",
  routingTypes: ["ITINERARY"],
  applicable: query => query.mode && (0, _itinerary.hasTransit)(query.mode) && (0, _itinerary.hasMicromobility)(query.mode),
  default: 4828,
  // 3 mi.
  selector: "DROPDOWN",
  label: "Maximum E-scooter Distance",
  options: [{
    text: "1/4 mile",
    value: 402.3
  }, {
    text: "1/2 mile",
    value: 804.7
  }, {
    text: "3/4 mile",
    value: 1207
  }, {
    text: "1 mile",
    value: 1609
  }, {
    text: "2 miles",
    value: 3219
  }, {
    text: "3 miles",
    value: 4828
  }, {
    text: "5 miles",
    value: 8047
  }, {
    text: "10 miles",
    value: 16093
  }, {
    text: "20 miles",
    value: 32187
  }, {
    text: "30 miles",
    value: 48280
  }],
  itineraryRewrite: value => ({
    maxWalkDistance: value,
    // ensures that the value is repopulated when loaded from URL params
    maxEScooterDistance: value
  })
}, {
  /* bikeSpeed -- the user's bikeSpeed speed in m/s */
  name: "watts",
  routingTypes: ["ITINERARY", "PROFILE"],
  default: 250,
  selector: "DROPDOWN",
  label: "E-scooter Power",
  // this configuration should only be allowed for personal E-scooters as these
  // settings will be defined by the vehicle type of an E-scooter being rented
  applicable: query => query.mode && query.mode.indexOf("MICROMOBILITY") !== -1 && query.mode.indexOf("MICROMOBILITY_RENT") === -1,
  options: [{
    text: "Kid's hoverboard (6mph)",
    value: 125
  }, {
    text: "Entry-level scooter (11mph)",
    value: 250
  }, {
    text: "Robust E-scooter (18mph)",
    value: 500
  }, {
    text: "Powerful E-scooter (24mph)",
    value: 1500
  }],
  // rewrite a few other values to add some baseline assumptions about the
  // vehicle
  itineraryRewrite: value => {
    const watts = value; // the maximum cruising and downhill speed. Units in m/s

    let maximumMicromobilitySpeed;
    let weight; // see https://en.wikipedia.org/wiki/Human_body_weight#Average_weight_around_the_world
    // estimate is for an average North American human with clothes and stuff
    // units are in kg

    const TYPICAL_RIDER_WEIGHT = 90;

    switch (watts) {
      case 125:
        // exemplar: Swagtron Turbo 5 hoverboard (https://swagtron.com/product/recertified-swagtron-turbo-five-hoverboard-classic/)
        maximumMicromobilitySpeed = 2.8; // ~= 6mph

        weight = TYPICAL_RIDER_WEIGHT + 9;
        break;

      case 250:
        // exemplar: Xiaomi M365 (https://www.gearbest.com/skateboard/pp_596618.html)
        maximumMicromobilitySpeed = 5; // ~= 11.5mph

        weight = TYPICAL_RIDER_WEIGHT + 12.5;
        break;

      case 500:
        // exemplar: Razor EcoSmart Metro (https://www.amazon.com/Razor-EcoSmart-Metro-Electric-Scooter/dp/B002ZDAEIS?SubscriptionId=AKIAJMXJ2YFJTEDLQMUQ&tag=digitren08-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B002ZDAEIS&ascsubtag=15599460143449ocb)
        maximumMicromobilitySpeed = 8; // ~= 18mph

        weight = TYPICAL_RIDER_WEIGHT + 30;
        break;

      case 1000:
        // exemplar: Boosted Rev (https://boostedboards.com/vehicles/scooters/boosted-rev)
        maximumMicromobilitySpeed = 11; // ~= 24mph

        weight = TYPICAL_RIDER_WEIGHT + 21;
        break;

      default:
        break;
    }

    return {
      maximumMicromobilitySpeed,
      watts,
      weight
    };
  }
}, {
  /* ignoreRealtimeUpdates -- if true, do not use realtime updates in routing */
  name: "ignoreRealtimeUpdates",
  routingTypes: ["ITINERARY"],
  default: false
}, {
  /* companies -- tnc companies to query */
  name: "companies",
  routingTypes: ["ITINERARY"],
  default: null
}, {
  /* wheelchair -- whether the user requires a wheelchair-accessible trip */
  name: "wheelchair",
  routingTypes: ["ITINERARY"],
  default: false,
  selector: "CHECKBOX",
  label: "Wheelchair Accessible",
  applicable: (query, config) => {
    if (!query.mode || !config.modes) return false;
    const configModes = (config.modes.accessModes || []).concat(config.modes.transitModes || []);
    return query.mode.split(",").some(mode => {
      const configMode = configModes.find(m => m.mode === mode);
      if (!configMode || !configMode.showWheelchairSetting) return false;
      if (configMode.company && (!query.companies || !query.companies.split(",").includes(configMode.company))) return false;
      return true;
    });
  }
}, {
  name: "bannedRoutes",
  routingTypes: ["ITINERARY"],
  default: ""
}, {
  name: "numItineraries",
  routingTypes: ["ITINERARY"],
  default: 3
}, {
  name: "intermediatePlaces",
  default: [],
  routingTypes: ["ITINERARY"],
  itineraryRewrite: places => Array.isArray(places) && places.length > 0 ? {
    intermediatePlaces: places.map(place => formatPlace(place)).join(",")
  } : undefined
}, {
  // Time penalty in seconds the requester is willing to accept in order to
  // complete journey on preferred route. I.e., number of seconds that we are
  // willing to wait for the preferred route.
  name: "otherThanPreferredRoutesPenalty",
  default: 15 * 60,
  // 15 minutes
  routingTypes: ["ITINERARY"]
}, {
  name: "preferredRoutes",
  routingTypes: ["ITINERARY"],
  default: ""
},
{
    name: "locale",
    routingTypes: ["ITINERARY"],
    default: "it",
}
]; // Iterate over stored settings and update query param defaults.
// FIXME: this does not get updated if the user defaults are cleared

queryParams.forEach(param => {
  if (param.name in storedSettings) {
    param.default = storedSettings[param.name];
    param.userDefaultOverride = true;
  }
});
var _default = queryParams;
exports.default = _default;
