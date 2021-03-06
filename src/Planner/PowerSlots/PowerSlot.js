import React from "react";

import PunnettSquare from "components/PunnettSquare/";
import SlideDropdown from "components/SlideDropdown/";
import EnhancementBar from "components/EnhancementBar/";
import EnhancementSelection from "./EnhancementSelection.js";

import { useGetEnhancementSubSections } from "hooks/enhancements.js";
import { useSetNavSection } from "hooks/powerSlots.js";
import {
  useTogglePowerSlot,
  useClearActiveEnhancementSet,
  usePowerFromRef,
} from "hooks/powersets.js";
import useActiveSets from "providers/builder/useActiveSets.js";

import styles from "./styles.module.scss";

function PowerSlot(props) {
  const { slot } = props;
  const { level, powerRef, powerSlotIndex, navigation } = slot;
  const clearActiveEnhancementSet = useClearActiveEnhancementSet();
  const togglePowerSlot = useTogglePowerSlot(powerSlotIndex);
  const { tracking } = useActiveSets();
  const subsections = useGetEnhancementSubSections(powerSlotIndex);
  const power = usePowerFromRef(powerRef);

  const isSlottable =
    power && (!!power.allowedEnhancements.length || !!power.setTypes.length);

  const handlePillClick = React.useCallback(
    (e) => {
      e.stopPropagation();
      isSlottable && togglePowerSlot(e);
    },
    [togglePowerSlot, isSlottable]
  );

  const updateNav = useSetNavSection(powerSlotIndex);

  if (!powerRef || !power) {
    const isActive = tracking.activeLevel === level;
    return <EmptyPowerSlot level={level} isActive={isActive} />;
  }

  const isToggled = tracking.toggledSlot === powerSlotIndex;
  const zIndex = isToggled ? props.zIndex + 100 : props.zIndex;
  return (
    <div
      className={styles.powerContainer}
      key={powerSlotIndex}
      onClick={handlePillClick}
      style={{ zIndex: zIndex + 1 }}
    >
      <div className={styles.pill} style={{ zIndex: zIndex + 1 }}>
        <p className="pillText">
          ({level}) {power.displayName}
        </p>
      </div>
      {isSlottable && (
        <EnhancementBar powerSlotIndex={powerSlotIndex} zIndex={zIndex + 2} />
      )}
      <SlideDropdown
        powerSlotIndex={powerSlotIndex}
        isToggled={isToggled}
        zIndex={zIndex}
        onClick={clearActiveEnhancementSet}
      >
        <div className={styles.divider} />
        <PunnettSquare
          topOptions={getTopOptions(navigation, updateNav, power)}
          sideOptions={getSideOptions(navigation, updateNav, subsections)}
        >
          <EnhancementSelection powerSlotIndex={powerSlotIndex} />
        </PunnettSquare>
      </SlideDropdown>
    </div>
  );
}

function getTopOptions(enhNavigation, updateNav, power) {
  return [
    {
      content: "Standard",
      styles: {
        color: enhNavigation.section === "standard" ? "red" : null,
      },
      onClick: updateNav.bind(this, { section: "standard", tier: "IO" }),
    },
    {
      content: "Sets",
      styles: { color: enhNavigation.section === "sets" ? "red" : null },
      onClick: updateNav.bind(this, {
        section: "sets",
        tier: "IO",
        setType: power.setTypes[0],
      }),
    },
  ];
}

function getSideOptions(enhNavigation, updateNav, subsections) {
  const { section } = enhNavigation;
  const isSet = section === "sets";
  // console.log("SIDE OPTIONS: ", isSet, enhNavigation, updateNav, subsections);
  return subsections.map((category) => {
    const name = isSet ? category.name : category;
    const setType = isSet ? category.setType : name;
    const isActive = isSet
      ? setType === enhNavigation.setType
      : name === enhNavigation.tier;
    return {
      content: name,
      onClick: updateNav.bind(this, { setType }),
      style: {
        color: isActive ? "red" : "white",
        cursor: "pointer",
      },
    };
  });
}

function EmptyPowerSlot({ isActive, level }) {
  const { setTrackingManually } = useActiveSets();
  return (
    <div className={styles.powerContainer}>
      <div
        className={styles.power}
        onClick={setTrackingManually.bind(this, "activeLevel", level)}
        style={{ backgroundColor: isActive ? "green" : "grey" }}
      >
        <p>({level})</p>
      </div>
    </div>
  );
}

export default PowerSlot;
