import React from "react";

import { useGetBonusesForSet } from "hooks/enhancements.js";
import { useBuildAnalysis } from "hooks/powersets.js";
import getBonusTiersForPowerSlot from "js/getBonusTiersForPowerSlot.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import styles from "../styles.module.scss";

function SetBonuses({ set, powerSlotIndex }) {
  const { enhancements } = set;
  const getBonusesForSet = useGetBonusesForSet();
  const setBonuses = getBonusesForSet(set);
  const { lookup } = useBuildAnalysis();
  const { powerSlots } = usePowerSlots();
  const powerSlot = powerSlots[powerSlotIndex];

  const bonusTier =
    getBonusTiersForPowerSlot(powerSlot)[enhancements[0].setIndex] || 0;
  return (
    <div className={styles.hoverContainer}>
      <h3>Set Bonuses</h3>
      {setBonuses.reduce((acc, b, bonusIndex) => {
        const { unlocked, bonus } = b;
        const { displays } = bonus;
        const { bonusName } = bonus;
        const bonusCount = lookup.setBonuses[bonusName] || 0;
        const bonusColor = getBonusColor(unlocked, bonusCount, bonusTier);

        acc.push(
          <div key={bonusIndex} className={styles.bonusContainer}>
            <p style={bonusColor}>{`${
              bonusCount > 0 ? `x${bonusCount}` : ""
            }`}</p>
            <p style={bonusColor}>({unlocked})</p>
            <div className={styles.bonusText}>
              {displays.map((display) => (
                <p style={bonusColor} key={display}>
                  {display}
                </p>
              ))}
            </div>
          </div>
        );
        return acc;
      }, [])}
    </div>
  );
}

export default SetBonuses;

function getBonusColor(unlocked, bonusCount, bonusTier) {
  const willGetBonus = bonusCount < 5;
  const isBonusUnlocked = unlocked <= bonusTier;
  return {
    color: isBonusUnlocked
      ? bonusCount === 5
        ? "chartreuse"
        : bonusCount > 5
        ? "red"
        : "gold"
      : willGetBonus
      ? null
      : "grey",
    textDecoration: !isBonusUnlocked && !willGetBonus ? "line-through" : null,
  };
}
