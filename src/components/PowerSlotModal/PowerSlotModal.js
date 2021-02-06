import React, { useCallback } from "react";

import ShadowModal from "../ShadowModal/";
import PowerSlotHeader from "./helpers/PowerSlotHeader.js";
import EnhancementSelection from "./helpers/EnhancementSelection.js";
import SetBonuses from "./helpers/SetBonuses.js";
import PowerStats from "./helpers/PowerStats.js";

import useActiveSets from "providers/builder/useActiveSets.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import { useTogglePowerSlot } from "hooks/powersets.js";
import { usePowerFromRef } from "hooks/powersets.js";

import styles from "./styles.module.scss";

export default function PowerSlotModal(props) {
  const {
    tracking: { toggledSlot },
  } = useActiveSets();
  const { powerSlots, updatePowerSlotNav } = usePowerSlots();
  const togglePowerSlot = useTogglePowerSlot(toggledSlot);

  const updateEnhancementNav = useCallback(
    (navSection, value) => {
      const updates = { [navSection]: value };
      if (navSection === "setType") {
        updates.setIndex = 0;
      }
      updatePowerSlotNav(toggledSlot, updates);
    },
    [toggledSlot]
  );

  const powerSlot = powerSlots[toggledSlot] || {};
  const power = usePowerFromRef(powerSlot.powerRef);

  if (!powerSlots[toggledSlot]) {
    return null;
  }

  return (
    <ShadowModal>
      <PowerSlotHeader
        powerSlot={powerSlot}
        power={power}
        powerSlotIndex={toggledSlot}
      />
      <section className={styles.main}>
        <EnhancementSelection
          nav={powerSlot.navigation}
          updateEnhancementNav={updateEnhancementNav}
          powerSlotIndex={toggledSlot}
        />
        <SetBonuses disabled={powerSlot.navigation.section !== "sets"} />
        <PowerStats />
      </section>
    </ShadowModal>
  );
}