import * as BaseMapStyled from "@opentripplanner/base-map/lib/styled";
import {
  languageConfigType,
  leafletPathType,
  stopLayerStopType
} from "@opentripplanner/core-utils/lib/types";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { CircleMarker, Popup } from "react-leaflet";

import * as Styled from "./styled";

export default class StopMarker extends Component {
  onClickView = () => {
    const { setViewedStop, stop } = this.props;
    setViewedStop({ stopId: stop.id });
  };

  onFromClick = () => {
    this.setLocation("from");
  };

  onToClick = () => {
    this.setLocation("to");
  };

  setLocation(locationType) {
    const { setLocation, stop } = this.props;
    const { lat, lon, name } = stop;
    setLocation({ location: { lat, lon, name }, locationType });
  }

  render() {
    const { languageConfig, leafletPath, radius, stop } = this.props;
    const { id, name, lat, lon } = stop;
    const idArr = id.split(":");

    return (
      <CircleMarker
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...leafletPath}
        center={[lat, lon]}
        radius={radius}
      >
        <Popup>
          <BaseMapStyled.MapOverlayPopup>
            <BaseMapStyled.PopupTitle>{name}</BaseMapStyled.PopupTitle>
            <BaseMapStyled.PopupRow>
              <b>Agency:</b> {idArr[0]}
            </BaseMapStyled.PopupRow>
            <BaseMapStyled.PopupRow>
              <span>
                <b>Stop ID:</b> {idArr[1]}
              </span>
              <Styled.ViewStopButton onClick={this.onClickView}>
                {languageConfig.stopViewer || "Vedi Stop"}
              </Styled.ViewStopButton>
            </BaseMapStyled.PopupRow>

            {/* The "Set as [from/to]" ButtonGroup */}
            <BaseMapStyled.PopupRow>
              <b>Viaggia:</b>
              <FromToLocationPicker
                onFromClick={this.onFromClick}
                onToClick={this.onToClick}
              />
            </BaseMapStyled.PopupRow>
          </BaseMapStyled.MapOverlayPopup>
        </Popup>
      </CircleMarker>
    );
  }
}

StopMarker.propTypes = {
  languageConfig: languageConfigType.isRequired,
  leafletPath: leafletPathType,
  radius: PropTypes.number,
  setLocation: PropTypes.func.isRequired,
  setViewedStop: PropTypes.func.isRequired,
  stop: stopLayerStopType.isRequired
};

StopMarker.defaultProps = {
  leafletPath: {
    color: "#000",
    fillColor: "#FFF",
    fillOpacity: 1,
    weight: 1
  },
  radius: 5
};
