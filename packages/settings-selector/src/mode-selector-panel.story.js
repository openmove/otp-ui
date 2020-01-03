import React from "react";
import { action } from "@storybook/addon-actions";

import ModeSelectorPanel from "./mode-selector-panel";

const background = story => (
  <div
    style={{
      backgroundColor: "#F0F0F0",
      height: "300px",
      padding: "15px",
      fontFamily: "Hind, sans-serif"
    }}
  >
    {story()}
  </div>
);

const onChange = action("onChange");

export default {
  title: "ModeSelectorPanel",
  decorators: [background]
};

export const container = () => <ModeSelectorPanel onChange={onChange} />;
