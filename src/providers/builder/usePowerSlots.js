import React, { useState, createContext, useContext } from "react";

import powerSlotsTemplate from "data/powerSlotsTemplate.js";

const context = createContext();

export const PowerSlotsProvider = (props) => {
  const [powerSlots, setPowerSlots] = useState(powerSlotsTemplate);

  const { Provider } = context;

  const removePowerFromSlot = (index) => {
    const newSlots = [...powerSlots];
    newSlots[index] = powerSlotsTemplate[index];
  };

  const addPowerToSlot = (index, power) => {
    const newSlots = [...powerSlots];
    newSlots[index] = {
      ...newSlots[index],
      power,
      enhSlots: emptyDefaultSlot(),
    };
  };
  const state = { powerSlots, removePowerFromSlot, addPowerToSlot };
  return <Provider value={state}>{props.children}</Provider>;
};

export default () => useContext(context);

export function emptyDefaultSlot() {
  return [
    {
      slotLevel: null,
    },
  ];
}
