"use strict";

var _path = _interopRequireDefault(require("path"));

var _nock = _interopRequireDefault(require("nock"));

var _ = _interopRequireDefault(require("."));

var _pelias = _interopRequireDefault(require("./geocoders/pelias"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mockResponsePath(geocoder, file) {
  return _path.default.join(__dirname, "test-fixtures", geocoder, file);
}

describe("geocoder", () => {
  const geocoders = [{
    type: "ARCGIS"
  }, {
    apiKey: "dummy-mapzen-key",
    baseUrl: "https://ws-st.trimet.org/pelias/v1",
    type: "PELIAS"
  }, // this entry represents no geocoder configuration. In this case it is
  // expected that the NoApiGeocoder will be used.
  undefined]; // nocks for ARCGIS

  const baseArcGisPath = "/arcgis/rest/services/World/GeocodeServer/";
  (0, _nock.default)("https://geocode.arcgis.com") // autocomplete
  .get(`${baseArcGisPath}suggest`).query(true).replyWithFile(200, mockResponsePath("arcgis", "suggest-response.json")) // reverse
  .get(`${baseArcGisPath}reverseGeocode`).query(true).replyWithFile(200, mockResponsePath("arcgis", "reverseGeocode-response.json")) // search
  .get(`${baseArcGisPath}findAddressCandidates`).query(true).replyWithFile(200, mockResponsePath("arcgis", "findAddressCandidates-response.json")) // a 2nd search for purposes of resolving getLocationFromGeocodedFeature test
  .get(`${baseArcGisPath}findAddressCandidates`).query(true).replyWithFile(200, mockResponsePath("arcgis", "findAddressCandidates-response.json")); // nocks for PELIAS

  const basePeliasPath = "/pelias/v1/";
  (0, _nock.default)("https://ws-st.trimet.org") // autocomplete
  .get(`${basePeliasPath}autocomplete`).query(true).replyWithFile(200, mockResponsePath("pelias", "autocomplete-response.json")) // search
  .get(`${basePeliasPath}search`).query(true).replyWithFile(200, mockResponsePath("pelias", "search-response.json")) // reverse, includes not using zip/country in returned location.name.
  .get(`${basePeliasPath}reverse`).query(true).replyWithFile(200, mockResponsePath("pelias", "reverse-response.json"));
  geocoders.forEach(geocoder => {
    const geocoderType = geocoder ? geocoder.type : "NoApiGeocoder"; // the describe is in quotes to bypass a lint rule

    describe(`${geocoderType}`, () => {
      it("should make autocomplete query", async () => {
        const result = await (0, _.default)(geocoder).autocomplete({
          text: "Mill Ends"
        });
        expect(result).toMatchSnapshot();
      });
      it("should make search query", async () => {
        const result = await (0, _.default)(geocoder).search({
          text: "Mill Ends"
        });
        expect(result).toMatchSnapshot();
      });
      it("should make reverse query", async () => {
        const result = await (0, _.default)(geocoder).reverse({
          point: {
            lat: 45.516198,
            lon: -122.67324
          }
        });
        expect(result).toMatchSnapshot();
      });
      it("should get location from geocode feature", async () => {
        let mockFeature;

        switch (geocoderType) {
          case "ARCGIS":
            mockFeature = {
              magicKey: "abcd",
              properties: {
                label: "Mill Ends City Park, Portland, OR, USA"
              },
              text: "Mill Ends City Park, Portland, OR, USA"
            };
            break;

          case "PELIAS":
            mockFeature = {
              geometry: {
                coordinates: [-122.67324, 45.516198],
                type: "Point"
              },
              properties: {
                label: "Mill Ends Park, Portland, OR, USA"
              }
            };
            break;

          case "NoApiGeocoder":
            mockFeature = {
              geometry: {
                coordinates: [-122.67324, 45.516198],
                type: "Point"
              },
              properties: {
                label: "45.516198, -122.673240"
              }
            };
            break;

          default:
            throw new Error(`no mock feature defined for geocoder type: ${geocoder.type}`);
        }

        const result = await (0, _.default)(geocoder).getLocationFromGeocodedFeature(mockFeature);
        expect(result).toMatchSnapshot();
      }); // geocoder-specific tests

      if (geocoderType === "PELIAS") {
        const mockSources = "gn,oa,osm,wof"; // sources should not be sent unless they are explicitly defined in the
        // query. See https://github.com/ibi-group/trimet-mod-otp/issues/239

        it("should not send sources in autocomplete by default", () => {
          // create mock API to check query
          const mockPeliasAPI = {
            autocomplete: query => {
              expect(query.sources).not.toBe(expect.anything());
              return Promise.resolve();
            }
          };
          const pelias = new _pelias.default(mockPeliasAPI, geocoder);
          pelias.autocomplete({
            text: "Mill Ends"
          });
        }); // should send sources if they're defined in the config

        it("should send sources in autocomplete if defined in config", () => {
          // create mock API to check query
          const mockPeliasAPI = {
            autocomplete: query => {
              expect(query.sources).toBe(mockSources);
              return Promise.resolve();
            }
          };
          const pelias = new _pelias.default(mockPeliasAPI, { ...geocoder,
            sources: mockSources
          });
          pelias.autocomplete({
            text: "Mill Ends"
          });
        }); // sources should not be sent unless they are explicitly defined in the
        // query. See https://github.com/ibi-group/trimet-mod-otp/issues/239

        it("should not send sources in search by default", () => {
          // create mock API to check query
          const mockPeliasAPI = {
            search: query => {
              expect(query.sources).not.toBe(expect.anything());
              return Promise.resolve();
            }
          };
          const pelias = new _pelias.default(mockPeliasAPI, geocoder);
          pelias.search({
            text: "Mill Ends"
          });
        }); // should send sources if they're defined in the config

        it("should send sources in search if defined in config", () => {
          // create mock API to check query
          const mockPeliasAPI = {
            search: query => {
              expect(query.sources).toBe(mockSources);
              return Promise.resolve();
            }
          };
          const pelias = new _pelias.default(mockPeliasAPI, { ...geocoder,
            sources: mockSources
          });
          pelias.search({
            text: "Mill Ends"
          });
        });
      }
    });
  });
});